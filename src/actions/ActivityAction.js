/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const CREATE_ACITVITY_REQUEST = 'CREATE_ACITVITY_REQUEST'
export const CREATE_ACITVITY_SUCCESS = 'CREATE_ACITVITY_SUCCESS'


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