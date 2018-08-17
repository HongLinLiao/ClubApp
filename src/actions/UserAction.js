/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const UPDATE_USER_STATE_SUCCESS = 'UPDATE_USER_STATE_SUCCESS' //更新使用者所有狀態
export const UPDATE_USER_STATE_FAILURE = 'UPDATE_USER_STATE_FAILURE' //更新使用者所有狀態失敗
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS' //更新用戶狀態
export const UPDATE_USER_FALIURE = 'UPDATE_USER_FALIURE' //更新用戶狀態
export const SET_USER_FIRSTLOGIN = 'SET_USER_FIRSTLOGIN' //設定是否第一次登入
export const CLEAR_USER_STATE = 'CLEAR_USER_STATE' //清空使用者狀態

/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/

//使用者狀態
export const updateUserAllState = (userData) => ({
  type: UPDATE_USER_STATE_SUCCESS,
  userData
})

export const updateUserAllStateFail = (message) => ({
  type: UPDATE_USER_STATE_FAILURE,
  message
})

export const updateUser = (user) => ({
  type: UPDATE_USER_SUCCESS,
  user,
})

export const updateUserFail = (message) => ({
  type: UPDATE_USER_FALIURE,
  message
})

export const setUserFirstLgoin = (IsFirstLogin) => ({
  type: SET_USER_FIRSTLOGIN,
  IsFirstLogin
})

export const clearUser = () => ({
  type: CLEAR_USER_STATE,
})
