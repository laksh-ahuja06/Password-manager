import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    const { action } = await request.json() as { action?: "trash" | "restore" };

    if (!Number.isInteger(id) || (action !== "trash" && action !== "restore")) {
      return Response.json({ error: "Invalid vault action." }, { status: 400 });
    }

    await prisma.vaultItem.update({
      where: { id },
      data: { deletedAt: action === "trash" ? new Date() : null },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to update vault item:", error);
    return Response.json({ error: "Unable to update this vault item." }, { status: 500 });
  }
}
