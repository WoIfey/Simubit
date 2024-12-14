import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Simubit',
	description: 'Simulate buying and selling crypto with a dummy wallet',
	openGraph: {
		title: 'Simubit',
		description: 'Simulate buying and selling crypto with a dummy wallet',
		url: 'https://simubit.vercel.app/',
		images: [
			{
				url: 'https://wolfey.s-ul.eu/uwmaPXim',
				width: 1280,
				height: 720,
				alt: 'Thumbnail',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	const balance = session?.user?.balance || 0

	return (
		<html lang="en" className="dark">
			<body className={inter.className}>
				<Navbar balance={balance} session={session} />
				{children}
			</body>
		</html>
	)
}
