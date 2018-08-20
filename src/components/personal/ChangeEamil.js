import React from 'react'
import { View, Text, Button, TextInput, Alert, Image } from 'react-native'
import Overlayer from '../common/Overlayer'

class ChangeEamil extends React.Component {

  state = {
    password: '',
    newEmail: '',
    loading: false
  }

  handleChangeEmail = async (newEmail, password) => {
    try {
      if(newEmail && password) {
        if(password == this.props.password) {
          this.setState({ loading: true })
          await this.props.changeEmail(newEmail, password)
          Alert.alert('更改成功')
          this.props.navigation.pop()
        }
        else {
          Alert.alert('密碼錯誤')
        }
      }
      else {
        Alert.alert('請勿空白')
      }
    } catch(e) {
      Alert.alert(e.toString())
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>目前電子信箱</Text>
        <Text>{this.props.user.email}</Text>
        <Text>輸入新的電子信箱</Text>
        <TextInput placeholder='新的電子信箱' autoCapitalize='none'
          onChangeText={(newEmail) => {this.setState({ newEmail })}} 
        />
        <Text>輸入登入密碼</Text>
        <TextInput placeholder='請輸入密碼'
          onChangeText={(password) => {this.setState({ password })}} 
        />
        <Button title='確定更改' onPress={() => this.handleChangeEmail(this.state.newEmail, this.state.password)}/>
        {this.state.loading ? <Overlayer /> : null }
      </View>
    )
  }
}

export default ChangeEamil