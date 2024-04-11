'use client'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'

export default function LogOut() {
	const [toggleModal, setToggleModal] = useState(false)
	const [login, setLogin] = useState(true)

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
		localStorage.removeItem('sessionId')
		setLogin(false)
		setToggleModal(false)
	}
	return (
		<>
			{login && (
				<>
					<div className="">
						<button
							onClick={() => signOut()}
							className="rounded-md outline outline-1 outline-slate-500 px-2 py-1 text-sm font-semibold shadow-sm hover:outline-slate-400 hover:outline-2"
						>
							Log Out
						</button>
					</div>
				</>
			)}
			{toggleModal && (
				<>
					<div className="z-50 fixed inset-0 bg-black opacity-90"></div>
					<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full inset-0">
						<div className="relative p-4 w-full max-w-md max-h-full">
							<div className="relative bg-white rounded-lg shadow dark:bg-gray-900">
								<div className="p-4 md:p-5 text-center">
									<h3 className="mb-3 text-lg font-normal text-white">
										Sign out from Crypto App?
									</h3>
									<div className="flex justify-center items-center">
										<form onSubmit={confirm}>
											<button
												type="submit"
												className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold shadow-sm hover:bg-blue-500 me-2"
											>
												Yes, Sign out
											</button>
										</form>
										<button
											onClick={cancel}
											type="button"
											className="rounded-md px-3.5 py-2 text-sm font-semibold shadow-sm border border-gray-600 hover:border-gray-500"
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	)
}
