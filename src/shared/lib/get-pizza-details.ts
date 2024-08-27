import { Ingredient, ProductItem } from '@prisma/client'
import { mapPizzaType, PizzaSize, PizzaType } from '../constants'
import { calcTotalPizzaPrice } from './calc-total-pizza-price'

export const getPizzaDetails = (
	type: PizzaType,
	size: PizzaSize,
	items: ProductItem[],
	ingredients: Ingredient[],
	selectedIngredients: Set<number>
) => {
	const textDetails = `${size} см, ${mapPizzaType[type]} пицца`
	const totalPrice = calcTotalPizzaPrice(
		type,
		size,
		items,
		ingredients,
		selectedIngredients
	)

	return { totalPrice, textDetails }
}
