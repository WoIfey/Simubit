'use server'
import { removeTransaction, saveTransaction, registerUser, findUsers } from "@/utils/handleDatabase"
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

export async function addUser(name: string, email: string, password: string) {
    try {
        const result = await registerUser(name, email, password)
        if (result === 'User Registered') {
            console.log("User registered")
            revalidatePath('/')
            return true
        }
    } catch (error) {
        console.error("Error finding user:", error)
        return false
    }
}

export async function findUser(email: string, password: string): Promise<boolean> {
    try {
        const result = await findUsers(email, password)
        if (result === 'User Found') {
            console.log("User found")
            revalidatePath('/')
            return true
        } else {
            console.log("User not found or incorrect password")
            revalidatePath('/')
            return false
        }
    } catch (error) {
        console.error("Error finding user:", error)
        return false
    }
}

/* export async function signOutUser() {
    revalidatePath('/')
} */