import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import styles from '../../styles/personal/FavoriteClub';


class FavoriteClub extends React.Component {
  state = {
  }
  componentDidMount() {
    // console.log(this.props.navigation)
  }
  quit = (cid) => {
    Alert.alert('取消收藏社團', '確定要取消收藏社團社團)',
      [
        { text: '再思考一下', onPress: () => console.log('再思考一下'), style: 'cancel' },
        { text: '取消收藏', onPress: () => this.handleQuit(cid) },
      ],
      { cancelable: false }
    )
  }
  handleQuit = async (cid) => {

    try {
      this.props.quitTheClub(cid)

      Alert.alert('成功取消收藏社團')

    } catch (e) {
      console.log(e)
      Alert.alert(e.toString())
    }
  }


  nextStep = () => {
    if (school && clubName)
      this.props.navigation.push('ClubPrivateSetting', { school: this.state.school, clubName: this.state.clubName })
  }

  render() {
    const { likeClub, clubs } = this.props
    return (
      <View style={styles.container}>
        <StatusBarPaddingIOS style={{ backgroundColor: '#f6b456' }} />
        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"
        />
        <ScrollView>
          {Object.keys(likeClub).map((key, index) => {
            const { clubName, schoolName } = clubs[key]
            return (
              <View style={styles.listView}>
                <View style={styles.textArea}>
                  <Text style={styles.school}>{schoolName}</Text>
                  <Text style={styles.club}>{clubName}</Text>
                </View>
                <View>
                  <TouchableOpacity onPress={() => this.quit(key)}>
                    <Image source={require('../../images/garbage.png')}
                      style={styles.garbageIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    );
  }
}
export default FavoriteClub