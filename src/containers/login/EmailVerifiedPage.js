import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Form, Item, Input, Label, Button} from 'native-base'
import { sendVerifiedMail } from '../../modules/Auth'
import * as firebase from "firebase"


class EmailVerifiedPage extends React.Component {

  handleSendEmail = async () => {
    await sendVerifiedMail()
    Alert.alert("驗證信已發送！")
  }

  verifiedSuccess = async () => {
    const user = firebase.auth().currentUser
    await user.reload()
    if(user.emailVerified) {
      this.props.navigation.navigate('App')
    }
    else {
      Alert.alert("尚未驗證成功！")
    }
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
        onPress={this.verifiedSuccess}
        >
          <Text style={{ color: 'white'}}>驗證成功</Text>
        </Button>
      </View>
    )
  }
}



export default connect()(EmailVerifiedPage)