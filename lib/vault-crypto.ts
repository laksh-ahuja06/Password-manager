import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const algorithm = "aes-256-gcm";
const encryptionKey = process.env.VAULT_ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error("VAULT_ENCRYPTION_KEY is not configured.");
}

const key = scryptSync(encryptionKey, "keepsafe-local-vault", 32);

export function encryptSecret(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted].map((part) => part.toString("base64url")).join(".");
}

export function decryptSecret(value: string) {
  const [encodedIv, encodedTag, encodedSecret] = value.split(".");

  if (!encodedIv || !encodedTag || !encodedSecret) {
    throw new Error("This saved secret has an invalid encrypted format.");
  }

  const decipher = createDecipheriv(algorithm, key, Buffer.from(encodedIv, "base64url"));
  decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encodedSecret, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
