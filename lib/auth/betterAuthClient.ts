// import { createAuthClient } from "better-auth/react";

// export const authClient = createAuthClient({
//   baseURL: process.env.NEXT_PUBLIC_API_URL! + "/api/v1/better-auth",
//   credentials: "include",
// });

// export const { useSession, signIn, signUp, signOut } = authClient;



// ----------------------------------------------------------------------------------

import { createAuthClient } from "better-auth/react"

import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  // Since the backend uses the native standard '/api/auth/*splat' integration mapping,
  // we strictly want to point our baseURL onto the exact backend host structure (Port 5000).
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  credentials: "include", 
})

export const { useSession, signIn, signUp, signOut } = authClient;
