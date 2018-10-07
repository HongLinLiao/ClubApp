import React from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  Alert
} from 'react-native'
import { ListItem } from 'react-native-elements'
import Overlayer from '../common/Overlayer'


class JoinedClub extends React.Component {

  state = {
    loading: false
  }

  quit = (cid) => {
    Alert.alert('退出社團', '確定要退出社團(一旦退出社團相關資料將被刪除))', 
        [
          {text: '再思考一下', onPress: () => console.log('再思考一下'), style: 'cancel'},
          {text: '退出', onPress: () => this.handleQuit(cid)},
        ],
        { cancelable: false }
    )
  }
  handleQuit = async (cid) => {

    try {
      this.setState({ loading: true})
      const { quitTheClub, joinClubs } = this.props
      const { clubName, schoolName } = joinClubs[cid]
      await quitTheClub(cid)
      
      Alert.alert('已退出 ' + clubName + ' ' + schoolName)
      this.setState({ loading: false})

    } catch(e) {
      console.log(e)
      Alert.alert(e.toString())
      this.setState({ loading: false})
    }
  }

  render() {
    const { joinClubs } = this.props
    return (
      <View style={{flex: 1}}>
        {Object.keys(joinClubs).map((cid, index) => {
          const { clubName, schoolName } = joinClubs[cid]
          return(
            <ListItem
              key={cid}
              title={clubName + '  ' + schoolName}
              rightTitle={ <Button title='退出社團' onPress={() => this.quit(cid) }/> }
            />
          )
        })}
        {this.state.loading ? <Overlayer /> : null}
      </View>
    )
  }
}

export default JoinedClub