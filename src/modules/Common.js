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