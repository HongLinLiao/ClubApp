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

  setClub = async (key, on) => {

    try {
      let clubSetting = { ...this.props.clubNotificationList[key] }
      clubSetting.on = on
      await this.props.setClubNotification(key, clubSetting)
      console.log(clubSetting)

    } catch (e) {
      Alert.alert(e.toString())
    }

  }

  objectToArray = (object) => {

    let result = []
    Object.keys(object).map((key) => {
      result.push(object[key])
    })

    return result
  }

  render() {
    const { globalNotification, nightModeNotification, clubNotificationList } = this.props
    return (
      <View style={styles.container}>
        
          <StatusBar
          backgroundColor='#f6b456'
          barStyle="light-content"
        
        />
        <View>
          <View style={styles.headView}>
            <TouchableOpacity>
              <Image source={require('../../images/left.png')}
                style={styles.leftIcon} />
            </TouchableOpacity>
            <Text style={styles.headText}>通知設定</Text>
            <View style={styles.empty}></View>
          </View>

          <ListItem
            title='提醒'
            switch={{ value: globalNotification, onValueChange: () => this.setGlobal(!globalNotification) }}
          />
          <ListItem
            title='夜間模式'
            switch={{ value: nightModeNotification, onValueChange: () => this.setNight(!nightModeNotification) }}
          />
          {Object.keys(clubNotificationList).map((key) => {
            const item = clubNotificationList[key]
            return (
              <ListItem
                title={item.schoolName + '  ' + item.clubName}
                key={key}
                switch={{ value: item.on, onValueChange: () => this.setClub(key, !item.on), disabled: globalNotification }}
              />
            )
          })}
        </View>
      </View>
    )
  }
}

export default Notification




