import { cookies } from "next/headers";
import type { User } from "@/types";

function normalizeOrigin(value: string) {
  return value.replace(/\/+$/, "");
}

function getApiOrigin() {
  return normalizeOrigin(
    process.env.BACKEND_PROXY_TARGET ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:5000"
  );
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  if (!sessionToken) return null;

  const res = await fetch(`${getApiOrigin()}/api/v1/auth/me`, {
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}
