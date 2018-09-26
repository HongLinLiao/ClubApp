import React from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  Alert
} from 'react-native'
import { ListItem } from 'react-native-elements'


class JoinedClub extends React.Component {
  
  componentDidMount() {
    // console.log(this.props.navigation)
  }

  state = {
    
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
      this.props.quitTheClub(cid)

      Alert.alert('成功退出社團')

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
              key={cid}
              title={clubName + '  ' + schoolName}
              rightTitle={ <Button title='退出社團' onPress={() => this.quit(cid) }/> }
            />
          )
        })}
      </View>
    )
  }
}

export default JoinedClub