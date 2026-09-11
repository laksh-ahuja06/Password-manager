import { VaultItemType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { decryptSecret, encryptSecret } from "@/lib/vault-crypto";

type VaultRequest = {
  kind?: "password" | "api-key";
  name?: string;
  account?: string;
  secret?: string;
};

function toItem(item: {
  id: number;
  type: VaultItemType;
  name: string;
  username: string | null;
  label: string | null;
  secretCiphertext: string;
}) {
  return {
    id: item.id,
    kind: item.type === VaultItemType.API_KEY ? "api-key" : "password",
    name: item.name,
    account: item.type === VaultItemType.API_KEY ? item.label ?? "" : item.username ?? "",
    secret: decryptSecret(item.secretCiphertext),
  };
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isTrash = searchParams.get("trash") === "true";
    const passwordsOnly = searchParams.get("type") === "password";
    const records = await prisma.vaultItem.findMany({
      where: {
        deletedAt: isTrash ? { not: null } : null,
        ...(passwordsOnly ? { type: VaultItemType.PASSWORD } : {}),
      },
      orderBy: { updatedAt: "desc" },
    });

    return Response.json(records.map(toItem));
  } catch (error) {
    console.error("Failed to load vault items:", error);
    return Response.json({ error: "Unable to load vault items." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as VaultRequest;
    const kind = body.kind;
    const name = clean(body.name);
    const account = clean(body.account);
    const secret = typeof body.secret === "string" ? body.secret : "";

    if ((kind !== "password" && kind !== "api-key") || !name || !account || !secret) {
      return Response.json({ error: "Complete every field before saving." }, { status: 400 });
    }

    const item = await prisma.vaultItem.create({
      data: {
        type: kind === "api-key" ? VaultItemType.API_KEY : VaultItemType.PASSWORD,
        name,
        username: kind === "password" ? account : null,
        label: kind === "api-key" ? account : null,
        secretCiphertext: encryptSecret(secret),
      },
    });

    return Response.json(toItem(item), { status: 201 });
  } catch (error) {
    console.error("Failed to save vault item:", error);
    return Response.json({ error: "Unable to save this vault item." }, { status: 500 });
  }
}
