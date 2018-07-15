//動作種類常數
export const REQUEST_REGISTER = 'REQUEST_REGISTER' //註冊要求
export const RECEIVE_REGISTER = 'RECEIVE_REGISTER' //註冊接收


//動作產生器(ActionCreator)
export const requestRegister = () => {
    type: REQUEST_LOGIN
}

export const receiveRegister = () => {
    type: RECEIVE_LOGIN
}


