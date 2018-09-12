/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

export const GET_HOME_CLUBLIST_SUCCESS = 'GET_HOME_CLUBLIST_SUCCESS' //取得clubList For selecting成功
export const GET_HOME_CLUBLIST_FAILURE = 'GET_HOME_CLUBLIST_FAILURE' //取得clubList For selecting失敗
export const GET_HOME_POSTLIST_SUCCESS = 'GET_HOME_POSTLIST_SUCCESS' //取得首頁貼文列表成功
export const GET_HOME_POSTLIST_FAILURE = 'GET_HOME_POSTLIST_FAILURE' //取得首頁貼文列表失敗
export const PRESS_POST_SUCCESS = 'PRESS_POST_SUCCESS' //點擊貼文進入貼文內頁成功
export const PRESS_POST_FAILURE = 'PRESS_POST_FAILURE' //點擊貼文進入貼文內頁失敗
export const SET_HOME_CLUBLIST_STATUS_SUCCESS = 'SET_HOME_CLUBLIST_STATUS_SUCCESS' //首頁篩選頁面按鈕觸發成功
export const SET_HOME_CLUBLIST_STATUS_FAILURE = 'SET_HOME_CLUBLIST_STATUS_FAILURE' //首頁篩選頁面按鈕觸發失敗
// export const SET_LIKE_POST_SUCCESS = 'SET_LIKE_POST_SUCCESS' //點擊喜歡貼文成功
// export const SET_LIKE_POST_FAILURE = 'SET_LIKE_POST_FAILURE' //點擊喜歡貼文失敗
// export const SET_READ_POST_SUCCESS = 'SET_READ_POST_SUCCESS' //首次點擊進入貼文，造成觀看計量成功（只針對屬於社團成員）
// export const SET_READ_POST_FAILURE = 'SET_READ_POST_FAILURE' //首次點擊進入貼文，造成觀看計量失敗（只針對屬於社團成員）


/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/

//取得clubList For selecting成功
export const getHomeClubListSuccess =(clubList,numSelectingStatusTrue) =>({
    type: GET_HOME_CLUBLIST_SUCCESS,
    clubList,
    numSelectingStatusTrue
})
export const getHomeClubListFailure =(message) =>({
    type: GET_HOME_CLUBLIST_FAILURE,
    message
})

//取得首頁貼文列表
export const getHomePostListSuccess = (postList) => ({
    type: GET_HOME_POSTLIST_SUCCESS,
    postList
})
export const getHomePostListFailure = (message) => ({
    type: GET_HOME_POSTLIST_FAILURE,
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

//首頁篩選頁面按鈕觸發
export const setHomeClubListStatusSuccess = (clubList,numSelectingStatusTrue) => ({
    type: SET_HOME_CLUBLIST_STATUS_SUCCESS,
    clubList,
    numSelectingStatusTrue
})

export const setHomeClubListStatusFailure = (message) => ({
    type: SET_HOME_CLUBLIST_STATUS_FAILURE,
    message
})