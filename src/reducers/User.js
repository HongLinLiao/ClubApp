import {
	SIGN_IN_REQUEST,
	SIGN_IN_SUCCESS,
	SIGN_IN_FAILURE,
	SIGN_UP_REQUEST,
	SIGN_UP_SUCCESS,
	SIGN_UP_FAILURE
} from '../actions/LoginAction'


const initialState = {
	user: null
}

export const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case SIGN_IN_REQUEST:
			return {
				...state,
				loading:  true,
				rememberMe: action.rememberMe
			}
		case SIGN_IN_SUCCESS:
			return {
				...state,
				user: action.user
			}
		case SIGN_IN_FAILURE:
			return {
				...state,
				message: action.message
			}
		case SIGN_UP_REQUEST:
			return {
				...state,
				loading: true,
			}
		case SIGN_UP_SUCCESS:
			return {
				...state,
				user: action.newUser
			}
		case SIGN_UP_FAILURE:
			return {
				...state,
				message: action.message
			}
		default:
			return state
	}
}