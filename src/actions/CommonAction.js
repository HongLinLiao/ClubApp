/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const SET_LOADING_STATE = 'SET_LOADING_STATE' //是否正在載入
export const SET_CLUB_LISTEN = 'SET_CLUB_LISTEN' //設定社團監聽




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

export const setClubListen = (IsListen) => ({
  type: SET_CLUB_LISTEN,
  IsListen
})
