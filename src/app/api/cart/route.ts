import { updateCartTotalAmount } from '@/src/shared/lib'
import { findOrCreateCart } from '@/src/shared/lib/find-or-create-cart'
import { CreateCartItemValues } from '@/src/shared/services/dto/cart.dto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../prisma/prisma-client'

export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get('cartToken')?.value

		if (!token) {
			return NextResponse.json({ totalAmount: 0, items: [] })
		}

		const userCart = await prisma.cart.findFirst({
			where: {
				OR: [
					{
						token,
					},
				],
			},
			include: {
				items: {
					orderBy: {
						createdAt: 'desc',
					},
					include: {
						productItem: {
							include: {
								product: true,
							},
						},
						ingredients: true,
					},
				},
			},
		})

		return NextResponse.json(userCart)
	} catch (error) {
		console.log('[CART_GET] Server error', error)
		return NextResponse.json(
			{ message: 'Не удалось получить корзину' },
			{ status: 500 }
		)
	}
}

export async function POST(req: NextRequest) {
	try {
		let token = req.cookies.get('cartToken')?.value

		if (!token) {
			token = crypto.randomUUID()
		}

		const userCart = await findOrCreateCart(token)

		const data = (await req.json()) as CreateCartItemValues

		const findCartItem = await prisma.cartItem.findFirst({
			where: {
				cartId: userCart.id,
				productItemId: data.productItemId,
			},
			include: {
				ingredients: true,
			},
		})

		// Проверка, чтобы количество и ID ингредиентов совпадали
		const isMatching =
			findCartItem &&
			findCartItem.ingredients.length === data.ingredients!.length &&
			findCartItem.ingredients.every(ingredient =>
				data.ingredients!.includes(ingredient.id)
			)

		if (isMatching) {
			// Если ингредиенты совпадают, обновляем количество
			await prisma.cartItem.update({
				where: {
					id: findCartItem.id,
				},
				data: {
					quantity: findCartItem.quantity + 1,
				},
			})
		} else {
			// Иначе создаем новый элемент корзины с этими ингредиентами
			await prisma.cartItem.create({
				data: {
					cartId: userCart.id,
					productItemId: data.productItemId,
					quantity: 1,
					ingredients: { connect: data.ingredients?.map(id => ({ id })) },
				},
			})
		}

		const updatedUserCart = await updateCartTotalAmount(token)

		const resp = NextResponse.json(updatedUserCart)
		resp.cookies.set('cartToken', token)
		return resp
	} catch (error) {
		console.log('[CART_POST] Server error', error)
		return NextResponse.json(
			{ message: 'Не удалось создать корзину' },
			{ status: 500 }
		)
	}
}
