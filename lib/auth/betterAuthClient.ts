// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_API_URL! + "/api/v1/better-auth",
//   credentials: "include",
// });

// export const { useSession, signIn, signUp, signOut } = authClient;



// ----------------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { User } from "@/types";

type SessionData = {
  user: User;
};

type UseSessionResult = {
  data: SessionData | null;
  isPending: boolean;
  error: Error | null;
};

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ecofy-auth-changed"));
  }
}

export function useSession(): UseSessionResult {
  const [data, setData] = useState<SessionData | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      setIsPending(true);
      try {
        const user = await api.auth.me();
        if (!active) return;
        setData({ user });
        setError(null);
      } catch (err) {
        if (!active) return;
        setData(null);
        setError(err instanceof Error ? err : new Error("Failed to fetch session"));
      } finally {
        if (active) {
          setIsPending(false);
        }
      }
    };

    loadSession();

    const handleAuthChange = () => {
      loadSession();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("ecofy-auth-changed", handleAuthChange);
    }

    return () => {
      active = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("ecofy-auth-changed", handleAuthChange);
      }
    };
  }, []);

  return { data, isPending, error };
}

export const signOut = async () => {
  await api.auth.logout();
  emitAuthChange();
};

export const signIn = {
  email: async (params: { email: string; password: string }) => {
    const result = await api.auth.login(params);
    emitAuthChange();
    return result;
  },
};

export const signUp = {
  email: async (params: { name: string; email: string; password: string }) => {
    const result = await api.auth.signup(params);
    emitAuthChange();
    return result;
  },
};
