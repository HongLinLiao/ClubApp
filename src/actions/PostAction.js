/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const CREATE_POST_REQUEST = 'CREATE_POST_REQUEST'
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS'


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