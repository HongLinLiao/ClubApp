import React from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
} from 'react-native'

class FavoriteClub extends React.Component {
  state = {
    
  }

  nextStep = () => {
    if(school && clubName)
      this.props.navigation.push('ClubPrivateSetting', {school: this.state.school, clubName: this.state.clubName})
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>已收藏社團</Text>
      </View>
    )
  }
}

export default FavoriteClub