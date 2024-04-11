'use client'
import { UserIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { findUser } from '@/app/actions'
import { useAtom } from 'jotai'
import { isLoggedIn } from '@/utils/atoms'

export default function SignIn() {
	const [toggleModal, setToggleModal] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [login, setLogin] = useAtom(isLoggedIn)

	useEffect(() => {
		const sessionId = localStorage.getItem('sessionId')
		if (sessionId) {
			setLogin(true)
		}
	}, [])

	const showModal = () => {
		setToggleModal(true)
	}

	const cancel = () => {
		setToggleModal(false)
	}

	const confirm = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const userFound = await findUser(email, password)
		if (userFound) {
			const sessionId = 'session-' + Math.random().toString(36).substr(2, 9)
			localStorage.setItem('sessionId', sessionId)
			console.log('User signed in successfully')
			setLogin(true)
			setToggleModal(false)
			setEmail('')
			setPassword('')
		} else {
			console.log('Failed to sign in')
		}
	}
	return (
		<>
			{!login && (
				<div className="">
					<button
						onClick={showModal}
						className="flex justify-center items-center gap-0.5 rounded-md bg-blue-700 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-blue-600"
					>
						<UserIcon className="h-5 w-5" />
						<p className="pr-1">Sign In</p>
					</button>
				</div>
			)}
			{toggleModal && (
				<>
					<div className="z-50 fixed inset-0 bg-black opacity-90"></div>
					<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full inset-0">
						<div className="relative p-4 w-full max-w-md max-h-full">
							<div className="relative bg-white rounded-lg shadow dark:bg-gray-900">
								<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
									<h3 className="flex justify-center items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
										<UserIcon className="h-6 w-6" />
										Sign In
									</h3>
									<button
										type="button"
										onClick={cancel}
										className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
									>
										<XCircleIcon className="h-6 w-6" />
										<span className="sr-only">Close modal</span>
									</button>
								</div>
								<div className="p-5 pb-6">
									<form onSubmit={confirm} method="get">
										<div>
											<label
												htmlFor="email"
												className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
											>
												Email
											</label>
											<input
												type="text"
												id="email"
												name="email"
												placeholder="joe@joe.com"
												maxLength={40}
												value={email}
												onChange={e => setEmail(e.target.value)}
												required
												className={`outline-none block w-full rounded-md border-0 bg-white/10 p-2.5 text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ${
													email.length === 40 ? 'ring-red-500 focus:ring-red-700' : ''
												}`}
											/>
											<div className="text-white mt-2 text-xs">
												<span className={`${email.length === 40 ? 'text-red-500' : ''}`}>
													{email.length}/40
												</span>
											</div>
										</div>
										<div className="mt-5">
											<label
												htmlFor="password"
												className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
											>
												Password
											</label>
											<input
												id="password"
												name="password"
												type="password"
												placeholder="Password"
												maxLength={255}
												value={password}
												onChange={e => setPassword(e.target.value)}
												className={`outline-none block w-full rounded-md border-0 bg-white/10 p-2.5 text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ${
													password.length === 255 ? 'ring-red-500 focus:ring-red-700' : ''
												}`}
											/>
											<div className="text-white mt-2 text-xs">
												<span
													className={`${password.length === 255 ? 'text-red-500' : ''}`}
												>
													{password.length}/255
												</span>
											</div>
										</div>
										<button
											type="submit"
											className="mt-5 h-10 rounded-md bg-indigo-600 w-full px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
										>
											Log In
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	)
}
