/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const SET_LOADING_STATE = 'SET_LOADING_STATE' //是否正在載入




/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/

//載入
export const setLoadingState = (IsLoading) => ({
  type: SET_LOADING_STATE,
  IsLoading
})