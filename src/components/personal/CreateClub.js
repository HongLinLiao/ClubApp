import React from 'react'
import {
  View,
  Button,
  Text,
  Alert,
  TextInput
} from 'react-native'

class CreateClub extends React.Component {
  state = {
    school: '長庚大學',
    clubName: '熱舞社',
  }

  nextStep = () => {
    if(this.state.school && this.state.clubName)
      this.props.navigation.push('ClubPrivateSetting', {school: this.state.school, clubName: this.state.clubName})
    else
      Alert.alert('請勿空白')
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>輸入大學名稱</Text>
        <TextInput placeholder='大學名稱' onChangeText={(school) => this.setState({school})}/>
        <Text>輸入社團名稱</Text>
        <TextInput placeholder='社團名稱' onChangeText={(clubName) => this.setState({clubName})}/>
        <Button title='下一步' onPress={() => this.nextStep()} />
      </View>
    )
  }
}

export default CreateClub