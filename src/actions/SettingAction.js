/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const SET_GLOBAL_NOTIFICATION = 'SET_GLOBAL_NOTIFICATION'
export const SET_NIGHT_MODE_NOTIFICATION = 'SET_NIGHT_MODE_NOTIFICATION'
export const SET_CLUB_NOTIFICATION = 'SET_CLUB_NOTIFICATION'

/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/
export const setGlobalNotification = (on) => ({
  type: SET_GLOBAL_NOTIFICATION,
  on
})

export const setNightModeNotification = (on) => ({
  type: SET_NIGHT_MODE_NOTIFICATION,
  on
})

export const setClubNotification = (cid, clubSetting) => ({
  type: SET_CLUB_NOTIFICATION,
  cid,
  clubSetting,
})

