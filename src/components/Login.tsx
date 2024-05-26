'use client'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

type Props = {
	callbackUrl?: string
	error?: string
}

export default function Login(props: Props) {
	return (
		<section className="w-full">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-dvh lg:py-0">
				<div className="w-full bg-slate-800 rounded-lg shadow dark:border md:mt-0 min-[500px]:max-w-md xl:p-0 ">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
							Sign in to Simubit
						</h1>
						<div className="flex flex-col sm:flex-row items-center gap-2">
							<Button
								onClick={() => signIn('github', { callbackUrl: props.callbackUrl })}
								className="w-full gap-x-2 hover:dark:bg-slate-900"
								variant="outline"
							>
								<Image
									width={32}
									height={32}
									src="/github.svg"
									alt="GitHub"
									className="size-5 bg-slate-200 p-[1px] rounded-full"
								/>
								<p className="max-[640px]:truncate text-black">Log in with GitHub</p>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
