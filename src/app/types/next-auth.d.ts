import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        isAdmin: boolean
        id: string
    }

    interface Session {
        user: {
            id: string
            isAdmin: number
            image: string
            email: string,
            name: string
        },
        userId: string | any
        admin: boolean,
        accessToken: any,
        token: {
            accessToken: string,
            id: string,
            admin: number
        }
    }
}