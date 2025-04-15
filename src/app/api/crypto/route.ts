import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const res = await fetch(`https://rest.coincap.io/v3/assets?apiKey=${process.env.COINCAP_API_KEY}`, {
            next: { revalidate: 1800 }
        })
        if (!res.ok) throw new Error('Failed to fetch data')

        const api = await res.json()
        const coins = api.data.map((asset: Asset) => ({
            id: asset.id,
            name: asset.name,
            symbol: asset.symbol,
            cmc_rank: parseInt(asset.rank),
            circulating_supply: parseFloat(asset.supply),
            quote: {
                USD: {
                    price: parseFloat(asset.priceUsd),
                    percent_change_24h: parseFloat(asset.changePercent24Hr),
                    market_cap: parseFloat(asset.marketCapUsd)
                }
            }
        }))

        const nextRevalidation = new Date(Math.ceil(Date.now() / 1800000) * 1800000)

        return NextResponse.json({
            data: coins,
            nextRevalidation: nextRevalidation.getTime()
        })
    } catch (error) {
        console.error('Crypto API Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch cryptocurrency data' },
            { status: 500 }
        )
    }
}