import React from 'react'
import { View, Text, Button, TextInput, Image, TouchableOpacity } from 'react-native'

class ProfileSetting extends React.Component {
  
  componentWillMount() {

  }

  render() {
    const {user} = this.props
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{  width: 200, height: 200, borderRadius: 100, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', margin: 10,}}>
          <TouchableOpacity style={{ width: 200, height: 200, borderRadius: 100, overflow: 'hidden'}}>
            { user.photoURL ? 
              <Image source={{uri: user.photoURL}} resizeMode='cover' style={{ width: 200, height: 200, }}/> : 
              <Image source={require('../../images/man-user.png')} resizeMode='contain' style={{height: 200, borderRadius: 100}}/>
            }
          </TouchableOpacity>
        </View>
        <TextInput defaultValue={user.displayName} style={{backgroundColor: 'white'}}/>
        <Text>社團數量</Text>
        <TextInput multiline={true} numberOfLines={5} style={{width: 200, height: 200, backgroundColor: 'white',}}/>
        <Button title='儲存'/>
      </View>
    )
  }
}


export default ProfileSetting