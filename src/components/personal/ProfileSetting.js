import React from 'react'
import { View, Text, Button, TextInput, Image, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'
import { selectPhoto } from '../../modules/Common'
import Overlayer from '../common/Overlayer'

class ProfileSetting extends React.Component {
  
  state = {
    nickName: this.props.user.displayName,
    photoURL: this.props.user.photoURL,
    aboutMe: this.props.aboutMe,
    loading: false
  }

  componentWillMount() {

  }

  handleSelectPhoto = async () => {

    const photoURL = await selectPhoto()
    if(photoURL) this.setState({ photoURL })

  }

  saveProfile = async () => {

    try {
      const { nickName, aboutMe, photoURL } = this.state
      if(nickName) {
        this.setState({ loading: true })

        await this.props.updateUserProfile({
          nickName,
          photoURL,
          aboutMe
        })

        this.props.navigation.pop()
      }
      else {
        Alert.alert('請輸入暱稱！')
      }

    } catch(e) {

      this.setState({ loading: false })

      console.log(e)
    }
    

  }


  render() {
    const { aboutMe } = this.props
    const { displayName, photoURL } = this.props.user
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{  width: 200, height: 200, borderRadius: 100, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', margin: 10,}}>
            <TouchableOpacity style={{ width: 200, height: 200, borderRadius: 100, overflow: 'hidden'}}
              onPress={() => this.handleSelectPhoto()}
            >
              { this.state.photoURL ? 
                <Image source={{uri: this.state.photoURL}} resizeMode='cover' style={{ width: 200, height: 200, }}/> : 
                <Image source={require('../../images/man-user.png')} resizeMode='contain' style={{height: 200, borderRadius: 100}}/>
              }
            </TouchableOpacity>
          </View>
          <TextInput defaultValue={displayName} style={{backgroundColor: 'white'}}
            onChangeText={(nickName) => this.setState({ nickName })}
          />
          <Text>社團數量</Text>
          <TextInput defaultValue={aboutMe || ''} multiline={true} numberOfLines={5} style={{width: 200, height: 200, backgroundColor: 'white',}}
            onChangeText={(aboutMe) => this.setState({ aboutMe })}
          />
          <Button title='儲存' onPress={() => this.saveProfile()}/>
          <KeyboardAvoidingView behavior='padding'>
          </KeyboardAvoidingView>
          {this.state.loading ? <Overlayer /> : null }
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export default ProfileSetting