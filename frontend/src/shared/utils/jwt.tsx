import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

interface JwtPayload {
  email: string;
  userId: string;
  exp: number;
}

function decodeBase64Url(base64UrlString: string): string {
  let base64 = base64UrlString.replace(/-/g, "+").replace(/_/g, "/");
  let paddingNeeded = (4 - (base64.length % 4)) % 4;
  base64 += "=".repeat(paddingNeeded);
  return Buffer.from(base64, "base64").toString();
}

function parseJwt(token: string): { payload: JwtPayload } {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT: The token must have three parts");
  }

  const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;

  return { payload };
}

export function parseToken(): JwtPayload {
  const token = localStorage.getItem("access_token") || "";

  try {
    const decoded = parseJwt(token);
    return decoded.payload;
  } catch (error) {
    console.error(error);
    return { email: "", userId: "", exp: 0 };
  }
}
