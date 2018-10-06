import * as firebase from 'firebase'
import * as ClubAction from '../actions/ClubAction'
import { getClubData, getUserSetting, updateClub, updateUser, updateUserSetting, getUserData } from './Data'
import { selectPhoto } from './Common'
import { listenToClub } from './Listener'

/*
|-----------------------------------------------
|   Database相關
|-----------------------------------------------
*/

export const getAllClubData = async () => {

  try {
    const user = firebase.auth().currentUser
    const userRef = firebase.database().ref('users').child(user.uid)
    const userShot = await userRef.once('value')
    const { joinClub, likeClub } = userShot.val()
    
    let allClubCid = []
    let allClubData = {}

    if (joinClub)
      allClubCid = [...allClubCid, ...Object.keys(joinClub)]

    if (likeClub)
      allClubCid = [...allClubCid, ...Object.keys(likeClub)]

    const promises = allClubCid.map(
      async (cid) => {
        const clubShot = await firebase.database().ref('clubs/' + cid).once('value')
        allClubData[cid] = clubShot.val()
      }
    )

    await Promise.all(promises)

    return allClubData

  } catch (e) {
    console.log(e)
    throw e
  }


}

/*
|-----------------------------------------------
|   社團相關操作
|-----------------------------------------------
*/

export const createClub = (schoolName, clubName, open) => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    const cid = await firebase.database().ref('club').push().key
    let newJoinClub = { ...getState().userReducer.joinClub }
    let newClubNotificationList = { ...getState().settingReducer.clubNotificationList }
    let newClubs = { ...getState().clubReducer.clubs }

    newJoinClub[cid] = true
    newClubNotificationList[cid] = {
      schoolName,
      clubName,
      on: true,
    }

    let member = {}
    member[user.uid] = { status: 'master' }

    let newClub = {
      schoolName,
      clubName,
      open,
      member,
      initDate: new Date().toLocaleString(), //格式：2018/8/30 下午3:07:08
      imgUrl: false,
      introduction: false,
    }

    newClubs[cid] = newClub

    let clubData = {
      newJoinClub, //userReducer更新
      newClubNotificationList, //settingReducer更新
      newClubs, //clubReducer更新
    }


    await firebase.database().ref('clubs/' + cid).set(newClub)
    await firebase.database().ref('users/' + user.uid + '/joinClub').update(newJoinClub)
    await firebase.database().ref('settings/' + user.uid + '/clubNotificationList/' + cid).update({ on: true })



    dispatch(ClubAction.createClubSuccess(clubData))

  } catch (e) {
    console.log(e)
    dispatch(ClubAction.createClubFail(e.toString()))
    throw e
  }
}

//退出社團
export const quitTheClub = (cid) => async (dispatch, getState) => {

  try {
    const { uid } = firebase.auth().currentUser
    const joinClubRef = firebase.database().ref('users').child(uid).child('joinClub')
    const clubNotificationRef = firebase.database().ref('userSettings').child(uid).child('clubNotificationList')
    const memberRef = firebase.database().ref('clubs').child(cid).child('member')

    //資料庫資料
    const { joinClub } = await getUserData(uid)
    const { member } = await getClubData(cid)
    const { clubNotificationList } = await getUserSetting(uid)

    //redux資料
    // let newJoinClub = JSON.parse(JSON.stringify(getState().userReducer.joinClub)) 
    // let newClubNotificationList = JSON.parse(JSON.stringify(getState().settingReducer.clubNotificationList))
    // let newClubs = JSON.parse(JSON.stringify(getState().clubReducer.clubs))

    //資料庫
    if(Object.keys(joinClub).length > 1) { //社員大於1
      await joinClubRef.child(cid).remove()
    } else {
      await joinClubRef.set(false)
    }

    if(Object.keys(clubNotificationList).length > 1) { //加入社團大於1
      await clubNotificationRef.child(cid).remove()
    } else {
      await clubNotificationRef.set(false)
    }

    if(Object.keys(member).length > 1) { //加入社團於1
      await memberRef.child(uid).remove()
    } else {
      await memberRef.set(false)
    }
    

    // //redux
    // delete newJoinClub[cid]
    // delete newClubNotificationList[cid]
    // delete newClubs[cid]

    
    // const rCid = randomCid(newClubs)
    // dispatch(ClubAction.setCurrentClub(rCid))
    // dispatch(ClubAction.removeTheClub(newClubs, newJoinClub, newClubNotificationList, rCid))
    
    

  } catch (e) {
    console.log(e.toString())
    throw e
  }

}



export const changeClubPhoto = (cid) => async (dispatch, getState) => {
  try {
    const clubRef = firebase.database().ref('clubs').child(cid)
    const url = await selectPhoto()

    if(url) {
      let { clubs } = getState().clubReducer
      let newClubs = JSON.parse(JSON.stringify(clubs))
      newClubs[cid].imgUrl = url
      //更新database
      await clubRef.update(newClubs[cid])

      //更新firestore
      
      //更新redux
      dispatch(ClubAction.setClubPhoto(newClubs))
      
    } else {
      throw new Error('取消選擇照片')
    }


  } catch (e) {
    console.log(e)
    throw e
  }
}

export const setClubOpen = (cid) => async (dispatch, getState) => {
  try {
    const clubRef = firebase.database().ref('clubs').child(cid)
    const { clubs } = getState().clubReducer

    
    let newClubs = JSON.parse(JSON.stringify(clubs))
    newClubs[cid].open = !newClubs[cid].open

    //更新database
    await clubRef.update(newClubs[cid])
    //更新redux
    dispatch(ClubAction.setClubOpen(newClubs))

  } catch(e) {
    console.log(e)
    throw e
  }
}

export const kickClubMember = (cid, uid) => async (dispatch, getState) => {
  try {
    const memberRef = firebase.database().ref('clubs').child(cid).child('member')
    const joinClubRef = firebase.database().ref('users').child(uid).child('joinClub')
    const clubNotificationRef = firebase.database().ref('userSettings').child(uid).child('clubNotificationList')
    const { clubs } = getState().clubReducer

    const { joinClub } = await getUserData(uid)
    const { member } = await getClubData(cid)
    const { clubNotificationList } = await getUserSetting(uid)

    let newClubs = JSON.parse(JSON.stringify(clubs))
    delete newClubs[cid].member[uid]

    //資料庫
    if(Object.keys(joinClub).length > 1) { //社員大於1
      await joinClubRef.child(cid).remove()
    } else {
      await joinClubRef.set(false)
    }

    if(Object.keys(clubNotificationList).length > 1) { //加入社團大於1
      await clubNotificationRef.child(cid).remove()
    } else {
      await clubNotificationRef.set(false)
    }

    if(Object.keys(member).length > 1) { //加入社團於1
      await memberRef.child(uid).remove()
    } else {
      await memberRef.set(false)
    }

    //redux
    // dispatch(ClubAction.deleteClubMember(newClubs))

  } catch(e) {
    console.log(e)
    throw e
  }
}



export const searchAllClub = async () => {
  try {
    const allClubRef = firebase.database().ref('clubs')
    const allClubShot = await allClubRef.once('value')
    const allClubData = allClubShot.val()

    return allClubData

  } catch(e) {
    console.log(e)
    throw e
  }
}

export const joinTheClub = (cid) => async ( dispatch, getState ) => {
  try {
    const { uid } = firebase.auth().currentUser
    const { clubs } = getState().clubReducer
    const { joinClub } = getState().userReducer
    const { clubNotificationList } = getState().settingReducer
    const clubRef = firebase.database().ref('clubs').child(cid)
    
    //資料庫變數
    const newClub = await getClubData(cid)

    //redux變數
    const newClubs = JSON.parse(JSON.stringify(clubs))
    const newJoinClub = JSON.parse(JSON.stringify(joinClub))
    const newClubNotificationList = JSON.parse(JSON.stringify(clubNotificationList))

    //資料庫修改
    newClub.member = newClub.member ? newClub.member : {}
    newClub.member[uid] = { status: 'member' }
    

    //redux修改
    newClubs[cid] = newClub
    newJoinClub[cid] = true
    newClubNotificationList[cid] = { on: true }

    //資料庫更新
    await updateUser(uid, { joinClub: newJoinClub })
    await updateUserSetting(uid, { clubNotificationList: newClubNotificationList })
    await updateClub(cid, newClub)  

    //redux更新
    // dispatch(listenToClub(clubRef))
    // dispatch(ClubAction.addTheClub(newClubs, newJoinClub, newClubNotificationList))
    // dispatch(ClubAction.setCurrentClub(cid))

    
  } catch (e) {
    console.log(e)
    throw e
  }
}




export const randomCid = (clubs) => {

  const cids = Object.keys(clubs)

  if(cids.length != 0) {
    const number = Math.floor(Math.random() * cids.length)
    return cids[number]

  } else {
    return null
  }
}

export const getClubMemberData = async (member) => {

  try {
    let memberData = {}
    let promises = Object.keys(member).map(async (uid, index) => {
      let userData = await getUserData(uid)
      memberData[uid] = userData
    })

    await Promise.all(promises)

    return memberData

  } catch(e) {
    console.log(e)
    throw e
  }
}






