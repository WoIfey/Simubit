type Asset = {
    id: string
    rank: string
    symbol: string
    name: string
    supply: string
    priceUsd: string
    changePercent24Hr: string
    marketCapUsd: string
}

type BuyButtonProps = {
    symbol: string
    price: number
    name: string
    id: string
    balance: number
    session: Session | null
}

type CryptoData = {
    id: string
    name: string
    symbol: string
    quote: {
        USD: {
            price: number
            percent_change_24h: number
        }
    }
}

type Transaction = {
    id: string
    units: number
    name: string
    symbol: string
    purchase_price: number
    createdAt: Date
    updatedAt: Date
    user:
    | {
        id: string
        createdAt: Date
        updatedAt: Date
        email: string
        emailVerified: boolean
        name: string
        image?: string | null
        balance: number
    }
    | undefined
}

type SellButtonProps = {
    id: string
    symbol: string
    price: number
    name: string
    units: number
    session: Session | null
}