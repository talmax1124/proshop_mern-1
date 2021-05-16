import axios from 'axios';
import { ORDER_USER_LIST_RESET } from '../constants/orderConstants';
import {
	USER_DETAILS_FAIL,
	USER_DETAILS_REQUEST,
	USER_DETAILS_RESET,
	USER_DETAILS_SUCCESS,
	USER_LIST_FAIL,
	USER_LIST_REQUEST,
	USER_LIST_RESET,
	USER_LIST_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_LOGOUT_RESET,
	USER_REGISTER_FAIL,
	USER_REGISTER_REQUEST,
	USER_REGISTER_SUCCESS,
	USER_UPDATE_PROFILE_FAIL,
	USER_UPDATE_PROFILE_REQUEST,
	USER_UPDATE_PROFILE_SUCCESS,
} from '../constants/userConstants';

export const login = (email, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_LOGIN_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post('/api/users/login', { email, password }, config);

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (err) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message,
		});
	}
};

export const logout = () => (dispatch) => {
	localStorage.clear();
	dispatch({ type: USER_LOGOUT });
	dispatch({ type: USER_DETAILS_RESET });
	dispatch({ type: ORDER_USER_LIST_RESET });
	dispatch({ type: USER_LIST_RESET });
};

export const userLogoutReset = () => (dispatch) => {
	dispatch({ type: USER_LOGOUT_RESET });
};

export const register = (name, email, password) => async (dispatch) => {
	try {
		dispatch({
			type: USER_REGISTER_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post('/api/users', { name, email, password }, config);

		dispatch({
			type: USER_REGISTER_SUCCESS,
			payload: data,
		});

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (err) {
		dispatch({
			type: USER_REGISTER_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message,
		});
	}
};

export const getUserDetails = (idOrProfile) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_DETAILS_REQUEST,
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

		// Hits users/id or users/profile endpoints
		const { data } = await axios.get(`/api/users/${idOrProfile}`, config);

		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (err) {
		dispatch({
			type: USER_DETAILS_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message,
		});
	}
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_UPDATE_PROFILE_REQUEST,
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

		const { data } = await axios.put('/api/users/profile', user, config);
		// Sets success and outputs errors for updateProfile messages
		dispatch({
			type: USER_UPDATE_PROFILE_SUCCESS,
			payload: data,
		});
		// Only necessary to keep user details consistent
		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});
		// Used to fill form fields and set loading, could easily be refactored into single state
		dispatch({
			type: USER_DETAILS_SUCCESS,
			payload: data,
		});

		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (err) {
		dispatch({
			type: USER_UPDATE_PROFILE_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message,
		});
	}
};

export const listUsers = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_LIST_REQUEST,
		});

		// Get token from state
		const {
			userLogin: { userInfo },
		} = getState();

		// Set token to header
		const config = {
			headers: {
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		// Hits users/id or users/profile endpoints
		const { data } = await axios.get('/api/users', config);

		dispatch({
			type: USER_LIST_SUCCESS,
			payload: data,
		});
	} catch (err) {
		dispatch({
			type: USER_LIST_FAIL,
			payload: err.response && err.response.data.message ? err.response.data.message : err.message,
		});
	}
};
