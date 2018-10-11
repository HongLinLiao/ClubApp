/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

export const GET_HOME_CLUBLIST_SUCCESS = 'GET_HOME_CLUBLIST_SUCCESS' //取得clubList For selecting成功
export const GET_HOME_CLUBLIST_FAILURE = 'GET_HOME_CLUBLIST_FAILURE' //取得clubList For selecting失敗
export const GET_HOME_POSTLIST_SUCCESS = 'GET_HOME_POSTLIST_SUCCESS' //取得首頁貼文列表成功
export const GET_HOME_POSTLIST_FAILURE = 'GET_HOME_POSTLIST_FAILURE' //取得首頁貼文列表失敗
export const GET_HOME_ACTIVITYLIST_SUCCESS = 'GET_HOME_ACTIVITYLIST_SUCCESS' //取得首頁貼文列表成功
export const GET_HOME_ACTIVITYLIST_FAILURE = 'GET_HOME_ACTIVITYLIST_FAILURE' //取得首頁貼文列表失敗
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

//取得首頁活動列表
export const getHomeActivityListSuccess = (activityList) => ({
    type: GET_HOME_ACTIVITYLIST_SUCCESS,
    activityList
})
export const getHomeActivityListFailure = (message) => ({
    type: GET_HOME_ACTIVITYLIST_FAILURE,
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