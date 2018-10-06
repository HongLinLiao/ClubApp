/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/

//Normal Action
export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST'
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS'
export const GET_POST_DATA = 'GET_POST_DATA'//放進貼文

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