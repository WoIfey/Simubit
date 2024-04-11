'use client'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import { sellTransaction } from '@/app/actions'
function sell(id: string) {
	const count = prompt(`How many units to sell?`)
	if (count !== null) {
		sellTransaction(id, count)
	}
}

export default function SellButton(id: { id: string }) {
	return (
		<button
			onClick={() => sell(id.id)}
			className="flex justify-center items-center gap-0.5 rounded-md bg-red-700 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-red-600"
		>
			<MinusCircleIcon className="h-5 w-5" />
			<p className="pr-1">Sell</p>
		</button>
	)
}
