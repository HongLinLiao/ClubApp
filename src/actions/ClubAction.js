/*
|-----------------------------------------------
|   ActionType Const
|-----------------------------------------------
*/
export const CREATE_CLUB = 'CREATE_CLUB'

/*
|-----------------------------------------------
|   Action Creator
|-----------------------------------------------
*/
export const createClub = (clubInfo) => ({
  type: CREATE_CLUB,
  clubInfo
})
