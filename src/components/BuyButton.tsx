'use client'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { addTransaction } from '@/app/actions'
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

function buy(
	user: User,
	symbol: string,
	price: number,
	name: string,
	count: string
) {
	if (count !== null && user && user.id) {
		addTransaction(user.id, count, symbol, price.toString(), name)
	}
}

export default function BuyButton({ user, symbol, price, name }: Props) {
	const [open, setOpen] = useState(false)
	const [count, setCount] = useState('0.00000001')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		buy(user, symbol, price, name, count)
		setOpen(false)
		setCount('0.00000001')
	}
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value)
		if (!isNaN(value) && value >= 0) {
			setCount(value.toFixed(8))
		} else {
			setCount('0.00000000')
		}
	}
	return (
		<>
			{user && (
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className="bg-blue-700 hover:bg-blue-600" size="sm">
							<PlusCircleIcon className="h-5 w-5" />
							<p className="pr-1 pl-1">Buy</p>
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px] bg-slate-900 text-white">
						<form onSubmit={handleSubmit}>
							<DialogHeader>
								<DialogTitle>Buy {name}</DialogTitle>
								<DialogDescription className="text-slate-500">
									How much of {symbol} are you buying?
								</DialogDescription>
							</DialogHeader>
							<div className="py-4">
								<div className="flex flex-col gap-4 pt-2">
									<Label htmlFor="units">
										Buying {count} units of {symbol} at{' '}
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
									Purchase
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			)}
		</>
	)
}
