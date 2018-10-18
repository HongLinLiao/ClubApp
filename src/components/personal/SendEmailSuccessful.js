import React from 'react'
import { View, Text, Button } from 'react-native'

class SendEmailSuccessful extends React.Component {

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>信件已寄送至</Text>
        <Text>{this.props.user.email}</Text>
        <Button title='確認' onPress={() => this.props.navigation.pop(2)}/>
      </View>
    )
  }
}

export default SendEmailSuccessful