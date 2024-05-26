import Login from '@/components/Login'

type Props = {
	searchParams?: Record<'callbackUrl' | 'error', string>
}

export default function SignIn(props: Props) {
	return (
		<div className="flex min-h-dvh flex-col items-center">
			<Login
				callbackUrl={props.searchParams?.callbackUrl}
				error={props.searchParams?.error}
			/>
		</div>
	)
}
