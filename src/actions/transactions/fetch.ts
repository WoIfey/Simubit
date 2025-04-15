"use server"
import { prisma } from "@/lib/prisma"

export default async function getTransactions(id: string) {
    return prisma.crypto.findMany({
        where: { user_id: id },
        orderBy: { createdAt: 'desc' }
    })
}

export async function getNotice() {
    return prisma.notice.findFirst()
}