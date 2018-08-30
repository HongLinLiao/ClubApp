import React from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
} from 'react-native'

class ClubPrivateSetting extends React.Component {
  state = {
    open: false
  }

  alert = () => {
    let open = this.state.open ? '公開' : '非公開'
    Alert.alert('建立社團', '確定要建立社團(' + open + ')', 
    [
      {text: '取消建立', onPress: () => console.log('取消建立'), style: 'cancel'},
      {text: '建立', onPress: () => this.create()},
    ],
    { cancelable: false }
    )
  }

  create = async () => {

    try {
      const { navigation, createClub } = this.props
      const { getParam, popToTop, navigate } = navigation

      await createClub(getParam('school'), getParam('clubName'), this.state.open)

      popToTop()
      navigate('ClubRouter')

    } catch(e) {
      Alert.alert(e.toString())
    }
    
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>將您的社團設為</Text>
        <Button title='非公開' onPress={() => {
          this.setState({open: false})
          Alert.alert('設為非公開')
        }}/>
        <Button title='公開' onPress={() => {
          this.setState({open: true})
          Alert.alert('設為公開')
        }}/>
        <Button title='建立' onPress={() => this.alert() }/>
      </View>
    )
  }
}

export default ClubPrivateSetting