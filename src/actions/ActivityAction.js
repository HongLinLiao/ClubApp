/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const CREATE_ACITVITY_REQUEST = 'CREATE_ACITVITY_REQUEST'
export const CREATE_ACITVITY_SUCCESS = 'CREATE_ACITVITY_SUCCESS'
export const GET_ACTIVITY_DATA = 'GET_ACTIVITY_DATA'//放進活動

/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/
export const createAcitvityRequest = () => ({
    type: CREATE_ACITVITY_REQUEST,
})
export const createAcitvitySuccess = () => ({
    type: CREATE_ACITVITY_SUCCESS,
})

//讀取貼文
export const getActivityData = (activityData) => ({
    type: GET_ACTIVITY_DATA,
    activityData
  })