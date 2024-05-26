import Crypto from '@/components/Crypto'
import { getTransactions } from '@/server/db'
import { options } from './api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'

export default async function Home() {
	const session = await getServerSession(options)
	let data = []
	if (session?.user.id) {
		data = await getTransactions(session.user.id)
	}
	return <Crypto api={data} />
}
