'use client'
import BuyButton from '@/components/BuyButton'
import SellButton from '@/components/SellButton'
import User from '@/components/User'
import Loading from '@/components/Loading'
import { useSession } from 'next-auth/react'
import {
	ArrowLeftCircleIcon,
	ArrowRightCircleIcon,
} from '@heroicons/react/24/outline'
import { calcResult } from '@/utils/calcResult'
import { useEffect, useState } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface CryptoData {
	rank: number
	name: string
	symbol: string
	supply: number
	priceUsd: number
	changePercent24Hr: string
	id: string
}

export default function Crypto({ api }: { api: any[] }) {
	const [data, setData] = useState<CryptoData[] | null>(null)
	const [isLoading, setLoading] = useState(true)
	const [cryptoCurrentPage, setCryptoCurrentPage] = useState(1)
	const [ordersCurrentPage, setOrdersCurrentPage] = useState(1)
	const [isXlScreen, setIsXlScreen] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 1280px)')
		const handleResize = () => setIsXlScreen(mediaQuery.matches)
		mediaQuery.addEventListener('change', handleResize)
		handleResize()
		return () => mediaQuery.removeEventListener('change', handleResize)
	}, [])

	useEffect(() => {
		setCryptoCurrentPage(1)
		setOrdersCurrentPage(1)
	}, [isXlScreen])

	const ordersPerPage = isXlScreen ? 10 : 5
	const cryptoPerPage = isXlScreen ? 10 : 5

	const ordersTotalPages = api.length ? Math.ceil(api.length / ordersPerPage) : 0
	const ordersStartIndex = (ordersCurrentPage - 1) * ordersPerPage
	const ordersEndIndex = ordersStartIndex + ordersPerPage
	const ordersPageData = api.slice(ordersStartIndex, ordersEndIndex)
	ordersPageData.sort((a: any, b: any) => b.id - a.id)

	const cryptoTotalPages = data ? Math.ceil(data.length / cryptoPerPage) : 0
	const cryptoStartIndex = (cryptoCurrentPage - 1) * cryptoPerPage
	const cryptoEndIndex = cryptoStartIndex + cryptoPerPage
	const cryptoPageData = data ? data.slice(cryptoStartIndex, cryptoEndIndex) : []

	useEffect(() => {
		const fetchData = () => {
			fetch('https://api.coincap.io/v2/assets')
				.then(res => res.json())
				.then(response => {
					setData(response.data)
					setLoading(false)
				})
		}

		fetchData()
		const intervalId = setInterval(fetchData, 10000)
		return () => clearInterval(intervalId)
	}, [])

	const { data: session } = useSession()
	if (isLoading) return <Loading fullscreen={true} size={64} />
	if (!data)
		return (
			<p className="text-white text-xl flex items-center min-h-dvh">
				No profile data
			</p>
		)
	return (
		<div className="w-full flex flex-col items-center">
			<div className="flex items-center sm:flex-row flex-col gap-3 py-10">
				<User user={session?.user} />
			</div>
			<div className="flex flex-col xl:flex-row xl:gap-20">
				<div className="pb-12">
					{!session || api.length === 0 ? (
						<div>
							{session ? (
								<>
									<h1 className="text-2xl xl:text-3xl font-semibold">Transactions</h1>
									<p className="text-slate-500 text-sm pt-3.5">
										There are no transactions!
									</p>
								</>
							) : (
								<>
									<h1 className="text-2xl xl:text-3xl font-semibold">Transactions</h1>
									<p className="text-slate-500 text-sm pt-3.5">
										Please sign in to purchase crypto.
									</p>
								</>
							)}
						</div>
					) : (
						<div className="flex flex-col items-center sm:max-w-none max-w-80">
							<h1 className="text-2xl xl:text-3xl font-semibold self-start">
								Transactions
							</h1>
							<div className="w-full overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[0px] sm:w-[100px]">Units</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Price</TableHead>
											<TableHead>Change</TableHead>
											<TableHead></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className="divide-y divide-gray-200">
										{ordersPageData.map(transaction => (
											<TableRow key={transaction.id}>
												<TableCell>{transaction.units}</TableCell>
												<TableCell>
													{transaction.name}
													<span className="text-gray-500 pl-2">{transaction.symbol}</span>
												</TableCell>
												<TableCell>
													{Number(transaction.purchase_price).toLocaleString('fi-FI', {
														style: 'currency',
														currency: 'USD',
													})}
												</TableCell>
												<TableCell
													className={
														calcResult(
															transaction.purchase_price,
															data.filter(crypto => crypto.symbol === transaction.symbol)[0]
																.priceUsd
														) > 0
															? 'text-green-400'
															: 'text-red-400'
													}
												>
													{calcResult(
														transaction.purchase_price,
														data.filter(crypto => crypto.symbol === transaction.symbol)[0]
															.priceUsd
													).toFixed(2)}
													%
												</TableCell>
												<TableCell>
													<SellButton
														id={transaction.id}
														symbol={transaction.symbol}
														price={transaction.purchase_price}
														name={transaction.name}
													/>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<div className="flex gap-4 items-center pt-4">
								<Button
									className="bg-slate-600 hover:bg-slate-700"
									size="sm"
									onClick={() => setOrdersCurrentPage(ordersCurrentPage - 1)}
									disabled={ordersCurrentPage === 1}
								>
									<ArrowLeftCircleIcon className="h-5 w-5" />
									<p className="pr-1 pl-1">Previous</p>
								</Button>
								<span>
									{ordersCurrentPage} of {ordersTotalPages}
								</span>
								<Button
									className="bg-slate-600 hover:bg-slate-700"
									size="sm"
									onClick={() => setOrdersCurrentPage(ordersCurrentPage + 1)}
									disabled={ordersCurrentPage === ordersTotalPages}
								>
									<ArrowRightCircleIcon className="w-5 h-5" />
									<p className="pr-1 pl-1">Next</p>
								</Button>
							</div>
						</div>
					)}
				</div>
				<div className="flex flex-col items-center sm:max-w-none max-w-80">
					<h1 className="text-2xl xl:text-3xl font-semibold self-start">
						Currencies
					</h1>
					<div className="w-full overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[0px] sm:w-[100px]">#</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>24h %</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cryptoPageData.map((crypto, index) => (
									<TableRow key={crypto.id}>
										<TableCell>
											{(cryptoCurrentPage - 1) * cryptoPerPage + index + 1}
										</TableCell>
										<TableCell>
											{crypto.name}
											<span className="text-gray-500 pl-2">{crypto.symbol}</span>
										</TableCell>
										<TableCell>
											{Number(crypto.priceUsd).toLocaleString('fi-FI', {
												style: 'currency',
												currency: 'USD',
											})}
										</TableCell>
										<TableCell
											className={
												Number(crypto.changePercent24Hr) > 0
													? 'text-green-400'
													: 'text-red-400'
											}
										>
											{Number(crypto.changePercent24Hr).toFixed(2)}%
										</TableCell>
										<TableCell>
											<BuyButton
												user={session?.user}
												symbol={crypto.symbol}
												price={crypto.priceUsd}
												name={crypto.name}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<div className="flex gap-4 items-center pt-4 xl:pb-12 pb-16">
						<Button
							className="bg-slate-600 hover:bg-slate-700"
							size="sm"
							onClick={() => setCryptoCurrentPage(cryptoCurrentPage - 1)}
							disabled={cryptoCurrentPage === 1}
						>
							<ArrowLeftCircleIcon className="h-5 w-5" />
							<p className="pr-1 pl-1">Previous</p>
						</Button>
						<span>
							{cryptoCurrentPage} of {cryptoTotalPages}
						</span>
						<Button
							className="bg-slate-600 hover:bg-slate-700"
							size="sm"
							onClick={() => setCryptoCurrentPage(cryptoCurrentPage + 1)}
							disabled={cryptoCurrentPage === cryptoTotalPages}
						>
							<ArrowRightCircleIcon className="w-5 h-5" />
							<p className="pr-1 pl-1">Next</p>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
