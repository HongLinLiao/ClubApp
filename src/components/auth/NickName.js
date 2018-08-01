import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { Form, Item, Input, Label, Button} from 'native-base'


class NickName extends React.Component {

  state = {
    nickName: ''
  }

  handleSendEmail = async () => {

  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <Label>請輸入暱稱</Label>
        <Item rounded >
          <Input
            autoCapitalize="none"
            placeholder='希望大家怎麼稱呼你'
            onChangeText={(nickName) => this.setState({nickName})}/>
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

export default NickName