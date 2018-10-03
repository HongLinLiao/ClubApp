/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

export const GET_HOME_CLUBLIST_SUCCESS = 'GET_HOME_CLUBLIST_SUCCESS' //取得clubList For selecting成功
export const GET_HOME_CLUBLIST_FAILURE = 'GET_HOME_CLUBLIST_FAILURE' //取得clubList For selecting失敗
export const GET_HOME_POSTLIST_SUCCESS = 'GET_HOME_POSTLIST_SUCCESS' //取得首頁貼文列表成功
export const GET_HOME_POSTLIST_FAILURE = 'GET_HOME_POSTLIST_FAILURE' //取得首頁貼文列表失敗
export const GET_HOME_INSIDE_POST_SUCCESS = 'GET_HOME_INSIDE_POST_SUCCESS' //進入貼文內頁成功
export const GET_HOME_INSIDE_POST_FAILURE = 'GET_HOME_INSIDE_POST_FAILURE' //進入貼文內頁失敗
export const GET_HOME_INSIDE_POST_COMMENT_SUCCESS = 'GET_HOME_INSIDE_POST_COMMENT_SUCCESS' //取得貼文留言
export const SET_HOME_COMMENT_STATUS_SUCCESS = 'SET_HOME_COMMENT_STATUS_SUCCESS' //更改留言編輯狀態
export const SET_HOME_CLUBLIST_STATUS_SUCCESS = 'SET_HOME_CLUBLIST_STATUS_SUCCESS' //首頁篩選頁面按鈕觸發成功
export const SET_HOME_CLUBLIST_STATUS_FAILURE = 'SET_HOME_CLUBLIST_STATUS_FAILURE' //首頁篩選頁面按鈕觸發失敗


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

//進入貼文內頁
export const getHomeInsidePostSuccess = (post) => ({
    type: GET_HOME_INSIDE_POST_SUCCESS,
    post
})
export const getHomeInsidePostFailure = (message) => ({
    type: GET_HOME_INSIDE_POST_FAILURE,
    message
})

//取得貼文留言
export const getHomeInsidePostCommentSuccess = (comment) => ({
    type: GET_HOME_INSIDE_POST_COMMENT_SUCCESS,
    comment
})

//更改留言編輯狀態
export const setHomeCommentStatusSuccess = (comment) => ({
    type: SET_HOME_COMMENT_STATUS_SUCCESS,
    comment
})