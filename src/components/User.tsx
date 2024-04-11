import Image from 'next/image'

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
			<div>
				{user?.image && (
					<div>
						<Image
							className="inline-block h-9 w-9 rounded-full"
							src={user.image}
							width={200}
							height={200}
							alt={user.name ?? 'Profile Pic'}
							priority={true}
						/>
					</div>
				)}
			</div>
			<div className="ml-3">
				<p className="text-sm font-medium">{user?.name}</p>
				<p className="text-xs font-medium text-gray-400">{user?.email}</p>
			</div>
		</div>
	)
}
