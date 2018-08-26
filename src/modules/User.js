import * as UserAction from '../actions/UserAction'
import * as CommonAction from '../actions/CommonAction'
import * as firebase from "firebase"
import { selectPhoto } from './Common'
import { Alert } from 'react-native'


/*
|-----------------------------------------------
|   使用者redux相關
|-----------------------------------------------
*/

//從database取得使用者資料並更新redux
export const updateUserStateAsync = (user) => async (dispatch) => {

  try {
    const userRef = firebase.database().ref('/users').child(user.uid)
    const settingRef = firebase.database().ref('/setting').child(user.uid)
    const userData = await userRef.once('value')
    const settingData = await settingRef.once('value')

    if(userData.val()) { //不是第一次登入才進入
      let userSetting = null
      
      if(settingData.val()) { //有沒有使用者設定資料
        userSetting = await getUserSettingToRedux(settingData)
      } else {
        userSetting = createUserSettingInDB(settingRef)
      }

      let userState = await getUserStateToRedux(userData)
      userState = {...userState, userSetting}
      dispatch(UserAction.updateUserState(userState)) //更新使用者所有資料
    }
    else {
      dispatch(CommonAction.setLoadingState(false)) //沒有使用者停止等待畫面
    }
    
    
  } catch(error) {

    dispatch(UserAction.updateUserStateFail(error.toString()))
    console.log(error.toString())
    throw error
  }

}

//重新載入user並更新redux
export const reloadUser = () => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    await user.reload() //重新載入使用者

    dispatch(UserAction.updateUser({...user})) //更新使用者狀態
    

  } catch(error) {

    dispatch(UserAction.updateUserFail(error.toString()))

    dispatch(CommonAction.setLoadingState(false)) //停止等待狀態
  }

}

/*
|-----------------------------------------------
|   使用者database相關
|-----------------------------------------------
*/

//從database取得redux資料
export const getUserStateToRedux = async (snapShot) => {

  try {
    const user = firebase.auth().currentUser
    const { nickName, password, loginType, aboutMe, joinClub, likeClub } = snapShot.val()

    return  {
      user: {...user},
      firstLogin: nickName ? false : true, 
      password: password || null, //串接平台登入沒有密碼
      loginType: loginType || null, //必要
      aboutMe: aboutMe || null,
      joinClub: joinClub ? Object.keys(joinClub) : null,
      likeClub: likeClub ? Object.keys(likeClub) : null,
    }
    
  } catch(error) {

    throw error
    console.log(error.toString())

  }

}

//從database取得使用者設定
export const getUserSettingToRedux = async (snapShot) => {

  try {
    
    const { globalNotification, nightModeNotification, clubNotification } = snapShot.val()

    return {
      globalNotification: globalNotification == undefined ? globalNotification : true,
      nightModeNotification: nightModeNotification == undefined ? nightModeNotification : false,
      clubNotification: clubNotification ? Object.keys(clubNotification) : []
    }

  } catch(e) {

    throw e
    console.log(e.toString())

  }
}

//把使用者資料寫入資料庫
export const setUserStateToDB = async (userState) => {

  try {
    const user = firebase.auth().currentUser
    const userRef = firebase.database().ref('/users').child(user.uid)
    const snapShot = await userRef.once('value')
    const userData = snapShot.val()

    if(userState.nickName)
      userData = {...userData, nickName: userState.nickName}

    if(userState.password)
      userData = {...userData, password: userState.password}

    if(userState.aboutMe)
      userData = {...userData, aboutMe: userState.aboutMe}

    await userRef.set(userData)

  } catch(e) {

    console.log(e)

    throw e
  }
  
}

//新增一個user資料進database
export const createUserInDatabase = async (user, userInfo) => {

  try {
    const userRef = firebase.database().ref('users').child(user.uid)
    const settingRef = firebase.database().ref('setting').child(user.uid)
    
    await userRef.set({
      eamil: user.email,
      password: userInfo.password,
      nickName: user.displayName,
      loginType: userInfo.loginType
    })

    await settingRef.set({
      globalNotification: true,
      nightModeNotification: false,
      clubNotification: []
    })

    return {
      user: {...user},
      firstLogin: true, //預設都是第一次登入
      password: userInfo.password,
      loginType: userInfo.loginType,
      userSetting: {
        globalNotification: true,
        nightModeNotification: false,
        clubNotification: []
      }
    }

  } catch(e) {

    console.log(e)
    throw e
  }

}

export const createUserSettingInDB = async (settingRef) => {

  try {
    await settingRef.set({
      globalNotification: true,
      nightModeNotification: false,
      clubNotification: []
    })

    return {
      globalNotification: true,
      nightModeNotification: false,
      clubNotification: []
    }
  } catch(e) {
    console.log(e)
    throw e
  }
}

/*
|-----------------------------------------------
|   使用者storage相關
|-----------------------------------------------
*/

//上傳個人照片進storage
export const uploadImageAsync = async (uri, user) => {

  const response = await fetch(uri);
  const blob = await response.blob(); //轉換照片格式為blob
  const ref = firebase.storage().ref().child('users/' + user.uid + '/photo')

  const snapshot = await ref.put(blob); //firebase規定使用blob格式上傳檔案

  return snapshot.ref.getDownloadURL();
}

/*
|-----------------------------------------------
|   使用者操作相關
|-----------------------------------------------
*/

//更換大頭貼
export const changePhoto = () => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    const photoUrl = await selectPhoto() //選擇照片

    if(photoUrl) {
      uploadUrl = await uploadImageAsync(photoUrl, user)

      //更新使用者url
      await user.updateProfile({ 
        photoURL: uploadUrl
      })

      dispatch(UserAction.updateUser({...user}))
    }

  } catch(error) {

    Alert.alert(error.toString())
    console.log(error.toString())
  }
  
}

//更新使用者基本資料
export const updateUserProfile = (profile) => async (dispatch, getState) => {

  try {
    const user = firebase.auth().currentUser
    const userRef = firebase.database().ref('/users').child(user.uid)
    const { aboutMe } = getState().userReducer
    let userState = {}


    //更新photo
    const uploadUrl = await uploadImageAsync(profile.photoURL, user)
    await user.updateProfile({ photoURL: uploadUrl })

    //更新nickName
    if(user.displayName != profile.nickName)
      await user.updateProfile({ displayName: profile.nickName })
      userState = {...userState, nickName: profile.nickName}

    //更新aboutMe
    if(aboutMe != profile.aboutMe)
      userState = {...userState, aboutMe: profile.aboutMe}

    //寫入database
    await setUserStateToDB(userState)
      
    //更新redux
    dispatch(UserAction.updateUserProfile({...user}, profile)) 

  } catch(e) {

    dispatch(UserAction.updateUserProfileFail(e.toString()))

    throw e
  }
} 

//設定暱稱
export const setNickName = (nickName) => async (dispatch) => {

  // dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  try {

    const user = firebase.auth().currentUser
    const userRef = firebase.database().ref('/users').child(user.uid).child('nickName')

    //更新 firebase user
    await user.updateProfile({
      displayName: nickName
    })
    
    //更新 database
    await userRef.set(nickName)
    
    //更新 redux state
    dispatch(UserAction.updateUser({...user})) 

  } catch(error) {
    dispatch(UserAction.updateUserFail(error.toString())) 

    dispatch(CommonAction.setLoadingState(false)) //取消登帶狀態

    console.log(error.toString())

    throw error
  }

}


