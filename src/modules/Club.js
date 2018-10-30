import * as firebase from 'firebase'
import * as ClubAction from '../actions/ClubAction'
import { getClubData, getUserSetting, updateClub, updateUser, updateUserSetting, getUserData } from './Data'
import { selectPhoto, joinOrLikeClub } from './Common'
import { listenToClub } from './Listener'
import { getHomeClubListSuccess } from '../actions/HomeAction'

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

    let clubsData = {
      newJoinClubs: {},
      newLikeClubs: {},
    }

    if (joinClub) {
      const promises = Object.keys(joinClub).map(async (cid) => {
        const clubShot = await firebase.database().ref('clubs/' + cid).once('value')
        clubsData.newJoinClubs[cid] = clubShot.val()
      })

      await Promise.all(promises)
    }

    if (likeClub) {
      const promises = Object.keys(likeClub).map(async (cid) => {
        const clubShot = await firebase.database().ref('clubs/' + cid).once('value')
        clubsData.newLikeClubs[cid] = clubShot.val()
      })

      await Promise.all(promises)
    }

    return clubsData

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

    const { joinClub } = getState().userReducer
    const { clubNotificationList } = getState().settingReducer
    const { joinClubs } = getState().clubReducer

    const newJoinClub = JSON.parse(JSON.stringify(joinClub))
    const newClubNotificationList = JSON.parse(JSON.stringify(clubNotificationList))
    const newJoinClubs = JSON.parse(JSON.stringify(joinClubs))

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

    newJoinClubs[cid] = newClub

    // let clubData = {
    //   newJoinClub, //userReducer更新
    //   newClubNotificationList, //settingReducer更新
    //   newJoinClubs, //clubReducer更新
    // }


    await firebase.database().ref('clubs/' + cid).set(newClub)
    await firebase.database().ref('userSettings/' + user.uid + '/clubNotificationList/' + cid).update({ on: true })
    await firebase.database().ref('users/' + user.uid + '/joinClub').update(newJoinClub)

    //改首頁社團列
    const homeClubList = getState().homeReducer.clubList;
    const homeClubSelect = getState().homeReducer.numSelectingStatusTrue;
    const nextHomeClubList = JSON.parse(JSON.stringify(homeClubList));
    nextHomeClubList[cid] = {
      clubKey: cid,
      selectStatus: true,
      schoolName: schoolName,
      clubName: clubName,
    };
    homeClubSelect = homeClubSelect + 1
    dispatch(getHomeClubListSuccess(nextHomeClubList, homeClubSelect));

    // dispatch(ClubAction.createClubSuccess(clubData))

  } catch (e) {
    console.log(e)
    dispatch(ClubAction.createClubFail(e.toString()))
    throw e
  }
}


export const changeClubPhoto = (cid) => async (dispatch, getState) => {
  try {
    const clubRef = firebase.database().ref('clubs').child(cid)
    const clubStorageRef = firebase.storage().ref('clubs').child(cid).child('clubPhoto')
    const uri = await selectPhoto()

    if (uri) {
      const { joinClubs } = getState().clubReducer
      const newClubs = JSON.parse(JSON.stringify(joinClubs))
      const response = await fetch(uri);
      const blob = await response.blob(); //轉換照片格式為blob

      //更新firestore
      const snapshot = await clubStorageRef.put(blob)
      const imgUrl = await snapshot.ref.getDownloadURL()

      //更新database
      newClubs[cid].imgUrl = imgUrl
      await clubRef.update(newClubs[cid])

      //更新redux
      // dispatch(ClubAction.setClubPhoto(newClubs))

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
    const { joinClubs } = getState().clubReducer


    let newClubs = JSON.parse(JSON.stringify(joinClubs))
    newClubs[cid].open = !newClubs[cid].open

    //更新database
    await clubRef.update(newClubs[cid])
    //更新redux
    dispatch(ClubAction.setClubOpen(newClubs))

  } catch (e) {
    console.log(e)
    throw e
  }
}

export const updateIntroduction = (cid, introduction) => async (dispatch, getState) => {
  try {
    const clubRef = firebase.database().ref('clubs').child(cid)
    
    //更新社團介紹
    await clubRef.update({introduction})

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
    const { joinClubs } = getState().clubReducer

    const { joinClub } = await getUserData(uid)
    const { member } = await getClubData(cid)
    const { clubNotificationList } = await getUserSetting(uid)

    let newClubs = JSON.parse(JSON.stringify(joinClubs))
    delete newClubs[cid].member[uid]

    //資料庫
    if (Object.keys(clubNotificationList).length > 1) { //加入社團大於1
      await clubNotificationRef.child(cid).remove()
    } else {
      await clubNotificationRef.set(false)
    }

    if (Object.keys(member).length > 1) { //加入社團於1
      await memberRef.child(uid).remove()
    } else {
      await memberRef.set(false)
    }

    if (Object.keys(joinClub).length > 1) { //社團大於1
      await joinClubRef.child(cid).remove()
    } else {
      await joinClubRef.set(false)
    }

    //redux
    // dispatch(ClubAction.deleteClubMember(newClubs))

  } catch (e) {
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

  } catch (e) {
    console.log(e)
    throw e
  }
}

//加入社團
export const joinTheClub = (cid) => async (dispatch, getState) => {
  try {
    const { uid } = firebase.auth().currentUser
    const { clubs } = getState().clubReducer
    const { joinClub, likeClub } = getState().userReducer
    const { clubNotificationList } = getState().settingReducer
    const clubRef = firebase.database().ref('clubs').child(cid)
    const clubType = joinOrLikeClub(cid)


    //資料庫變數
    const newClub = await getClubData(cid)

    //redux變數
    // const newClubs = JSON.parse(JSON.stringify(clubs))
    const newJoinClub = JSON.parse(JSON.stringify(joinClub))
    const newLikeClub = JSON.parse(JSON.stringify(likeClub))
    const newClubNotificationList = JSON.parse(JSON.stringify(clubNotificationList))

    //資料庫修改
    newClub.member = newClub.member ? newClub.member : {}
    newClub.member[uid] = { status: 'member' }


    //redux修改
    // newClubs[cid] = newClub
    newJoinClub[cid] = true
    newClubNotificationList[cid] = { on: true }

    //改首頁社團列
    const homeClubList = getState().homeReducer.clubList;
    const homeClubSelect = getState().homeReducer.numSelectingStatusTrue;
    const nextHomeClubList = JSON.parse(JSON.stringify(homeClubList));

    //資料庫更新
    await updateUserSetting(uid, { clubNotificationList: newClubNotificationList })
    await updateClub(cid, newClub)
    if (clubType == 'LIKE') { //加入已收藏的社團
      if (Object.keys(newLikeClub).length > 1) { //社員大於1
        delete newLikeClub[cid]
      } else {
        newLikeClub = false
      }
      await updateUser(uid, { joinClub: newJoinClub, likeClub: newLikeClub })
    } else {
      await updateUser(uid, { joinClub: newJoinClub })

      nextHomeClubList[cid] = {
        clubKey: cid,
        selectStatus: true,
        schoolName: newClub.schoolName,
        clubName: newClub.clubName,
      };

      homeClubSelect = homeClubSelect + 1
      dispatch(getHomeClubListSuccess(nextHomeClubList, homeClubSelect));
    }

    //redux更新
    // dispatch(ClubAction.addTheClub(newClubs, newJoinClub, newClubNotificationList))
    // dispatch(ClubAction.setCurrentClub(cid))


  } catch (e) {
    console.log(e)
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
    if (Object.keys(clubNotificationList).length > 1) { //加入社團大於1
      await clubNotificationRef.child(cid).remove()
    } else {
      await clubNotificationRef.set(false)
    }

    if (Object.keys(member).length > 1) { //加入社團於1
      await memberRef.child(uid).remove()
    } else {
      await memberRef.set(false)
    }

    if (Object.keys(joinClub).length > 1) { //社員大於1
      await joinClubRef.child(cid).remove()
    } else {
      await joinClubRef.set(false)
    }

    //改首頁社團列
    const homeClubList = getState().homeReducer.clubList;
    const homeClubSelect = getState().homeReducer.numSelectingStatusTrue;
    const nextHomeClubList = JSON.parse(JSON.stringify(homeClubList));
    nextHomeClubList[cid] = null;
    delete nextHomeClubList[cid];
    if (homeClubSelect != 0) {
      homeClubSelect = homeClubSelect - 1
    }
    dispatch(getHomeClubListSuccess(nextHomeClubList, homeClubSelect));


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

//蒐藏社團
export const likeTheClub = (cid) => async (dispatch, getState) => {
  try {
    const { uid } = firebase.auth().currentUser
    const { likeClub } = getState().userReducer
    const { clubNotificationList } = getState().settingReducer

    //redux變數
    const newLikeClub = JSON.parse(JSON.stringify(likeClub))
    const newClubNotificationList = JSON.parse(JSON.stringify(clubNotificationList))

    //redux修改
    newLikeClub[cid] = true
    newClubNotificationList[cid] = { on: true }

    //資料庫更新
    await updateUserSetting(uid, { clubNotificationList: newClubNotificationList })
    await updateUser(uid, { likeClub: newLikeClub })

    //改首頁社團列
    const homeClubList = getState().homeReducer.clubList;
    const homeClubSelect = getState().homeReducer.numSelectingStatusTrue;
    const nextHomeClubList = JSON.parse(JSON.stringify(homeClubList));
    const club = await getClubData(cid);
    nextHomeClubList[cid] = {
      clubKey: cid,
      selectStatus: true,
      schoolName: club.schoolName,
      clubName: club.clubName,
    };
    homeClubSelect = homeClubSelect + 1
    dispatch(getHomeClubListSuccess(nextHomeClubList, homeClubSelect));

  } catch (e) {
    console.log(e)
    throw e
  }
}

//取消收藏
export const dislikeTheClub = (cid) => async (dispatch, getState) => {
  try {
    const { uid } = firebase.auth().currentUser
    const likeClubRef = firebase.database().ref('users').child(uid).child('likeClub')
    const clubNotificationRef = firebase.database().ref('userSettings').child(uid).child('clubNotificationList')

    //資料庫資料
    const { joinClub } = await getUserData(uid)
    const { clubNotificationList } = await getUserSetting(uid)

    //資料庫
    if (Object.keys(clubNotificationList).length > 1) { //加入社團大於1
      await clubNotificationRef.child(cid).remove()
    } else {
      await clubNotificationRef.set(false)
    }

    if (Object.keys(joinClub).length > 1) { //社團大於1
      await likeClubRef.child(cid).remove()
    } else {
      await likeClubRef.set(false)
    }

    //改首頁社團列
    const homeClubList = getState().homeReducer.clubList;
    const homeClubSelect = getState().homeReducer.numSelectingStatusTrue;
    const nextHomeClubList = JSON.parse(JSON.stringify(homeClubList));
    nextHomeClubList[cid] = null;
    delete nextHomeClubList[cid];
    if (homeClubSelect != 0) {
      homeClubSelect = homeClubSelect - 1
    }
    dispatch(getHomeClubListSuccess(nextHomeClubList, homeClubSelect));

  } catch (e) {
    console.log(e)
    throw e
  }
}


export const filterOpenClub = (allClubs) => {
  const newAllClubs = {}
  Object.keys(allClubs).map((cid) => {
    if(allClubs[cid].open) {
      newAllClubs[cid] = allClubs[cid]
    }
  })
  console.log(newAllClubs)

  return newAllClubs
  
}

export const randomCid = (cids) => {

  if (cids.length != 0) {
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

  } catch (e) {
    console.log(e)
    throw e
  }
}

export const changeStatus = async (uid, cid, status) => {
  try {
    const _uid = firebase.auth().currentUser.uid
    const memberRef = firebase.database().ref('clubs').child(cid).child('member')
    switch(status) {
      case 'master':
        const member = {}
        member[_uid] = { status: 'member' }
        member[uid] = { status: 'master' }
        await memberRef.update({ ...member })
        break;
      case 'supervisor':
        await memberRef.child(uid).update({ status })
        break;
      case 'member':
        await memberRef.child(uid).update({ status })
        break;
      default:
        return '沒有符合的職位！'
    }

  } catch(e) {
    console.log(e)
    throw e
  }
}







