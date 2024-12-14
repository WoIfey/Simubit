'use client'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import buyTransaction from '@/actions/transactions/buy'
import { Session } from '@/lib/auth-client'
interface BuyButtonProps {
	symbol: string
	price: number
	name: string
	id: string
	balance: number
	session: Session | null
}

export default function BuyButton({
	symbol,
	price,
	name,
	id,
	balance,
	session,
}: BuyButtonProps) {
	const [open, setOpen] = useState(false)
	const [amount, setAmount] = useState('')
	const [percentage, setPercentage] = useState(0)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const maxPurchaseAmount = balance / price

	const total = amount ? parseFloat(amount) * price : 0
	const isValidAmount = total >= 0.01 && total <= balance

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!isValidAmount || !amount) return

		setIsLoading(true)
		setError(null)

		try {
			await buyTransaction(
				session?.user?.id ?? '',
				amount,
				symbol,
				price.toString(),
				name,
				id
			)
			setOpen(false)
			setAmount('')
			setPercentage(0)
			router.refresh()
		} catch (error) {
			setError('Failed to process transaction')
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleSliderChange = (value: number[]) => {
		const percentage = value[0]
		const newAmount = (maxPurchaseAmount * percentage) / 100
		setPercentage(percentage)
		setAmount(newAmount.toFixed(8))
		setError(null)
	}

	const handleInputChange = (value: string) => {
		if (value === '') {
			setAmount('')
			setPercentage(0)
			return
		}

		const sanitizedValue = value.replace(/[^\d.]/g, '')
		if (sanitizedValue === '.') {
			setAmount('0.')
			setPercentage(0)
			return
		}

		const numValue = parseFloat(sanitizedValue)
		if (isNaN(numValue)) return

		const newPercentage = Math.min((numValue / maxPurchaseAmount) * 100, 100)
		setAmount(sanitizedValue)
		setPercentage(newPercentage)
	}

	return (
		<>
			{session?.user && (
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20"
						>
							Buy
						</Button>
					</DialogTrigger>
					<DialogContent className="bg-black/95 backdrop-blur-xl border border-emerald-500/20">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold text-slate-200">
								Buy {name}
							</DialogTitle>
						</DialogHeader>

						<form onSubmit={handleSubmit} className="space-y-6 py-4">
							<div className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-200">
										Amount to buy
									</label>
									<div className="relative">
										<Input
											type="text"
											value={amount}
											onChange={e => handleInputChange(e.target.value)}
											className="bg-black/50 border-emerald-500/20 focus:border-emerald-500/40 text-slate-100"
											placeholder="0.00000000"
										/>
										<div className="absolute right-2 top-2.5 text-sm text-slate-400">
											{symbol}
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center gap-3">
										<Slider.Root
											className="relative flex items-center select-none touch-none w-full h-5"
											value={[percentage]}
											onValueChange={handleSliderChange}
											max={100}
											step={1}
										>
											<Slider.Track className="bg-emerald-500/20 relative grow rounded-full h-[3px]">
												<Slider.Range className="absolute bg-emerald-500 rounded-full h-full" />
											</Slider.Track>
											<Slider.Thumb
												className="block w-4 h-4 bg-black rounded-full border-2 border-emerald-500 hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black"
												aria-label="Amount"
											/>
										</Slider.Root>
										<div className="flex justify-end text-sm text-slate-400">
											<span>{percentage.toFixed(0)}%</span>
										</div>
									</div>
								</div>

								<div className="space-y-1.5 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-400">Price per {symbol}:</span>
										<span className="text-slate-200">
											$
											{price < 1
												? price.toPrecision(4)
												: price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-400">Total Cost:</span>
										<span className="text-slate-200">
											$
											{total.toLocaleString(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-400">Available Balance:</span>
										<span className="text-slate-200">
											${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
										</span>
									</div>
								</div>

								{error && <p className="text-red-400 text-sm">{error}</p>}
								{!isValidAmount && amount && (
									<p className="text-red-400 text-sm">
										{total < 0.01 ? 'Minimum purchase is $0.01' : 'Insufficient funds'}
									</p>
								)}
							</div>

							<div className="flex justify-end gap-2">
								<Button
									type="button"
									variant="ghost"
									onClick={() => setOpen(false)}
									className="hover:bg-white/5 text-slate-400 hover:text-slate-200"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={!isValidAmount || isLoading}
									className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 hover:text-emerald-400"
								>
									{isLoading ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin mr-2" />
											Processing...
										</>
									) : (
										'Confirm Purchase'
									)}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			)}
		</>
	)
}
