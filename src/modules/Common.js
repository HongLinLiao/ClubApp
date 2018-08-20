import * as UserAction from '../actions/UserAction'
import * as CommonAction from '../actions/CommonAction'
import * as firebase from "firebase"
import { ImagePicker } from 'expo' 
import { Alert } from 'react-native'


export const selectPhoto = async () => {

  try {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
  
    if(!pickerResult.cancelled) {
      
      return pickerResult.uri
    }

  } catch(e) {

    console.log(e)
    throw e
  }

}