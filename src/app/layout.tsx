import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from './context/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Crypto',
	description: 'Made with next.js',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<main className="bg-gray-950 min-h-dvh flex justify-center text-white">
						{children}
					</main>
				</AuthProvider>
			</body>
		</html>
	)
}
