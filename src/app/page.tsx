import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import getTransactions from '@/actions/transactions/fetch'
import Crypto from '@/components/Crypto'

export default async function Home() {
	const session = (await auth.api.getSession({
		headers: await headers(),
	})) as { user: { id: string; balance: number } }

	const data = await getTransactions(session.user.id)

	const transactions = data.map(transaction => ({
		...transaction,
		id: Number(transaction.id),
		user: session.user,
	}))

	return (
		<Crypto
			api={transactions}
			initialBalance={session?.user.balance || 0}
			session={session}
		/>
	)
}
