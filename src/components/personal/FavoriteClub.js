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
    const { likeClub, clubs } = this.props
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>已加入社團</Text>
        {Object.keys(likeClub).map((key, index) => {
          const { clubName, schoolName} = clubs[key]
          return(
            <ListItem
              title={clubName + '  ' + schoolName}
              rightTitle={ <Button title='取消收藏'/> }
            />
          )
        })}
      </View>
    )
  }
}

export default FavoriteClub