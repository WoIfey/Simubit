"use server"

import prisma from "@/lib/prisma"

export default async function sellTransaction(id: string, count: string) {
    try {
        const crypto = await prisma.crypto.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!crypto) {
            throw new Error('Transaction not found');
        }

        const sellAmount = parseFloat(count);
        if (isNaN(sellAmount) || sellAmount <= 0 || sellAmount > crypto.units) {
            throw new Error('Invalid sell amount');
        }

        const response = await fetch(
            `https://api.coincap.io/v2/assets/${crypto.coin_id}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch current price');
        }

        const priceData = await response.json();
        const currentPrice = priceData.data.priceUsd;

        if (!currentPrice) {
            throw new Error('Invalid price data received');
        }

        const saleProceeds = sellAmount * currentPrice;

        const result = await prisma.$transaction(async (tx) => {
            const updatedCrypto = await tx.crypto.update({
                where: { id },
                data: {
                    units: {
                        decrement: sellAmount
                    }
                }
            });

            await tx.user.update({
                where: { id: crypto.user_id },
                data: {
                    balance: {
                        increment: saleProceeds
                    }
                }
            });

            if (updatedCrypto.units <= 0) {
                await tx.crypto.delete({
                    where: { id }
                });
                return 'Transaction Removed';
            }

            return 'Units Updated';
        });

        return result;

    } catch (error) {
        console.error('Error in removeTransaction:', error);
        throw error;
    }
}