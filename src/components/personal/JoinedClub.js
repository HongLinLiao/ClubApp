import React from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
} from 'react-native'
import { ListItem } from 'react-native-elements'


class JoinedClub extends React.Component {
  
  componentDidMount() {
    console.log(this.props.navigation)
  }

  state = {
    
  }

  nextStep = () => {
    if(school && clubName)
      this.props.navigation.push('ClubPrivateSetting', {school: this.state.school, clubName: this.state.clubName})
  }

  render() {
    const { joinClub } = this.props
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>已加入社團</Text>
        {Object.keys(joinClub).map((key, index) => {
          <ListItem
            title={key}
          />
        })}
      </View>
    )
  }
}

export default JoinedClub