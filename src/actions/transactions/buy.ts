"use server"

import prisma from "@/lib/prisma"

export default async function buyTransaction(user_id: string, units: string, symbol: string, price: string, name: string, coin_id: string) {
    try {
        const total = parseFloat(units) * parseFloat(price)

        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: user_id }
            })

            if (!user || user.balance < total) {
                throw new Error('Insufficient funds')
            }

            const existingCrypto = await tx.crypto.findFirst({
                where: {
                    user_id,
                    coin_id
                }
            })

            if (existingCrypto) {
                await tx.crypto.update({
                    where: { id: existingCrypto.id },
                    data: {
                        units: existingCrypto.units + parseFloat(units),
                        purchase_price: (existingCrypto.units * existingCrypto.purchase_price + parseFloat(units) * parseFloat(price)) /
                            (existingCrypto.units + parseFloat(units))
                    }
                })
            } else {
                await tx.crypto.create({
                    data: {
                        user_id,
                        units: parseFloat(units),
                        symbol,
                        purchase_price: parseFloat(price),
                        name,
                        coin_id
                    }
                })
            }

            await tx.user.update({
                where: { id: user_id },
                data: {
                    balance: {
                        decrement: total
                    }
                }
            })

            return 'Saved Transaction'
        })
    } catch (error) {
        console.error('Error saving transaction:', error)
        throw error
    }
}