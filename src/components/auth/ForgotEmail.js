import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { Form, Item, Input, Label, Button, Icon} from 'native-base'


class ForgotEmail extends React.Component {

  state = {
    email: ''
  }

  handleSendEmail = async () => {

    if(this.state.email) {
      await this.props.sendResetMail(this.state.email)
      if(this.props.status) {
        this.props.navigation.navigate('SendEamilResult', {email: this.state.email})
      } 
      else {
        Alert.alert('輸入錯誤！')
      }
    }
    else {
      Alert.alert('請輸入信箱')
    }

  }


  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <Label>請輸入您的信箱</Label>
        <Item rounded >
          <Icon name='mail' />
          <Input
            autoCapitalize="none"
            placeholder='abc123@iclub.com'
            onChangeText={(email) => this.setState({email})}/>
        </Item>
        <Button style={{ marginTop: 10 }} 
        full 
        rounded 
        warning
        onPress={this.handleSendEmail}
        >
          <Text style={{ color: 'white'}}>發送</Text>
        </Button>
        <Button style={{ marginTop: 10 }} 
        full 
        rounded 
        dark
        onPress={() => this.props.navigation.navigate('Login')}
        >
          <Text style={{ color: 'white'}}>返回</Text>
        </Button>
      </View>
    )
  }
}

export default ForgotEmail