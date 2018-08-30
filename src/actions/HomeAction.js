/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

export const SET_CLUB_LIST_SUCCESS = 'SET_CLUB_LIST_SUCCESS' //取得user club成功
export const SET_CLUB_LIST_FAILURE = 'SET_CLUB_LIST_FAILURE' //取得user club失敗
export const GET_POST_LIST_SUCCESS = 'GET_POST_LIST_SUCCESS' //取得貼文列表成功
export const GET_POST_LIST_FAILURE = 'GET_POST_LIST_FAILURE' //取得貼文列表失敗
export const PRESS_POST_SUCCESS = 'PRESS_POST_SUCCESS' //選取貼文成功
export const PRESS_POST_FAILURE = 'PRESS_POST_FAILURE' //選取貼文失敗
export const SET_CLUB_STATUS_SUCCESS = 'SET_CLUB_STATUS_SUCCESS' //篩選頁面按鈕觸發成功
export const SET_CLUB_STATUS_FAILURE = 'SET_CLUB_STATUS_FAILURE' //篩選頁面按鈕觸發失敗


/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/

//取得user club
export const setClubListSuccess =(clubList,numSelectingStatusTrue) =>({
    type: SET_CLUB_LIST_SUCCESS,
    clubList,
    numSelectingStatusTrue
})

export const setClubListFailure =(message) =>({
    type: SET_CLUB_LIST_FAILURE,
    message
})

//取得貼文列表
export const getPostListSuccess = (postList) => ({
    type: GET_POST_LIST_SUCCESS,
    postList
})

export const getPostListFailure = (message) => ({
    type: GET_POST_LIST_FAILURE,
    message
})

//點擊貼文進入貼文內頁
export const pressPostSuccess = (post) => ({
    type: PRESS_POST_SUCCESS,
    post
})

export const pressPostFailure = (message) => ({
    type: PRESS_POST_FAILURE,
    message
})

//篩選頁面按鈕觸發
export const setClubStatusSuccess = (clubList,numSelectingStatusTrue) => ({
    type: SET_CLUB_STATUS_SUCCESS,
    clubList,
    numSelectingStatusTrue
})

export const setClubStatusFailure = (message) => ({
    type: SET_CLUB_STATUS_FAILURE,
    message
})