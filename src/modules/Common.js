import * as UserAction from '../actions/UserAction'
import * as CommonAction from '../actions/CommonAction'
import * as firebase from "firebase"
import { ImagePicker, Permissions, Notifications } from 'expo'
import { Alert } from 'react-native'
import { store } from '../../App'


//從圖庫裡取照片
export const selectPhoto = async () => {

  try {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!pickerResult.cancelled) {

      return pickerResult.uri
    }
    else {
      return null
    }

  } catch (e) {

    console.log(e)
    throw e
  }

}

//從相機拍照取得照片
export const takePhoto = async () => {

  try {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!pickerResult.cancelled) {

      return pickerResult.uri
    } else {
      return null
    }

  } catch (e) {

    console.log(e)
    throw e
  }
}

//轉換職位status轉換成中文
export const changeMemberStatusToChinese = (status) => {
  if(status==='master'){
    return '社長';
  }
  else{
    return '社員';
  }
}

//判斷社團是蒐藏還是加入
export const joinOrLikeClub = (cid) => {
  const { joinClub, likeClub } = store.getState().userReducer
  let result = null
  
  Object.keys(joinClub).map((joinCid) => {
    if(joinCid == cid) result = 'JOIN'
  })

  if(result) return result

  Object.keys(likeClub).map((likeCid) => {
      if(likeCid == cid) result = 'LIKE'
  })

  return result
}


//註冊推播權限
export const registerForPushNotificationsAsync = async (user) => {
  try {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    
    // console.log(user.uid)
    // console.log(token)

    // var partOfToken = token.substring(18, token.length-1)
    // Alert.alert('My token part is ', partOfToken)
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    await firebase.database().ref('users').child(user.uid).update({expoToken: token})

  } catch(e) {
    console.log(e.toString())
    throw e
  }
}