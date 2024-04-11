'use client'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { addTransaction } from '@/app/actions'

type User =
	| {
			name?: string | null | undefined
			email?: string | null | undefined
			image?: string | null | undefined
			id?: string | null | undefined
	  }
	| undefined

type Props = {
	user: User
	symbol: string
	price: number
	name: string
}

function buy(user: User, symbol: string, price: string, name: string) {
	const count = prompt(`How many ${symbol}?`)
	if (count !== null && user && user.id) {
		addTransaction(user.id, count, symbol, price, name)
	}
}

export default function BuyButton({ user, symbol, price, name }: Props) {
	return (
		<button
			onClick={() => buy(user, symbol, price.toString(), name)}
			className="flex items-center justify-center gap-0.5 rounded-md bg-blue-700 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-blue-600"
		>
			<PlusCircleIcon className="h-5 w-5" />
			<p className="pr-1">Buy</p>
		</button>
	)
}
