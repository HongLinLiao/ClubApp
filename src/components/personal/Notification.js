import React from 'react'
import { View, Alert, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Image, FlatList, Switch } from 'react-native'
import { ListItem } from 'react-native-elements'
import { Constants } from 'expo';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import styles from '../../styles/personal/Notification'

class Notification extends React.Component {

  state = {
    loading: false,
    globalChecked: true,
    nightModeChecked: false,
    clubList: {}
  }

  setGlobal = async (on) => {

    try {
      await this.props.setGlobalNotification(on)

    } catch (e) {
      Alert.alert(e.toString())
    }
  }

  setNight = async (on) => {

    try {
      await this.props.setNightModeNotification(on)

    } catch (e) {
      Alert.alert(e.toString())
    }
  }

  setClub = async (cid, on) => {

    try {
      let clubSetting = {...this.props.clubNotificationList[cid]}
      clubSetting.on = on
      await this.props.setClubNotification(cid, clubSetting)

    } catch (e) {
      Alert.alert(e.toString())
    }

  }

  render() {
    const { globalNotification, nightModeNotification, clubNotificationList, clubs } = this.props

    return (
      <View style={styles.container}>
        
          <StatusBar
          backgroundColor='#f6b456'
          barStyle="light-content"
        
        />
        <ListItem
          title='夜間模式'
          switch={{value: nightModeNotification, onValueChange: () => this.setNight(!nightModeNotification) }}          
        />
        {
          Object.keys(clubNotificationList).map((cid) => {
            const item = clubNotificationList[cid]
            return (
              <ListItem
                title={ clubs[cid].clubName + '  ' + clubs[cid].schoolName }
                key={cid}
                switch={{value: item.on, onValueChange: () => this.setClub(cid, !item.on), disabled: globalNotification}}
              />
            )
          })
        }
      </View>
    )
  }
}

export default Notification




