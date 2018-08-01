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

export const SIGN_WITH_GOOGLE_REQUEST = 'SIGN_WITH_GOOGLE_REQUEST' //google登入要求
export const SIGN_WITH_GOOGLE_SUCCESS = 'SIGN_WITH_GOOGLE_SUCCESS' //google登入成功
export const SIGN_WITH_GOOGLE_FAILURE = 'SIGN_WITH_GOOGLE_FAILURE' //google登入失敗

export const SIGN_WITH_FACEBOOK_REQUEST = 'SIGN_WITH_FACEBOOK_REQUEST' //facebook登入要求
export const SIGN_WITH_FACEBOOK_SUCCESS = 'SIGN_WITH_FACEBOOK_SUCCESS' //facebook登入成功
export const SIGN_WITH_FACEBOOK_FAILURE = 'SIGN_WITH_FACEBOOK_FAILURE' //facebook登入失敗

export const SEND_VERIFY_EMAIL_SUCCESS = 'SEND_VERIFY_EMAIL_SUCCESS' //寄送驗證信件成功
export const SEND_VERIFY_EMAIL_FAILURE = 'SEND_VERIFY_EMAIL_FAILURE' //寄送驗證信件失敗
export const SET_EMAIL_VERIFIED_STATUS = 'SET_EMAIL_VERIFIED_STATUS' //設定信箱驗證狀態
export const SET_VERIFY_EMAIL_AGAIN = 'SET_VERIFY_EMAIL_AGAIN' //設定是否要詢問驗證信

export const SEND_RESET_MAIL_SUCCESS = 'SEND_RESET_MAIL_SUCCESS' //寄送重設信件成功
export const SEND_RESET_MAIL_FAILURE = 'SEND_RESET_MAIL_FAILURE' //寄送重設信件失敗

export const SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE' //登出失敗

export const CLEAR_USER_STATE = 'CLEAR_USER_STATE' //清空使用者狀態
export const UPDATE_USER_STATE = 'UPDATE_USER_STATE' //更新使用者狀態
export const UPDATE_USER_FALIURE = 'UPDATE_USER_FALIURE' //更新使用者失敗


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

export const signUpSuccess = (user) => ({
  type: SIGN_UP_SUCCESS,
  user
})

export const signUpFail = (message) => ({
  type: SIGN_UP_FAILURE,
  message
})

//facebook登入
export const signWithFacebookRequest = () => ({
  type: SIGN_WITH_FACEBOOK_REQUEST
})

export const signWithFacebookSuccess = (user) => ({
  type: SIGN_WITH_FACEBOOK_SUCCESS,
  user
})

export const signWithFacebookFail = (message) => ({
  type: SIGN_WITH_FACEBOOK_FAILURE,
  message
})

//google登入
export const signWithGoogleRequest = () => ({
  type: SIGN_WITH_GOOGLE_REQUEST
})

export const signWithGoogleSuccess = (user) => ({
  type: SIGN_WITH_GOOGLE_SUCCESS,
  user
})

export const signWithGoogleFail = (message) => ({
  type: SIGN_WITH_GOOGLE_FAILURE,
  message
})


//驗證信
export const sendVerifiedEmailSuccess = () => ({
  type: SEND_VERIFY_EMAIL_SUCCESS
})

export const sendVerifiedEmailFail = (message) => ({
  type: SEND_VERIFY_EMAIL_FAILURE,
  message
})

export const setEmailVerifiedStatus = (isVerified) => ({
  type: SET_EMAIL_VERIFIED_STATUS,
  isVerified
})

export const setVerifyEmailAgain = (askAgain) => ({
  type: SET_VERIFY_EMAIL_AGAIN,
  askAgain
})

//重設密碼
export const sendResetEmailSuccess = () => ({
  type: SEND_RESET_MAIL_SUCCESS
})

export const sendResetEmailFail = (message) => ({
  type: SEND_RESET_MAIL_FAILURE,
  message
})

//登出
export const signOutFail = (message) => ({
  type: SIGN_OUT_FAILURE,
  message
})

//使用者狀態
export const updateUser = (user) => ({
  type: UPDATE_USER_STATE,
  user
})

export const updateUserFail = (message) => ({
  type: UPDATE_USER_FALIURE,
  message
})

export const clearUser = () => ({
  type: CLEAR_USER_STATE,
})


