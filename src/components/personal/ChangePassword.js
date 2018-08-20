import React from 'react'
import { View, Text, Button, TextInput, Alert, Image } from 'react-native'
import Overlayer from '../common/Overlayer'

import * as firebase from 'firebase'

class ChangePassword extends React.Component {

  state = {
    oldPassword: '',
    newPassword: '',
    newPasswordAgain: '',
    loading: false
  }

  handleSavePassword = async () => {

    try {
      const { oldPassword, newPassword, newPasswordAgain} = this.state
      const { user, password, updateUserPassword, navigation } = this.props
      
      if(oldPassword && newPassword && newPasswordAgain) {
        if(oldPassword == password) {
          if(newPassword == newPasswordAgain) {
            this.setState({ loading: true })
            await updateUserPassword(oldPassword, newPassword)
            Alert.alert('密碼更改成功!')
            navigation.pop()
          } else {
            Alert.alert('新密碼與確認密碼不相同')
          }
        } else {
          Alert.alert('舊密碼錯誤')
        }
      } else {
        Alert.alert('請勿空白')
      }

    } catch(e) {

      this.setState({ loading: false })
      Alert.alert(e.toSring())
    }
    
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>輸入舊密碼</Text>
        <TextInput placeholder='請輸入舊密碼'
          onChangeText={(oldPassword) => {this.setState({ oldPassword })}} 
        />
        <Text>輸入新密碼</Text>
        <TextInput placeholder='請輸入新密碼'
          onChangeText={(newPassword) => {this.setState({ newPassword })}} 
        />
        <Text>再次輸入新密碼</Text>
        <TextInput placeholder='再次輸入新密碼'
          onChangeText={(newPasswordAgain) => {this.setState({ newPasswordAgain })}} 
        />
        <Button title='確認修改' onPress={() => this.handleSavePassword()}/>
        {this.state.loading ? <Overlayer /> : null }
      </View>
    )
  }
}

export default ChangePassword