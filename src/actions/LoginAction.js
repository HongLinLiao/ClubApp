//動作種類常數
export const REQUEST_LOGIN = 'REQUEST_LOGIN' //登入要求
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN' //登入接收


//動作產生器(ActionCreator)
export const requestLogin = (user) => {
    type: REQUEST_LOGIN
}

export const receiveLogin = (user) => {
    type: RECEIVE_LOGIN
}

export const Login = (user) => dispatch => {
    dispatch(requestLogin(user))
    return dispatch(receiveLogin(user))
}