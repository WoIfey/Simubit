import type { NextAuthOptions, User, Session } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { JWT } from 'next-auth/jwt'

interface Props {
    session: Session,
    token: JWT,
}

export const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
    ],
    callbacks: {
        async session({ session, token }: Props) {
            session.user.id = token.sub || ''
            return Promise.resolve(session)
        },
    },
    pages: {
        signIn: '/auth/signin'
    }
}