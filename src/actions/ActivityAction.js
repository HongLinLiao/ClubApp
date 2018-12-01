/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const CREATE_ACITVITY_REQUEST = 'CREATE_ACITVITY_REQUEST'
export const CREATE_ACITVITY_SUCCESS = 'CREATE_ACITVITY_SUCCESS'

//活動同步
export const GET_ACTIVITYLIST = 'GET_ACTIVITYLIST'//放進活動列
export const GET_ACTIVITY = 'GET_ACTIVITY'//放進活動
export const GET_SETACTIVITYLIST = 'GET_SETACTIVITYLIST'//放進每個tab設定活動列
export const GET_SETACTIVITY = 'GET_SETACTIVITY'//放進每個tab設定活動
//清空reducer
export const CLEAR_ACTIVITY = 'CLEAR_ACTIVITY'

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

//放進活動列
export const getActivityList = (activityList) => ({
    type: GET_ACTIVITYLIST,
    activityList
})
//放進活動
export const getActivity = (activity) => ({
    type: GET_ACTIVITY,
    activity
})
//放進每個tab設定活動列
export const getSetActivityList = (setActivityList) => ({
    type: GET_SETACTIVITYLIST,
    setActivityList
})
//放進每個tab設定活動
export const getSetActivity = (setActivity) => ({
    type: GET_SETACTIVITY,
    setActivity
})
//清空reducer
export const clearActivity = () => ({
    type: CLEAR_ACTIVITY,
})