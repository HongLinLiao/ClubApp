/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

//Normal Action
export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST'
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS'
export const GET_POST_DATA = 'GET_POST_DATA'
export const SET_POST_FAVORITE_FAILURE = 'SET_POST_FAVORITE_FAILURE' //加入或刪除貼文讚列
export const SET_POST_VIEW_FAILURE = 'SET_POST_VIEW_FAILURE'//加入貼文觀看列失敗


/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/

//新增貼文
export const createPostRequest = () => ({
  type: CREATE_POST_REQUEST,
})
export const createPostSuccess = (postData, newClubs) => ({
  type: CREATE_POST_SUCCESS,
  postData,
  newClubs,
})

//讀取貼文
export const getPostData = (postData) => ({
  type: GET_POST_DATA,
  postData
})

//加入或刪除貼文讚列
export const setPostFavoriteFailure = (message) => ({
  type: SET_POST_FAVORITE_FAILURE,
  message
})

//加入觀看失敗
export const setPostViewFailure = (message) => ({
  type: SET_POST_VIEW_FAILURE,
  message
})