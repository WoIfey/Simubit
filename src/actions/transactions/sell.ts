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

        const sellAmount = Number(parseFloat(count).toFixed(8));
        const availableUnits = Number(crypto.units.toFixed(8));

        if (isNaN(sellAmount) || sellAmount <= 0 || sellAmount > availableUnits) {
            throw new Error('Invalid sell amount');
        }

        const response = await fetch(`https://rest.coincap.io/v3/assets/${crypto.coin_id}?apiKey=${process.env.COINCAP_API_KEY}`, { next: { revalidate: 10800 } });

        if (!response.ok) {
            throw new Error('Failed to fetch current price');
        }

        const priceData = await response.json();
        const currentPrice = parseFloat(priceData.data.priceUsd);

        if (!currentPrice) {
            throw new Error('Invalid price data received');
        }

        const saleProceeds = Math.round(sellAmount * currentPrice * 100) / 100;

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

            if (Number(updatedCrypto.units.toFixed(8)) <= 0) {
                await tx.crypto.delete({
                    where: { id }
                });
                return 'Transaction Removed';
            }

            return 'Units Updated';
        });

        return result;

    } catch (error) {
        console.error('Error in sellTransaction:', error);
        throw error;
    }
}