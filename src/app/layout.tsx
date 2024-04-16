import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from './context/AuthProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Simubit',
	description: 'Made with next.js',
	openGraph: {
		title: 'Simubit',
		description: 'Buy and sell fake currency!',
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
						<SpeedInsights />
						<Analytics />
					</main>
				</AuthProvider>
			</body>
		</html>
	)
}
