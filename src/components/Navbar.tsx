'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { authClient } from '@/lib/auth-client'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Wallet } from 'lucide-react'
import resetProgress from '@/actions/user/reset'
import NumberFlow from '@number-flow/react'
import Link from 'next/link'
import { Session } from '@/lib/auth-client'

export default function Navbar({
	balance,
	session,
}: {
	balance: number
	session: Session | null
}) {
	const [resetDialogOpen, setResetDialogOpen] = useState(false)
	const [confirmText, setConfirmText] = useState('')
	const [isResetting, setIsResetting] = useState(false)
	const router = useRouter()

	const signIn = async () => {
		await authClient.signIn.social({
			provider: 'github',
		})
	}

	const handleReset = async () => {
		if (confirmText !== 'Reset my progress') return

		setIsResetting(true)
		try {
			await resetProgress()
			setResetDialogOpen(false)
			setConfirmText('')
			router.refresh()
		} catch (error) {
			console.error('Error resetting progress:', error)
		} finally {
			setIsResetting(false)
		}
	}

	return (
		<nav className="fixed w-full z-50 backdrop-blur-md bg-emerald-500/30">
			<div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
			<div className="relative">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 sm:h-20">
						<div className="flex-shrink-0">
							<Link
								href="https://github.com/WoIfey/Simubit"
								target="_blank"
								className="text-2xl sm:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"
							>
								SIMUBIT
							</Link>
						</div>

						<div className="flex items-center gap-2 sm:gap-6">
							{!session?.user ? (
								<Button
									onClick={signIn}
									variant="outline"
									className="relative group border-emerald-500/20 hover:border-emerald-500/40 bg-black/50 hover:bg-black/70 text-sm sm:text-base"
								>
									<span className="relative text-emerald-500 group-hover:text-emerald-400">
										Connect Wallet
									</span>
								</Button>
							) : (
								<div className="flex items-center gap-2 sm:gap-6">
									<div className="relative overflow-hidden rounded-lg bg-black/50 border border-emerald-500/20">
										<div className="px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
											<Wallet className="text-emerald-500 h-4 w-4 sm:h-5 sm:w-5" />
											<div>
												<p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-medium">
													Balance
												</p>
												<NumberFlow
													value={balance}
													className="text-emerald-400 font-mono font-bold text-base sm:text-lg"
													format={{ style: 'currency', currency: 'USD' }}
												/>
											</div>
										</div>
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="relative p-0 h-10 w-10 sm:h-12 sm:w-12 hover:bg-emerald-500/10 transition-all duration-200"
											>
												<Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-emerald-500/20 hover:ring-emerald-500/40 transition-all">
													<AvatarImage src={session?.user?.image ?? ''} />
													<AvatarFallback className="bg-black/50">
														{session?.user?.name?.[0]}
													</AvatarFallback>
												</Avatar>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											sideOffset={8}
											className="w-64 bg-black/95 backdrop-blur-xl border border-emerald-500/20 animate-in fade-in-0 zoom-in-95 duration-200"
										>
											<div className="px-4 py-3 border-b border-emerald-500/10 space-y-1">
												<p className="text-xs text-slate-400 truncate">
													{session?.user?.email}
												</p>
											</div>
											<DropdownMenuItem
												onClick={() => setResetDialogOpen(true)}
												className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 focus:bg-yellow-500/10 transition-colors duration-200 cursor-pointer px-4 py-2.5"
											>
												Reset Progress
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => authClient.signOut()}
												className="text-red-500 hover:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 transition-colors duration-200 cursor-pointer px-4 py-2.5"
											>
												Disconnect
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
				<DialogContent className="bg-black/95 backdrop-blur-xl border border-yellow-500/20">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-slate-200">
							Reset Progress
						</DialogTitle>
						<DialogDescription className="text-slate-400">
							This will delete all your transactions and reset your balance to $10,000.
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<p className="text-sm text-slate-400 mb-2">
							Type &quot;Reset my progress&quot; to confirm:
						</p>
						<Input
							value={confirmText}
							onChange={e => setConfirmText(e.target.value)}
							className="bg-black/50 border-yellow-500/20 focus:border-yellow-500/40 text-slate-100"
							placeholder="Reset my progress"
						/>
					</div>
					<DialogFooter className="gap-2">
						<Button
							variant="ghost"
							onClick={() => setResetDialogOpen(false)}
							className="hover:bg-white/5 text-slate-400 hover:text-slate-200"
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 hover:text-yellow-400"
							disabled={confirmText !== 'Reset my progress' || isResetting}
							onClick={handleReset}
						>
							{isResetting ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									Resetting...
								</>
							) : (
								'Reset Progress'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</nav>
	)
}
