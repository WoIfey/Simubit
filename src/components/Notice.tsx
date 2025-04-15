import { TriangleAlert } from 'lucide-react'

export default function Notice({ message }: { message: string }) {
	return (
		<div className="px-4 py-3 text-center sticky bottom-0 bg-amber-100/80 dark:bg-amber-900/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 backdrop-blur-sm">
			<p className="text-sm">
				<TriangleAlert
					className="me-3 -mt-0.5 inline-flex text-amber-500"
					size={16}
					aria-hidden="true"
				/>
				{message}
			</p>
		</div>
	)
}
