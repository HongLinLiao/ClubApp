import * as firebase from 'firebase'
import * as ClubAction from '../actions/ClubAction'

export const createClub = (schoolName, clubName, open) => async (dispatch, getState) => {
  
  try {
    const user = firebase.auth().currentUser
    const cid = await firebase.database().ref('club').push().key
    let newJoinClub = {...getState().userReducer.joinClub}
    let newClubSetting = { on: true }

    newJoinClub[cid] = true

    let member = {}
    member[user.uid] = { status: 'master' }

    let club = {
      schoolName,
      clubName,
      open,
      member,
      initDate: new Date().toLocaleString(), //格式：2018/8/30 下午3:07:08
      imgUrl: true,
      introduction: true,
    }

    let clubInfo = {
      cid,
      schoolName,
      clubName,
      on: true,
    }


    await firebase.database().ref('clubs/' + cid).set(club)
    await firebase.database().ref('users/' + user.uid + '/joinClub').update(newJoinClub)
    await firebase.database().ref('settings/' + user.uid + '/clubNotificationList/' + cid).update(newClubSetting)



    dispatch(ClubAction.createClub(clubInfo))

  } catch(e) {
    console.log(e)
    throw e
  }
}