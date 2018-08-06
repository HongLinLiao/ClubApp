import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { Form, Item, Input, Label, Button} from 'native-base'


class NickName extends React.Component {

  state = {
    nickName: ''
  }

  handleSetNickName = async () => {
    const { setNickName, setUserFirstLgoin } = this.props
    const { nickName } = this.state
    if(nickName) {
      await setNickName(nickName)
      setUserFirstLgoin(false)
    }
    else {
      Alert.alert('請輸入暱稱')
    }
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
        primary
        onPress={() => this.handleSetNickName()}
        >
          <Text style={{ color: 'white'}}>確定</Text>
        </Button>
      </View>
    )
  }
}

export default NickName