import React from 'react'
import { View, Text, Button, TextInput, Alert, Image } from 'react-native'
import Overlayer from '../common/Overlayer'

class EmailReVerified extends React.Component {

  state = {
    password: '',
    loading: false
  }

  handleSendEmail = async () => {

    try {
      const { password, sendVerifiedMail, navigation } = this.props
      if(this.state.password == password) {

        this.setState({ loading: true })
        await sendVerifiedMail()

        navigation.push('SendEmailSuccessful')
  
      } else {
        Alert.alert('密碼錯誤')
      }

    } catch(e) {

      this.setState({ loading: false })
      Alert.alert('發送失敗')
    }
    
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>電子信箱</Text>
        <Text>{this.props.user.email}</Text>
        <Text>輸入登入密碼</Text>
        <TextInput placeholder='請輸入密碼'
          onChangeText={(password) => {this.setState({ password })}} 
        />
        <Button title='發送驗證碼' onPress={() => this.handleSendEmail()}/>
        {this.state.loading ? <Overlayer /> : null }
      </View>
    )
  }
}

export default EmailReVerified