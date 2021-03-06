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
export const SET_VERIFY_EMAIL_AGAIN = 'SET_VERIFY_EMAIL_AGAIN' //設定是否要詢問驗證信

export const SEND_RESET_MAIL_SUCCESS = 'SEND_RESET_MAIL_SUCCESS' //寄送重設信件成功
export const SEND_RESET_MAIL_FAILURE = 'SEND_RESET_MAIL_FAILURE' //寄送重設信件失敗

export const SET_USER_PASSWORD = 'SET_USER_PASSWORD' //設定使用者密碼

export const SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE' //登出失敗


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

export const signInSuccess = (userData) => ({
  type: SIGN_IN_SUCCESS,
  ...userData
})

export const signInFail = (message) => ({
  type: SIGN_IN_FAILURE,
  message
})

//註冊
export const signUpRequest = () => ({
  type: SIGN_UP_REQUEST,
})

export const signUpSuccess = (userData) => ({
  type: SIGN_UP_SUCCESS,
  ...userData
})

export const signUpFail = (message) => ({
  type: SIGN_UP_FAILURE,
  message
})

//facebook登入
export const signWithFacebookRequest = () => ({
  type: SIGN_WITH_FACEBOOK_REQUEST
})

export const signWithFacebookSuccess = (userData) => ({
  type: SIGN_WITH_FACEBOOK_SUCCESS,
  ...userData
})

export const signWithFacebookFail = (message) => ({
  type: SIGN_WITH_FACEBOOK_FAILURE,
  message
})

//google登入
export const signWithGoogleRequest = () => ({
  type: SIGN_WITH_GOOGLE_REQUEST
})

export const signWithGoogleSuccess = (userData) => ({
  type: SIGN_WITH_GOOGLE_SUCCESS,
  ...userData
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

export const setUserPassword = (newPassword) => ({
  type: SET_USER_PASSWORD,
  newPassword
})

//登出
export const signOutFail = (message) => ({
  type: SIGN_OUT_FAILURE,
  message
})


