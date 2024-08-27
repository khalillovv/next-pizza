import { Category } from '@prisma/client'
import React from 'react'
import { cn } from '../../lib/utils'
import { Categories } from './categories'
import { Container } from './container'

interface Props {
	categories: Category[]
	className?: string
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
	return (
		<div className={cn('sticky top-0 bg-white py-5 z-10', className)}>
			<Container className='flex items-center justify-between '>
				<Categories items={categories} />
				{/* <div className='flex items-center'>
					<SortPopup />
				</div> */}
			</Container>
		</div>
	)
}
