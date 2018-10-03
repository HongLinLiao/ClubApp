/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const CREATE_CLUB_SUCCESS = 'CREATE_CLUB_SUCCESS'
export const CREATE_CLUB_FAILURE = 'CREATE_CLUB_FAILURE'
export const SET_ALL_CLUB_DATA = 'SET_ALL_CLUB_DATA'
export const REMOVE_THE_CLUB = 'REMOVE_THE_CLUB'
export const SET_CLUB_PHOTO = 'SET_CLUB_PHOTO'
export const SET_CLUB_OPEN = 'SET_CLUB_OPEN'
export const SET_CURRENT_CLUB = 'SET_CURRENT_CLUB'
export const DELETE_CLUB_MEMBER = 'DELETE_CLUB_MEMBER'
export const ADD_THE_CLUB = 'ADD_THE_CLUB'

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

export const removeTheClub = (clubData, userData, settingData, cid) => ({
  type: REMOVE_THE_CLUB,
  clubData,
  userData,
  settingData,
  cid,
})

export const setClubPhoto = (clubData) => ({
  type: SET_CLUB_PHOTO,
  clubData
})

export const setClubOpen = (clubData) => ({
  type: SET_CLUB_OPEN,
  clubData
})

export const setCurrentClub = (currentCid) => ({
  type: SET_CURRENT_CLUB,
  currentCid
})

export const deleteClubMember = (clubData) => ({
  type: DELETE_CLUB_MEMBER,
  clubData
})

export const addTheClub = (clubData, userData, settingData) => ({
  type: ADD_THE_CLUB,
  clubData,
  userData,
  settingData,
})


