/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const CREATE_CLUB_SUCCESS = 'CREATE_CLUB_SUCCESS'
export const CREATE_CLUB_FAILURE = 'CREATE_CLUB_FAILURE'
export const SET_ALL_CLUB_DATA = 'SET_ALL_CLUB_DATA'
export const REMOVE_THE_CLUB = 'REMOVE_THE_CLUB'

/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/
export const createClubSuccess = (clubData) => ({
  type: CREATE_CLUB_SUCCESS,
  clubData
})

export const createClubFail = (message) => ({
  type: CREATE_CLUB_FAILURE,
  message
})

export const setAllClubData = (clubData) => ({
  type: SET_ALL_CLUB_DATA,
  clubData
})

export const removeTheClub = (clubData) => ({
  type: REMOVE_THE_CLUB,
  clubData
})
