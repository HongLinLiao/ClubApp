//import React from 'react'
import { ListItem } from 'react-native-elements'
import React, { Component } from 'react';
import {Text,View,StyleSheet,TouchableOpacity,StatusBar,ScrollView,Image,FlatList,Switch,Alert} from 'react-native';
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

  setClub = async (cid, on) => {

    try {
      let clubSetting = {...this.props.clubNotificationList[cid]}
      clubSetting.on = on
      await this.props.setClubNotification(cid, clubSetting)

    } catch(e) {
      Alert.alert(e.toString())
    }

  }

  render() {
    const { globalNotification, nightModeNotification, clubNotificationList, clubs } = this.props

    return (
      <View style={styles.container}>
      {
        <View style={styles.headView}>
        <View>
          <TouchableOpacity>
            <Image source={require('../../images/arrowLeft.png')}
              style={styles.arrow} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headText}>通知設定</Text>
        <View style={styles.fake}></View>
        </View>
      }
        
            {
              // </View>
              //   <StatusBar
              //       backgroundColor='#f6b456'
              //       barStyle="light-content"
              //   />
              //   <View style={styles.headView}>
              //       <TouchableOpacity>
              //           <Image source={require('../../images/left.png')}
              //               style={styles.leftIcon} />
              //       </TouchableOpacity>
              //       <Text style={styles.headText}>通知設定</Text>
              //       <View style={styles.empty}></View>
              //   </View>
            }
        <ListItem
        
          title='提醒'
          titleStyle={{fontSize:18,color:'#666666', }}
          switch={{value: globalNotification, onValueChange: () => this.setGlobal(!globalNotification) }}
          subtitle={
            <View style={styles.subtitleView}>
              <Image source={require('../../images/alarm.png')} style={styles.alarm}/>
            </View>}
        />
        <ListItem
          title='夜間模式'
          titleStyle={{fontSize:18,color:'#666666', }}
          switch={{value: nightModeNotification, onValueChange: () => this.setNight(!nightModeNotification) }}    
          subtitle={
            <View style={styles.subtitleView}>
              <Image source={require('../../images/moon.png')} style={styles.alarm}/>
            </View>}      
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
