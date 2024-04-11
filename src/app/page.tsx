import Crypto from '@/components/Crypto'
import { getTransactions } from '@/utils/handleDatabase'
import { options } from './api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'

export default async function Home() {
	const session = await getServerSession(options)
	if (!session) {
		return null
	}
	let data = await getTransactions(session?.user.id)

	return (
		<>{session ? <Crypto api={data} /> : <h1 className="text-white">Test</h1>}</>
	)
}
