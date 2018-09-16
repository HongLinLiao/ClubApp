import * as UserAction from '../actions/UserAction'
import * as CommonAction from '../actions/CommonAction'
import * as firebase from "firebase"
import { ImagePicker } from 'expo'
import { Alert } from 'react-native'
import { getUserData } from './Data'


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

//找到nickName
export const getNickName = async (uid) => {
  const user = await getUserData(uid);
  const nickName = user.nickName;
  return nickName;
};