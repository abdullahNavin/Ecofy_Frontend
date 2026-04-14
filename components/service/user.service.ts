import { cookies } from "next/headers";

export const userService = {

    getSession: async () => {
        try {
            const cookieStore = await cookies()

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/api/auth/get-session`, {
                headers: {
                    cookie: cookieStore.toString()
                },
                cache: 'no-store'
            })
            const session = await res.json()
            console.log("session:", session);
            return { data: session, error: null }

        } catch (_error) {
            return { data: null, error: "Failed to fetch session" }
        }
    }
}