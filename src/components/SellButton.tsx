'use client'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import { sellTransaction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type Props = {
	id: string
	symbol: string
	price: number
	name: string
}

function sell(id: string, count: string) {
	if (count !== null) {
		sellTransaction(id, count)
	}
}

export default function SellButton({ id, symbol, price, name }: Props) {
	const [open, setOpen] = useState(false)
	const [count, setCount] = useState('0.00000001')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		sell(id, count)
		setOpen(false)
		setCount('0.00000001')
	}
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value)
		if (!isNaN(value)) {
			setCount(value.toFixed(8))
		}
	}
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="bg-red-700 hover:bg-red-600" size="sm">
					<MinusCircleIcon className="h-5 w-5" />
					<p className="pr-1 pl-1">Sell</p>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] bg-slate-900 text-white">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Sell {name}</DialogTitle>
						<DialogDescription className="text-slate-500">
							How much of {symbol} are you selling?
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<div className="flex flex-col gap-4 pt-2">
							<Label htmlFor="units">
								Selling {count} units of {symbol} at{' '}
								{Number(price).toLocaleString('fi-FI', {
									style: 'currency',
									currency: 'USD',
								})}
							</Label>
							<Input
								id="units"
								type="number"
								step="0.00000001"
								defaultValue="0.00000001"
								className="text-black"
								onChange={handleInputChange}
								value={count}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" className="bg-sky-700 hover:bg-sky-600">
							Sell
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
