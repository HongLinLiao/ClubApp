import * as UserAction from '../actions/UserAction'
import * as CommonAction from '../actions/CommonAction'
import * as firebase from "firebase"
import { ImagePicker } from 'expo' 
import { Alert } from 'react-native'




const uploadImageAsync = async (uri, user) => {

  const response = await fetch(uri);
  const blob = await response.blob(); //轉換照片格式為blob
  const ref = firebase.storage().ref().child('users/' + user.uid + '/photo')

  const snapshot = await ref.put(blob); //firebase規定使用blob格式上傳檔案

  return snapshot.ref.getDownloadURL();
}

export const changePhoto = () => async (dispatch) => {

  try {
    const user = firebase.auth().currentUser
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if(!pickerResult.cancelled) {
      uploadUrl = await uploadImageAsync(pickerResult.uri, user)

      //設定使用者url
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


export const createUserInDatabase = async (user, userInfo) => {

  try {
    const userRef = firebase.database().ref('/users').child(user.uid)
    
    userRef.set({
      eamil: user.email,
      password: userInfo.password,
      nickName: user.displayName,
      loginType: userInfo.loginType
    })

    return {
      user: {...user},
      firstLogin: true, //預設都是第一次登入
      password: userInfo.password,
      loginType: userInfo.loginType,
    }

  } catch(e) {

    console.log(e)
    throw e
  }

}

export const getUserAllState = async (user) => {

  try {
    const userRef = firebase.database().ref('/users').child(user.uid)
    const snapShot = await userRef.once('value')
    const { nickName, password, loginType } = snapShot.val()

    return  {
      user: {...user},
      firstLogin: nickName ? false : true, 
      password: password,
      loginType: loginType,
    }
    
  } catch(error) {

    throw error
    console.log(error.toString())

  }

}

export const updateUserAllState = (user) => async (dispatch) => {

  try {
    const userRef = firebase.database().ref('/users').child(user.uid)
    const snapShot = await userRef.once('value')

    if(snapShot.val()) { //不是第一次登入才進入
      const userState = await getUserAllState(user)
      dispatch(UserAction.updateUserAllState(userState)) //更新使用者所有資料
    }
    else {
      dispatch(CommonAction.setLoadingState(false)) //沒有使用者回到登入畫面
    }
    
    
  } catch(error) {

    dispatch(UserAction.updateUserAllStateFail(error.toString()))

  }

}

export const setNickName = (nickName) => async (dispatch) => {

  // dispatch(CommonAction.setLoadingState(true)) //進入等待狀態

  try {

    const user = firebase.auth().currentUser
    await user.updateProfile({
      displayName: nickName
    })
    const userRef = firebase.database().ref('/users').child(user.uid).child('nickName')
    await userRef.set(nickName) //寫進database
    
    dispatch(UserAction.updateUser({...user})) //更新使用者狀態

  } catch(error) {
    dispatch(UserAction.updateUserFail(error.toString())) 

    dispatch(CommonAction.setLoadingState(false)) //取消登帶狀態

    console.log(error.toString())

    throw error
  }

}

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