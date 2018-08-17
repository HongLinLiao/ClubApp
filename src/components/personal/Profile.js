import React from 'react'
import { View, Text, Button, TextInput, Image } from 'react-native'

class Profile extends React.Component {
  
  componentWillMount() {

  }

  render() {
    const {user, signOut} = this.props
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{  width: 200, height: 200, borderRadius: 100, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', margin: 10}}>
          { user.photoURL ? 
            <Image source={{uri: user.photoURL}} resizeMode='cover' style={{ width: 200, height: 200, }}/> : 
            <Image source={require('../../images/man-user.png')} resizeMode='contain' style={{height: 200, borderRadius: 100}}/>
          }
        </View>
        <Text>{user.displayName}</Text>
        <Text>社團數量</Text>
        <Button title='編輯個人' onPress={() => this.props.navigation.push('ProfileSetting')}/>
        <Button title='社團管理'/>
        <Button title='通知設定'/>
        <Button title='進階管理'/>
        <Button title='登出' onPress={() => signOut()}/>
      </View>
    )
  }
}


export default Profile