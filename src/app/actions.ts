'use server'
import { removeTransaction, saveTransaction } from "@/server/db"
import { revalidatePath } from "next/cache"

export async function addTransaction(user_id: string, count: string, symbol: string, purchase: string, name: string) {
    await saveTransaction(user_id, count, symbol, purchase, name)
    revalidatePath('/')
    console.log(user_id, "bought", count, "of", name, (symbol), "at price", purchase)
}

export async function sellTransaction(id: string, count: string) {
    try {
        const result = await removeTransaction(id, count)
        if (result === 'Transaction Removed') {
            console.log("Sold and removed transaction with ID", id)
        } else {
            console.log("Sold units for transaction with ID", id)
        }
        revalidatePath('/')
    } catch (error) {
        console.error("Error selling transaction:", error)
    }
}