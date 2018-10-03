/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

//Normal Action
export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST'
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS'
export const SET_POST_FAVORITE_FAILURE = 'SET_POST_FAVORITE_FAILURE' //加入或刪除貼文讚列

//Dynamic Action
export const SET_POST_VIEW_FAILURE = 'SET_POST_VIEW_FAILURE'//加入貼文觀看列失敗
export const SET_POST_TO_REDUCER_POSTLIST_SUCCESS = 'SET_POST_TO_REDUCER_POSTLIST_SUCCESS'//動態更改post進各個reducer.postList
export const SET_POST_TO_REDUCER_POST_SUCCESS = 'SET_POST_TO_REDUCER_POST_SUCCESS'//動態更改post進各個reducer.post
export const SET_COMMENT_TO_REDUCER_COMMENT_SUCCESS = 'SET_COMMENT_TO_REDUCER_COMMENT_SUCCESS'//動態更改comment進各個reducer.comment

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
export const setPostFavoriteFailure = (message) => ({
  type: SET_POST_FAVORITE_FAILURE,
  message
})

//加入觀看失敗
export const setPostViewFailure = (message) => ({
  type: SET_POST_VIEW_FAILURE,
  message
})

//********************************************************************************
//多Reducer連動更改
//********************************************************************************

//動態更改post進各個reducer.postList
export const setPostToReducerPostListSuccess = (homePostList) => ({
  type: SET_POST_TO_REDUCER_POSTLIST_SUCCESS,
  homePostList
})

//動態更改post進各個reducer.post
export const setPostToReducerPostSuccess = (homePost) => ({
  type: SET_POST_TO_REDUCER_POST_SUCCESS,
  homePost
})

//動態更改comment進各個reducer.comment
export const setCommentToReducerCommentSuccess = (homeComment) => ({
  type: SET_COMMENT_TO_REDUCER_COMMENT_SUCCESS,
  homeComment
})