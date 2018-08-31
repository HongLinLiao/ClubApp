/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const CREATE_CLUB = 'CREATE_CLUB'
export const SET_ALL_CLUB_DATA = 'SET_ALL_CLUB_DATA'
export const QUIT_CLUB_SUCCESS = 'QUIT_CLUB_SUCCESS'

/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/
export const createClub = (clubInfo) => ({
  type: CREATE_CLUB,
  clubInfo
})

export const setAllClubData = (clubData) => ({
  type: SET_ALL_CLUB_DATA,
  clubData
})

export const quitTheClub = () => ({
  type: QUIT_CLUB_SUCCESS,

})
