import type { WorkerBindings } from "@/types";

function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);

  const maxLength = Math.max(aBytes.length, bBytes.length);
  let result = aBytes.length ^ bBytes.length;

  for (let i = 0; i < maxLength; i++) {
    const left = i < aBytes.length ? aBytes[i] : 0;
    const right = i < bBytes.length ? bBytes[i] : 0;
    result |= left ^ right;
  }

  return result === 0;
}

const jsonError = (status: 400 | 401, message: string, challenge = false) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (challenge) {
    headers["WWW-Authenticate"] = 'Basic realm="RDEBRID Access", charset="UTF-8"';
  }

  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      status,
      headers,
    }
  );
};

export async function optionalBasicAuth(
  request: Request,
  env: WorkerBindings
): Promise<Response | null> {
  // If USERNAME and PASSWORD are not set, skip authentication
  if (!env.USERNAME || !env.PASSWORD) {
    return null; // No authentication required
  }

  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return jsonError(401, "Authentication required", true);
  }

  const [scheme, encoded] = authorization.split(" ", 2);
  if (!encoded || scheme.toLowerCase() !== "basic") {
    return jsonError(400, "Invalid authorization format");
  }

  let credentials = "";
  try {
    credentials = atob(encoded);
  } catch {
    return jsonError(400, "Invalid authorization encoding");
  }

  const separatorIndex = credentials.indexOf(":");
  if (separatorIndex < 0) {
    return jsonError(400, "Invalid authorization payload");
  }

  const username = credentials.slice(0, separatorIndex);
  const password = credentials.slice(separatorIndex + 1);

  if (!timingSafeEqual(username, env.USERNAME) || !timingSafeEqual(password, env.PASSWORD)) {
    return jsonError(401, "Invalid credentials", true);
  }

  return null; // Authentication successful
}
