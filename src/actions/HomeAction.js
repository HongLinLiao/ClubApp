/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

export const GET_POST_LIST_REQUEST = 'GET_POST_LIST_REQUEST' //取得貼文列表要求
export const GET_POST_LIST_SUCCESS = 'GET_POST_LIST_SUCCESS' //取得貼文列表成功
export const GET_POST_LIST_FAILURE = 'GET_POST_LIST_FAILURE' //取得貼文列表失敗
export const PRESS_POST_SUCCESS = 'PRESS_POST_SUCCESS' //選取貼文成功
export const PRESS_POST_FAILURE = 'PRESS_POST_FAILURE' //選取貼文失敗
export const SELECT_CLUB_REQUEST = 'SELECT_CLUB_REQUEST' //篩選社團要求
export const SELECT_CLUB_SUCCESS = 'SELECT_CLUB_SUCCESS' //篩選社團要求
export const SELECT_CLUB_FAILURE = 'SELECT_CLUB_FAILURE' //篩選社團要求

/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/

//取得貼文
export const getPostListRequest = () => ({
    type: GET_POST_LIST_REQUEST
})

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

//篩選社團動作
export const selectClubRequest = () => ({
    type: SELECT_CLUB_REQUEST
})

export const selectClubSuccess = () => ({
    type: SELECT_CLUB_SUCCESS,
    postList
})

export const selectClubFailure = (message) => ({
    type: SELECT_CLUB_FAILURE,
    message
})