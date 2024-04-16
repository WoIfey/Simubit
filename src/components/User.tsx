import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
					<Avatar>
						<AvatarImage src={user?.image} />
						<AvatarFallback>{user?.name}</AvatarFallback>
					</Avatar>
				)}
			</div>
			<div className="ml-3">
				<p className="text-sm font-medium">{user?.name}</p>
				<p className="text-xs font-medium text-gray-400">{user?.email}</p>
			</div>
		</div>
	)
}
