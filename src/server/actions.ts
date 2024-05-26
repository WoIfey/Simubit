'use server'
import { removeTransaction, saveTransaction } from "@/server/db"

export async function addTransaction(user_id: string, count: string, symbol: string, purchase: string, name: string) {
    await saveTransaction(user_id, count, symbol, purchase, name)
}

export async function sellTransaction(id: string, count: string) {
    await removeTransaction(id, count)
}