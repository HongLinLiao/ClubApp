import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { Form, Item, Input, Label, Button} from 'native-base'


class EmailVerify extends React.Component {


  handleSendEmail = async () => {

    await this.props.sendVerifiedMail()
    Alert.alert("驗證信已發送！")

  }

  verify = async () => {
    
    await this.props.reloadUser() //重新載入使用者和更新state

  }

  dontAsk = () => {

    this.props.setVerifyEmailAgain(false) //更新UserState
    
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <Label>已寄發驗證碼到信箱</Label>
        <Label>{this.props.navigation.getParam('email', 'Null')}</Label>
        <Button style={{ marginTop: 10 }} 
        full 
        rounded 
        warning
        onPress={this.handleSendEmail}
        >
          <Text style={{ color: 'white'}}>重新發送驗證碼</Text>
        </Button>
        <Button style={{ marginTop: 10 }} 
        full 
        rounded 
        primary
        onPress={this.verify}
        >
          <Text style={{ color: 'white'}}>驗證成功</Text>
        </Button>
        <Button style={{ marginTop: 10 }} 
        full 
        rounded 
        danger
        onPress={this.dontAsk}
        >
          <Text style={{ color: 'white'}}>稍後驗證</Text>
        </Button>
      </View>
    )
  }
}

export default EmailVerify