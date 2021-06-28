import {
	BASKET_ADD_ITEM,
	BASKET_REMOVE_ITEM,
	BASKET_SAVE_PAYMENT_METHOD,
	BASKET_SAVE_SHIPPING_ADDRESS,
	BASKET_RESET,
} from '../constants/basketConstants';

const initialState = {
  basketItems: [],
	shippingAddress: {},
	paymentMethod: null,
}

export const basketReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case BASKET_ADD_ITEM:
			const addedItem = payload;

			const foundItem = state.basketItems.find((basketItem) => basketItem.productId === addedItem.productId);

			if (foundItem) {
				return {
					...state,
					basketItems: state.basketItems.map((basketItem) =>
						basketItem.productId === foundItem.productId ? addedItem : basketItem
					),
				};
			} else {
				return {
					...state,
					basketItems: [...state.basketItems, addedItem],
				};
			}
		case BASKET_REMOVE_ITEM:
			return {
				...state,
				basketItems: state.basketItems.filter((item) => item.productId !== payload),
			};
		// Refactor to have its own mongo model and maybe its own state
		case BASKET_SAVE_SHIPPING_ADDRESS:
			return {
				...state,
				shippingAddress: payload,
			};
		case BASKET_SAVE_PAYMENT_METHOD:
			return {
				...state,
				paymentMethod: payload,
			};
		case BASKET_RESET:
			return {
				initialState
			};
		default:
			return state;
	}
};
