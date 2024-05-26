import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signIn, signOut } from 'next-auth/react'

type User =
	| {
			name?: string | null | undefined
			email?: string | null | undefined
			image?: string | null | undefined
	  }
	| undefined

type Props = {
	user: User
}

export default function User({ user }: Props) {
	return (
		<div className="flex items-center">
			{!user ? (
				<button
					onClick={() => signIn()}
					className="rounded-md outline outline-1 outline-slate-500 px-2 py-1 text-sm font-semibold shadow-sm hover:outline-slate-400 hover:outline-2"
				>
					Sign In
				</button>
			) : (
				<>
					<div className="flex items-center gap-3">
						<button
							onClick={() => signOut()}
							className="rounded-md outline outline-1 outline-slate-500 px-2 py-1 text-sm font-semibold shadow-sm hover:outline-slate-400 hover:outline-2"
						>
							Sign Out
						</button>
						{user?.image && (
							<div>
								<Avatar>
									<AvatarImage src={user?.image} />
									<AvatarFallback>{user?.name}</AvatarFallback>
								</Avatar>
							</div>
						)}
					</div>
					<div className="ml-3">
						<p className="text-sm font-medium">{user?.name}</p>
						<p className="text-xs font-medium text-gray-400">{user?.email}</p>
					</div>
				</>
			)}
		</div>
	)
}
