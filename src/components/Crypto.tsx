'use client'
import BuyButton from '@/components/BuyButton'
import SellButton from '@/components/SellButton'
import LogOut from '@/components/LogOut'
import User from '@/components/User'
import Loading from '@/components/Loading'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import {
	ArrowLeftCircleIcon,
	ArrowRightCircleIcon,
} from '@heroicons/react/24/outline'
import { calcResult } from '@/utils/calcResult'
import { useEffect, useState } from 'react'

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

	const [currentPage, setCurrentPage] = useState(1)
	const cryptoPerPage = 10

	const totalPages = data ? Math.ceil(data.length / cryptoPerPage) : 0
	const startIndex = (currentPage - 1) * cryptoPerPage
	const endIndex = startIndex + cryptoPerPage
	const pageData = data ? data.slice(startIndex, endIndex) : []

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

	const { data: session } = useSession({
		required: true,
		onUnauthenticated() {
			redirect('/api/auth/signin')
		},
	})

	if (isLoading) return <Loading />
	if (!data)
		return (
			<p className="text-white text-xl flex items-center min-h-dvh">
				No profile data
			</p>
		)
	return (
		<div className="w-full flex flex-col items-center">
			<div className="flex items-center gap-3 py-12">
				<LogOut />
				<User user={session?.user} />
			</div>

			<div className="px-4 sm:px-6 lg:px-8 text-white pb-12">
				<h1 className="text-3xl font-semibold leading-6">Transactions</h1>
				<div className="mt-2 flow-root">
					<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
							<table className="min-w-full divide-y divide-gray-300">
								<thead>
									<tr>
										<th
											scope="col"
											className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0"
										>
											Units
										</th>
										<th
											scope="col"
											className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold"
										>
											Name
										</th>
										<th
											scope="col"
											className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold"
										>
											Price
										</th>
										<th
											scope="col"
											className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold"
										>
											Change
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 ">
									{api.map(transaction => (
										<tr key={transaction.id}>
											<td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm sm:pl-0">
												{transaction.units}
											</td>
											<td className="whitespace-nowrap px-2 py-2 text-sm font-medium">
												{transaction.name}
												<span className="text-gray-500 pl-2">{transaction.symbol}</span>
											</td>
											<td className="whitespace-nowrap px-2 py-2 text-sm font-medium">
												{Number(transaction.purchase_price).toLocaleString('fi-FI', {
													style: 'currency',
													currency: 'USD',
												})}
											</td>
											<td
												className={
													calcResult(
														transaction.purchase_price,
														data.filter(crypto => crypto.symbol === transaction.symbol)[0]
															.priceUsd
													) > 0
														? 'text-green-400 whitespace-nowrap px-2 py-2 text-sm'
														: 'text-red-400 whitespace-nowrap px-2 py-2 text-sm'
												}
											>
												{calcResult(
													transaction.purchase_price,
													data.filter(crypto => crypto.symbol === transaction.symbol)[0]
														.priceUsd
												).toFixed(2)}
												%
											</td>
											<td className="whitespace-nowrap px-2 py-2 text-sm">
												<SellButton id={transaction.id} />
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div className="px-4 sm:px-6 lg:px-8 text-white">
				<h1 className="text-3xl font-semibold leading-6">List</h1>
				<div className="mt-2 flow-root">
					<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
							<table className="min-w-full divide-y divide-gray-300">
								<thead>
									<tr>
										<th
											scope="col"
											className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0"
										>
											#
										</th>
										<th
											scope="col"
											className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold"
										>
											Name
										</th>
										<th
											scope="col"
											className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold"
										>
											Price
										</th>
										<th
											scope="col"
											className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold"
										>
											24h %
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{pageData.map((crypto, index) => (
										<tr key={crypto.id}>
											<td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm sm:pl-0">
												{(currentPage - 1) * cryptoPerPage + index + 1}
											</td>
											<td className="whitespace-nowrap px-2 py-2 text-sm font-medium">
												{crypto.name}
												<span className="text-gray-500 pl-2">{crypto.symbol}</span>
											</td>
											<td className="whitespace-nowrap px-2 py-2 text-sm font-medium">
												{Number(crypto.priceUsd).toLocaleString('fi-FI', {
													style: 'currency',
													currency: 'USD',
												})}
											</td>
											<td
												className={
													Number(crypto.changePercent24Hr) > 0
														? 'text-green-400 whitespace-nowrap px-2 py-2 text-sm'
														: 'text-red-400 whitespace-nowrap px-2 py-2 text-sm'
												}
											>
												{Number(crypto.changePercent24Hr).toFixed(2)}%
											</td>
											<td className="whitespace-nowrap px-2 py-2 text-sm">
												<BuyButton
													user={session?.user}
													symbol={crypto.symbol}
													price={crypto.priceUsd}
													name={crypto.name}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-4 items-center pt-4 pb-16">
				<button
					onClick={() => setCurrentPage(currentPage - 1)}
					disabled={currentPage === 1}
					className={`flex justify-center items-center gap-0.5 rounded-md bg-gray-500 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-gray-600 ${
						currentPage === 1 ? 'cursor-not-allowed' : ''
					}`}
				>
					<ArrowLeftCircleIcon className="h-5 w-5" />
					<p className="pr-1">Previous</p>
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`flex justify-center items-center gap-0.5 rounded-md bg-gray-500 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-gray-600 ${
						currentPage === totalPages ? 'cursor-not-allowed' : ''
					}`}
				>
					<ArrowRightCircleIcon className="h-5 w-5" />
					<p className="pr-1">Next</p>
				</button>
			</div>
		</div>
	)
}
