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
    // console.log(this.props.navigation)
  }

  state = {
    
  }

  handleQuit = async (cid) => {

    try {


    } catch(e) {
      console.log(e)
      Alert.alert(e.toString())
    }
  }

  render() {
    const { joinClub, clubs } = this.props
    return (
      <View style={{flex: 1}}>
        {Object.keys(joinClub).map((cid, index) => {
          const { clubName, schoolName} = clubs[cid]
          return(
            <ListItem
              title={clubName + '  ' + schoolName}
              rightTitle={ <Button title='退出社團' onPress={() => this.handleQuit(cid) }/> }
            />
          )
        })}
      </View>
    )
  }
}

export default JoinedClub