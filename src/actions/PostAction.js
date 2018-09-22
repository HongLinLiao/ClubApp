/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

//Normal Action
export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST'
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS'

export const SET_POST_FAVORITE_SUCCESS = 'SET_POST_FAVORITE_SUCCESS' //加入或刪除貼文讚列
export const SET_POST_FAVORITE_FAILURE = 'SET_POST_FAVORITE_FAILURE'

//Dynamic Action
export const SET_POST_VIEW_FAILURE = 'SET_POST_VIEW_FAILURE'//加入貼文觀看列失敗
export const SET_POST_CHANGE_TO_REDUCER_SUCCESS = 'SET_POST_CHANGE_TO_REDUCER_SUCCESS'//動態更改post進各個reducer
export const SET_POST_CHANGE_TO_REDUCER_FAILURE = 'SET_POST_CHANGE_TO_REDUCER_FAILURE'

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

//加入觀看失敗
export const setPostViewFailure = (message) => ({
  type: SET_POST_VIEW_FAILURE,
  message
})

//動態更改post進各個reducer
export const setPostChangeToReducerSuccess = (homePostList) => ({
  type: SET_POST_CHANGE_TO_REDUCER_SUCCESS,
  homePostList
})
export const setPostChangeToReducerFailure= (message) => ({
  type: SET_POST_CHANGE_TO_REDUCER_FAILURE,
  message
})