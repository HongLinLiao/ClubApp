/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST' //登入要求
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS' //登入成功
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE' //登入失敗
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST' //註冊要求
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS' //註冊成功
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE' //註冊成功


/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/

//登入
export const signInRequest = (rememberMe) => ({
  type: SIGN_IN_REQUEST,
  rememberMe
})

export const signInSuccess = (user) => ({
  type: SIGN_IN_SUCCESS,
  user
})

export const signInFail = (message) => ({
  type: SIGN_IN_FAILURE,
  message
})

//註冊
export const signUpRequest = () => ({
  type: SIGN_UP_REQUEST,
})

export const signUpSuccess = (newUser) => ({
  type: SIGN_UP_SUCCESS,
  newUser
})

export const signUpFail = (message) => ({
  type: SIGN_UP_FAILURE,
  message
})