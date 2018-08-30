import React from 'react'
import { View, Alert } from 'react-native'
import { ListItem } from 'react-native-elements'

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

    } catch(e) {
      Alert.alert(e.toString())
    }
  }

  setNight = async (on) => {

    try {
      await this.props.setNightModeNotification(on)

    } catch(e) {
      Alert.alert(e.toString())
    }
  }

  setClub = async (key, on) => {

    try {
      let clubSetting = {...this.props.clubNotificationList[key]}
      clubSetting.on = on
      await this.props.setClubNotification(key, clubSetting)
      console.log(clubSetting)

    } catch(e) {
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
      <View>
        <ListItem
          title='提醒'
          switch={{value: globalNotification, onValueChange: () => this.setGlobal(!globalNotification) }}
        />
        <ListItem
          title='夜間模式'
          switch={{value: nightModeNotification, onValueChange: () => this.setNight(!nightModeNotification) }}          
        />
        {Object.keys(clubNotificationList).map((key) => {
          const item = clubNotificationList[key]
          return (
            <ListItem
              title={ item.schoolName + '  ' + item.clubName }
              key={key}
              switch={{value: item.on, onValueChange: () => this.setClub(key, !item.on), disabled: globalNotification}}
            />
          )
        })}
      </View>
    )
  }
}

export default Notification