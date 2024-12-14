'use client'
import BuyButton from '../components/BuyButton'
import SellButton from '../components/SellButton'
import { useEffect, useState, useMemo } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../components/ui/table'
import { calcResult } from '@/lib/calcResult'
import { Loader2, TrendingDown, TrendingUp } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import NumberFlow from '@number-flow/react'
import { Input } from '@/components/ui/input'
import { Session } from '@/lib/auth-client'
interface CryptoData {
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

interface Transaction {
	id: string
	units: number
	name: string
	symbol: string
	purchase_price: number
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

const PaginationWrapper = ({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}) => {
	if (totalPages <= 1) return null

	const getPageNumbers = () => {
		const pages = []
		const showPages = 5
		let start = Math.max(1, currentPage - 2)
		const end = Math.min(totalPages, start + showPages - 1)

		if (end - start + 1 < showPages) {
			start = Math.max(1, end - showPages + 1)
		}

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}
		return pages
	}

	return (
		<Pagination className="pt-6 flex justify-center select-none">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={e => {
							e.preventDefault()
							if (currentPage > 1) onPageChange(currentPage - 1)
						}}
						className={`bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 ${
							currentPage === 1 ? 'pointer-events-none opacity-50' : ''
						}`}
					/>
				</PaginationItem>

				{getPageNumbers().map(pageNum => (
					<PaginationItem key={pageNum}>
						<PaginationLink
							onClick={e => {
								e.preventDefault()
								onPageChange(pageNum)
							}}
							className={`${
								pageNum === currentPage
									? 'bg-emerald-500/20'
									: 'bg-emerald-500/10 hover:bg-emerald-500/20'
							} border-emerald-500/20`}
						>
							{pageNum}
						</PaginationLink>
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						onClick={e => {
							e.preventDefault()
							if (currentPage < totalPages) onPageChange(currentPage + 1)
						}}
						className={`bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 ${
							currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
						}`}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	)
}

export default function Crypto({
	api,
	initialBalance,
	session,
}: {
	api: Transaction[]
	initialBalance: number
	session: Session | null
}) {
	const [data, setData] = useState<CryptoData[] | null>(null)
	const [cryptoCurrentPage, setCryptoCurrentPage] = useState(1)
	const [ordersCurrentPage, setOrdersCurrentPage] = useState(1)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')

	const cryptoPageData = useMemo(() => {
		const filteredData =
			data?.filter(
				crypto =>
					crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
			) || []
		const startIndex = (cryptoCurrentPage - 1) * 10
		return filteredData.slice(startIndex, startIndex + 10)
	}, [data, searchQuery, cryptoCurrentPage])

	const cryptoTotalPages = useMemo(() => {
		const filteredLength = (
			data?.filter(
				crypto =>
					crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
			) || []
		).length
		return Math.ceil(filteredLength / 10) || 0
	}, [data, searchQuery])

	const ordersPageData = useMemo(() => {
		const startIndex = (ordersCurrentPage - 1) * 10
		return api.slice(startIndex, startIndex + 10)
	}, [api, ordersCurrentPage])

	const ordersTotalPages = useMemo(() => {
		return Math.ceil(api.length / 10) || 0
	}, [api])

	const totalBalance = useMemo(() => {
		if (!data || !api.length) return 0
		return api.reduce((total, { symbol, units }) => {
			const currentPrice =
				data.find(crypto => crypto.symbol === symbol)?.quote.USD.price || 0
			return total + currentPrice * units
		}, 0)
	}, [data, api])

	useEffect(() => {
		const fetchCoins = async (retries = 3, delay = 1000) => {
			try {
				const apiData = await fetch('/api/crypto')
				if (!apiData.ok) throw new Error(`Error fetching data: ${apiData.status}`)
				const { data } = await apiData.json()
				setData(data)
				setError(null)
			} catch (err) {
				if (retries > 0) {
					setTimeout(() => fetchCoins(retries - 1, delay * 1.5), delay)
				} else {
					setError(err instanceof Error ? err.message : 'Failed to fetch data')
				}
			}
		}

		fetchCoins()
		const intervalId = setInterval(fetchCoins, 7500)
		return () => clearInterval(intervalId)
	}, [])

	if (error) {
		return (
			<div className="w-full min-h-dvh flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="bg-red-500/10 p-4 rounded-full inline-block">
						<TrendingDown className="h-8 w-8 text-red-500" />
					</div>
					<p className="text-red-500 text-xl font-medium">{error}</p>
				</div>
			</div>
		)
	}

	if (!data) {
		return (
			<div className="w-full min-h-dvh flex items-center justify-center">
				<div className="text-center space-y-4">
					<Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto" />
					<p className="text-slate-400">Loading market data...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="relative w-full min-h-dvh pt-20 sm:pt-24 pb-4 px-4 sm:px-6 lg:px-8">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-gray-900 to-gray-900" />

			<div className="relative max-w-7xl mx-auto space-y-4">
				{!session || api.length === 0 ? (
					<div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 p-8 text-center">
						<div className="max-w-md mx-auto">
							<div className="bg-emerald-500/10 p-4 rounded-full inline-block mb-4">
								<TrendingUp className="size-8 text-emerald-500" />
							</div>
							<h2 className="text-2xl font-bold text-emerald-400 mb-2">
								{session ? 'Start Trading' : 'Welcome to Simubit'}
							</h2>
							<p className="text-slate-400">
								{session
									? 'Begin trading by buying some crypto with virtual money from the market below.'
									: 'Connect your wallet to start trading crypto with virtual money.'}
							</p>
						</div>
					</div>
				) : (
					<div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 p-4 sm:p-6">
						<div className="flex justify-between items-start gap-4 mb-6">
							<h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
								Portfolio
							</h1>
							<div className="text-right">
								<p className="text-sm text-slate-400">Total Balance</p>
								<NumberFlow
									value={totalBalance}
									className="text-emerald-400 font-mono font-bold text-lg"
									format={{ style: 'currency', currency: 'USD' }}
								/>
							</div>
						</div>
						<div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
							<Table>
								<TableHeader>
									<TableRow className="border-emerald-500/20 hover:bg-transparent text-slate-400">
										<TableHead>Name</TableHead>
										<TableHead className="text-right">Units</TableHead>
										<TableHead className="text-right">Balance</TableHead>
										<TableHead className="text-right">Change</TableHead>
										<TableHead className="w-[100px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className="divide-y divide-emerald-500/10">
									{ordersPageData.map(transaction => {
										const cryptoData = data.find(
											crypto => crypto.symbol === transaction.symbol
										)
										if (!cryptoData) return null
										return (
											<TableRow key={transaction.id} className="border-emerald-500/10">
												<TableCell className="font-medium">
													<div className="flex items-center">
														<img
															src={`https://assets.coincap.io/assets/icons/${transaction.symbol.toLowerCase()}@2x.png`}
															alt={`${transaction.name} icon`}
															className="inline-block w-6 h-6 mr-2 rounded-full"
															onError={e => {
																e.currentTarget.style.display = 'none'
															}}
														/>
														<div className="flex flex-col">
															{transaction.name}
															<span className="text-slate-500">{transaction.symbol}</span>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-right">
													<TooltipProvider>
														<Tooltip delayDuration={50}>
															<TooltipTrigger className="cursor-help">
																<span className="font-mono">{transaction.units}</span>
															</TooltipTrigger>
															<TooltipContent className="bg-slate-950 border-emerald-500/20">
																Bought at{' '}
																<span className="font-mono">
																	{Number(transaction.purchase_price).toLocaleString('fi-FI', {
																		style: 'currency',
																		currency: 'USD',
																	})}
																</span>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</TableCell>
												<TableCell className="text-right">
													<NumberFlow
														value={transaction.units * cryptoData.quote.USD.price}
														className="font-mono"
														format={{ style: 'currency', currency: 'USD' }}
													/>
												</TableCell>
												<TableCell
													className={`text-right ${
														calcResult(
															transaction.purchase_price,
															cryptoData?.quote?.USD?.price || 0
														) > 0
															? 'text-emerald-400'
															: 'text-red-400'
													}`}
												>
													<NumberFlow
														value={
															Number(
																calcResult(
																	transaction.purchase_price,
																	cryptoData?.quote?.USD?.price || 0
																).toFixed(4)
															) / 100
														}
														className="font-mono"
														format={{
															style: 'percent',
															maximumFractionDigits: 2,
														}}
													/>
												</TableCell>
												<TableCell className="text-right">
													<SellButton
														id={transaction.id}
														symbol={transaction.symbol}
														price={transaction.purchase_price}
														name={transaction.name}
														units={transaction.units}
														session={session}
													/>
												</TableCell>
											</TableRow>
										)
									})}
								</TableBody>
							</Table>
						</div>
						{ordersTotalPages > 1 && (
							<PaginationWrapper
								currentPage={ordersCurrentPage}
								totalPages={ordersTotalPages}
								onPageChange={setOrdersCurrentPage}
							/>
						)}
					</div>
				)}

				<div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 p-4 sm:p-6">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
						<h2 className="text-2xl font-bold text-emerald-400">Market</h2>
						<div className="w-full sm:w-auto">
							<Input
								type="search"
								placeholder="Search by name or symbol..."
								className="bg-emerald-500/5 border-emerald-500/20 focus:border-emerald-500/40 w-full"
								value={searchQuery}
								onChange={e => {
									setSearchQuery(e.target.value)
									setCryptoCurrentPage(1)
								}}
							/>
						</div>
					</div>
					<div className="w-full overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="border-emerald-500/20 hover:bg-transparent text-slate-400">
									<TableHead className="w-[70px]">Rank</TableHead>
									<TableHead>Name</TableHead>
									<TableHead className="text-right">Price</TableHead>
									<TableHead className="text-right">24h %</TableHead>
									<TableHead className="w-[100px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="divide-y divide-emerald-500/10">
								{cryptoPageData.map((crypto, index) => (
									<TableRow key={crypto.id} className="border-emerald-500/10">
										<TableCell className="font-medium text-center">
											{(cryptoCurrentPage - 1) * 10 + index + 1}
										</TableCell>
										<TableCell className="font-medium">
											<div className="flex items-center">
												<img
													src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`}
													alt={`${crypto.name} icon`}
													className="inline-block w-6 h-6 mr-2 rounded-full"
													onError={e => {
														e.currentTarget.style.display = 'none'
													}}
												/>
												<div className="flex flex-col">
													{crypto?.name}
													<span className="text-slate-500">{crypto?.symbol}</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<NumberFlow
												value={crypto?.quote?.USD?.price || 0}
												className="font-mono"
												format={{ style: 'currency', currency: 'USD' }}
											/>
										</TableCell>
										<TableCell
											className={`text-right ${
												crypto?.quote?.USD?.percent_change_24h > 0
													? 'text-emerald-400'
													: 'text-red-400'
											}`}
										>
											<NumberFlow
												value={crypto?.quote?.USD?.percent_change_24h / 100 || 0}
												className="font-mono"
												format={{
													style: 'percent',
													maximumFractionDigits: 2,
												}}
											/>
										</TableCell>
										<TableCell className="text-right">
											<BuyButton
												symbol={crypto?.symbol}
												price={crypto?.quote?.USD?.price || 0}
												name={crypto?.name}
												id={crypto?.id}
												balance={initialBalance}
												session={session}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<PaginationWrapper
						currentPage={cryptoCurrentPage}
						totalPages={cryptoTotalPages}
						onPageChange={setCryptoCurrentPage}
					/>
				</div>
			</div>
		</div>
	)
}
