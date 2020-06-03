import axios from 'axios';
import setAuthToken from '../utilis/setAuthToken';
import { setAlert } from './alert';
import {
	REGISTER_SUCCESS,
	REGISTER_FAILED,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAILED,
	LOGOUT,
	CLEAR_PROFILE
} from './types';

// load user
export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}
	try {
		const res = await axios.get('api/auth/');
		dispatch({
			type: USER_LOADED,
			payload: res.data
		});
	} catch (err) {
		dispatch({
			type: AUTH_ERROR
		});
	}
};
//user register
export const register = ({ name, email, password }) => async (dispatch) => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};
	const body = JSON.stringify({ name, email, password });

	try {
		const res = await axios.post('/api/users', body, config);

		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data
		});
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: REGISTER_FAILED
		});
	}
};

//login user
export const login = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};
	const body = JSON.stringify({ email, password });

	try {
		const res = await axios.post('/api/auth', body, config);

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: LOGIN_FAILED
		});
	}
};

//Logout / Cler Profile
export const logout = () => (dispatch) => {
	dispatch({
		type: CLEAR_PROFILE
	});
	dispatch({
		type: LOGOUT
	});
};
