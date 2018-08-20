import React from 'react'
import { View, Text, Button, TextInput, Image } from 'react-native'

class AdvancedSetting extends React.Component {

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button title='驗證信箱' onPress={() => this.props.navigation.navigate('EmailReVerified')}/>
        <Button title='更改電子信箱' onPress={() => this.props.navigation.navigate('ChangeEamil')}/>
        <Button title='更改密碼' onPress={() => this.props.navigation.navigate('ChangePassword')}/>
        <Button title='關於我們' />
      </View>
    )
  }
}

export default AdvancedSetting