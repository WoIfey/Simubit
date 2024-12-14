"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function resetProgress() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.id) {
        throw new Error('Unauthorized')
    }

    return await prisma.$transaction(async (tx) => {
        await tx.user.delete({
            where: { id: session.user.id }
        })

        return 'User Deleted'
    })
} 