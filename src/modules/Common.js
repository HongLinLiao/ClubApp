import * as UserAction from '../actions/UserAction'
import * as CommonAction from '../actions/CommonAction'
import * as firebase from "firebase"
import { ImagePicker, Permissions, Notifications } from 'expo'
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

//判斷社團是收藏還是加入
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


export const convertClubStatus = (status) => {
  switch(status) {
    case 'master':
      return '社長'
    case 'supervisor':
      return '幹部'
    case 'member':
      return '社員'
    default:
      return '無職位'
  }
}

export const convertDateFormat = (dateTime) => {
  const _dateTime = new Date(dateTime)
  const date = _dateTime.toLocaleDateString()
  const hours = _dateTime.getHours() < 10 ? '0' + _dateTime.getHours() : _dateTime.getHours()
  const minutes = _dateTime.getMinutes() < 10 ? '0' + _dateTime.getMinutes() : _dateTime.getMinutes()

  return `${date} ${hours}:${minutes}`
}


export const handleAuthError = (error) => {
  switch(error.code) {
    case "auth/invalid-email":
      return "信箱格式不正確!"
    case "auth/user-not-found":
      return "使用者不存在!"
    case "auth/wrong-password":
      return "密碼錯誤!"
    case "auth/email-already-in-use":
      return "帳號已有人使用!"
    case "auth/weak-password":
      return "密碼需至少6個字！"
    case "auth/account-exists-with-different-credential":
      return "信箱已被註冊使用！"
    default:
      return error.message
  }
}