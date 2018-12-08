/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const SET_ALL_SETTING = 'SET_ALL_SETTING'
export const SET_GLOBAL_NOTIFICATION = 'SET_GLOBAL_NOTIFICATION'
export const SET_NIGHT_MODE_NOTIFICATION = 'SET_NIGHT_MODE_NOTIFICATION'
export const SET_NIGHT_MODE_TIME = 'SET_NIGHT_MODE_TIME'
export const SET_CLUB_NOTIFICATION = 'SET_CLUB_NOTIFICATION'

/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/
export const setAllSetting = (settingData) => ({
  type: SET_ALL_SETTING,
  ...settingData
})

export const setGlobalNotification = (on) => ({
  type: SET_GLOBAL_NOTIFICATION,
  on
})

export const setNightModeNotification = (on) => ({
  type: SET_NIGHT_MODE_NOTIFICATION,
  on
})

export const setNightModeTime = (start,end) => ({
  type: SET_NIGHT_MODE_TIME,
  start,
  end
})

export const setClubNotification = (newClubNotificationList) => ({
  type: SET_CLUB_NOTIFICATION,
  newClubNotificationList
})

