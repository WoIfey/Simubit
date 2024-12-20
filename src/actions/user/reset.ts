"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function resetProgress() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || !session.user || !session.user.id) {
        throw new Error('Unauthorized')
    }

    return await prisma.$transaction(async (tx) => {
        await tx.crypto.deleteMany({
            where: { user_id: session.user.id }
        })

        await tx.user.update({
            where: { id: session.user.id },
            data: { balance: 10000 }
        })

        return 'Progress Reset'
    })
} 