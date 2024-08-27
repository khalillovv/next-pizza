import React from 'react'

import { Trash2Icon } from 'lucide-react'
import { cn } from '../../lib/utils'
import * as CartItem from './cart-item-details'
import { CountButton } from './count-button'

interface Props extends CartItem.CartItemProps {
	onClickCountButton?: (type: 'plus' | 'minus') => void
	onClickRemove?: () => void
	className?: string
}

export const CartDrawerItem: React.FC<Props> = ({
	imageUrl,
	name,
	price,
	details,
	quantity,
	disabled,
	onClickRemove,
	onClickCountButton,
	className,
}) => {
	return (
		<div
			className={cn(
				'flex bg-white p-5 gap-6',
				{ 'opacity-50 pointer-events-none': disabled },
				className
			)}
		>
			<CartItem.Image src={imageUrl} />

			<div className='flex-1'>
				<CartItem.Info name={name} details={details} />
				<hr className='my-3' />
				<div className='flex items-center justify-between'>
					<CountButton onClick={onClickCountButton} value={quantity} />
					<div className='flex items-center gap-3'>
						<CartItem.Price value={price} />
						<Trash2Icon
							onClick={onClickRemove}
							className='text-gray-400 cursor-pointer hover:text-gray-600'
							size={16}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
