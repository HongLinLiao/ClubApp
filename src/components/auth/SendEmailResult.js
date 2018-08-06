import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { Form, Item, Input, Label, Button} from 'native-base'


class SendEmailResult extends React.Component {


  handleSendEmail = async () => {

    const email = this.props.navigation.getParam('email', 'Null')
    if(email) {
      await this.props.sendResetMail(email)
      Alert.alert("已發送重設信件！")
    }
    
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <Label>已發送重設信件到信箱</Label>
        <Label>{this.props.navigation.getParam('email', 'Null')}</Label>
        <Button style={{ marginTop: 10 }} 
        full 
        rounded 
        warning
        onPress={this.handleSendEmail}
        >
          <Text style={{ color: 'white'}}>重新發送</Text>
        </Button>
        <Button style={{ marginTop: 10 }} 
        full 
        rounded 
        primary
        onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={{ color: 'white'}}>確定</Text>
        </Button>
      </View>
    )
  }
}

export default SendEmailResult