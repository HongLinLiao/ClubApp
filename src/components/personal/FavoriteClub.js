import React from 'react'
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
} from 'react-native'
import { ListItem } from 'react-native-elements'
import Overlayer from '../common/Overlayer'
import { dislikeTheClub } from '../../modules/Club'

class FavoriteClub extends React.Component {
  state = {
    loading: false
  }

  dislike = (cid) => {
    Alert.alert('取消收藏社團', '確定要取消收藏社團(一旦取消蒐藏社團相關資料將被刪除))', 
        [
          {text: '再思考一下', onPress: () => console.log('再思考一下'), style: 'cancel'},
          {text: '取消收藏', onPress: () => this.handleDislike(cid)},
        ],
        { cancelable: false }
    )
  }
  handleDislike = async (cid) => {

    try {
      this.setState({ loading: true})
      const { likeClubs } = this.props
      const { clubName, schoolName } = likeClubs[cid]
      await dislikeTheClub(cid)
      
      Alert.alert('已取消蒐藏 ' + clubName + ' ' + schoolName)
      this.setState({ loading: false})

    } catch(e) {
      console.log(e)
      Alert.alert(e.toString())
      this.setState({ loading: false})

    }
  }


  render() {
    const { likeClubs } = this.props
    return (
      <View style={{flex: 1}}>
        {Object.keys(likeClubs).map((cid, index) => {
          const { clubName, schoolName} = likeClubs[cid]
          return(
            <ListItem
              key={cid}
              title={clubName + '  ' + schoolName}
              rightTitle={ <Button title='取消收藏' onPress={() => this.dislike(cid)}/> }
            />
          )
        })}
        {this.state.loading ? <Overlayer /> : null}
      </View>
    )
  }
}

export default FavoriteClub