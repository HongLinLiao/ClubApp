/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST'
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS'
export const SET_POST_FAVORITE_SUCCESS = 'SET_POST_FAVORITE_SUCCESS' //加入或刪除貼文讚列
export const SET_POST_FAVORITE_FAILURE = 'SET_POST_FAVORITE_FAILURE'
export const SET_POST_VIEW_SUCCESS = 'SET_POST_VIEW_SUCCESS' //加入或刪除貼文觀看列
export const SET_POST_VIEW_FAILURE = 'SET_POST_VIEW_FAILURE'

/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/
export const createPostRequest = () => ({
  type: CREATE_POST_REQUEST,
})
export const createPostSuccess = (postData, newClubs) => ({
  type: CREATE_POST_SUCCESS,
  postData,
  newClubs,
})

//加入或刪除貼文讚列
export const setPostFavoriteSuccess = (post) => ({
  type: SET_POST_FAVORITE_SUCCESS,
  post
})
export const setPostFavoriteFailure = (message) => ({
  type: SET_POST_FAVORITE_FAILURE,
  message
})

//加入觀看
export const setPostViewSuccess = (postList) => ({
  type: SET_POST_VIEW_SUCCESS,
  postList
})
export const setPostViewFailure = (message) => ({
  type: SET_POST_VIEW_FAILURE,
  message
})