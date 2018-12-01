/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

//Normal Action
export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST'
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS'

//貼文同步
export const GET_POSTLIST = 'GET_POSTLIST'//放進貼文列
export const GET_POST = 'GET_POST'//放進貼文
export const GET_SETPOSTLIST = 'GET_SETPOSTLIST'//放進每個tab設定貼文列
export const GET_SETPOST = 'GET_SETPOST'//放進每個tab設定貼文
//清空reducer
export const CLEAR_POST = 'CLEAR_POST'

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

//放進貼文列
export const getPostList = (postList) => ({
  type: GET_POSTLIST,
  postList
})
//放進貼文
export const getPost = (post) => ({
  type: GET_POST,
  post
})
//放進每個tab設定貼文列
export const getSetPostList = (setPostList) => ({
  type: GET_SETPOSTLIST,
  setPostList
})
//放進每個tab設定貼文
export const getSetPost = (setPost) => ({
  type: GET_SETPOST,
  setPost
})
//清空reducer
export const clearPost = () => ({
  type: CLEAR_POST,
})