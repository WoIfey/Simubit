import { db } from './db'
import bcrypt from 'bcrypt'

export async function getTransactions(id: string) {
    const res = await db.query("SELECT * FROM crypto WHERE user_id = $1", [id])
    return res.rows
}

export async function saveTransaction(user_id: string, units: string, symbol: string, price: string, name: string) {
    try {
        await db.query("INSERT INTO crypto(user_id, units, symbol, purchase_price, name) VALUES ($1, $2, $3, $4, $5)", [user_id, units, symbol, price, name])
        return 'Saved Transaction'
    } catch (error) {
        console.log(error)
        return 'Something went wrong'
    }
}

export async function removeTransaction(id: string, count: string) {
    try {
        await db.query("UPDATE crypto SET units = units - $1 WHERE id = $2", [count, id])
        const result = await db.query("SELECT units FROM crypto WHERE id = $1", [id])
        if (result.rows.length > 0 && parseFloat(result.rows[0].units) <= 0.00000000) {
            await db.query("DELETE FROM crypto WHERE id = $1", [id])
            return 'Transaction Removed'
        }
        return 'Units Updated'
    } catch (error) {
        console.log(error)
        return 'Something went wrong'
    }
}

export async function registerUser(name: string, email: string, password: string) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query("INSERT INTO users(name, email, password) VALUES ($1, $2, $3)", [name, email, hashedPassword])
        return 'User Registered'
    } catch (error) {
        console.log(error)
        return 'Something went wrong'
    }
}

export async function findUsers(email: string, password: string) {
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if (result.rows.length > 0) {
            const user = result.rows[0]

            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (isPasswordCorrect) {
                return user
            } else {
                return null
            }
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}