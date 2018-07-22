import { REQUEST_LOGIN, RECEIVE_LOGIN } from '../actions/LoginAction'


export const userReducer = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_LOGIN:
        case RECEIVE_LOGIN:
        default:
            return state
    }
}