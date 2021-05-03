import axios from 'axios';
import { ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_CREATE_FAIL } from '../constants/orderConstants';

export const createOrder = (order) => async (dispatch, getState) => {
	try {
		dispatch({
			type: ORDER_CREATE_REQUEST,
		});

		// Get token from state
		const {
			userLogin: { userInfo },
		} = getState();

		// Set token to header
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		const { data } = await axios.post('/api/orders', order, config);

		dispatch({
			type: ORDER_CREATE_SUCCESS,
			payload: data,
		});

		// localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (err) {
		dispatch({
			type: ORDER_CREATE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message,
		});
	}
};
