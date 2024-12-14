import { NextResponse } from 'next/server'

interface CoinCapAsset {
    id: string
    rank: string
    symbol: string
    name: string
    supply: string
    priceUsd: string
    changePercent24Hr: string
    marketCapUsd: string
}

export async function GET() {
    try {
        const res = await fetch('https://api.coincap.io/v2/assets?limit=850')
        if (!res.ok) throw new Error('Failed to fetch data')

        const coinCapData = await res.json()

        const mappedData = coinCapData.data.map((asset: CoinCapAsset) => ({
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

        return NextResponse.json({ data: mappedData })
    } catch (error) {
        console.error('Crypto API Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch cryptocurrency data' },
            { status: 500 }
        )
    }
}