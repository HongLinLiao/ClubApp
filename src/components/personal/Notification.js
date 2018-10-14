//import React from 'react'
import { ListItem } from 'react-native-elements'
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Image, FlatList, Switch, Alert } from 'react-native';
import { Constants } from 'expo';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import styles from '../../styles/personal/Notification'

class Notification extends React.Component {
  state = {
    loading: false,
    globalChecked: true,
    nightModeChecked: false,
    clubList: {}
  };

  setGlobal = async on => {
    try {
      await this.props.setGlobalNotification(on)

    } catch (e) {
      Alert.alert(e.toString())
    }
  };

  setNight = async on => {
    try {
      await this.props.setNightModeNotification(on)

    } catch (e) {
      Alert.alert(e.toString())
    }
  };

  setClub = async (cid, on) => {
    try {
      let clubSetting = { ...this.props.clubNotificationList[cid] }
      clubSetting.on = on
      await this.props.setClubNotification(cid, clubSetting)

    } catch (e) {
      Alert.alert(e.toString())
    }
  };

  render() {
    const {
      globalNotification,
      nightModeNotification,
      clubNotificationList,
      joinClubs,
      likeClubs
    } = this.props;
    const clubs = { ...joinClubs, ...likeClubs };

    return (
      <View style={styles.container}>
        <ListItem
          title='提醒'
          titleStyle={{ fontSize: 18, color: '#666666' }}
          switch={{ value: globalNotification, onValueChange: () => this.setGlobal(!globalNotification) }}
          leftElement={
            <View style={styles.leftIcon}>
              <Image source={require('../../images/alarm.png')} style={styles.alarm} />
            </View>
          }
        />
        <View style={styles.boxView} />
        <ListItem
          title='夜間模式'
          titleStyle={{ fontSize: 18, color: '#666666', }}
          switch={{ value: nightModeNotification, onValueChange: () => this.setNight(!nightModeNotification) }}
          leftIcon={
            <View style={styles.leftIcon}>
              <Image source={require('../../images/moon.png')} style={styles.alarm} />
            </View>}
        />

        <View style={styles.boxBottomBorderView} />

        {
          Object.keys(clubNotificationList).map((cid) => {
            const item = clubNotificationList[cid]
            return (
                <View key={cid}>
                  <ListItem
                    title={
                      <View style={styles.textArea}>

                        <View style={styles.empty}></View>
                        <Text style={styles.school}>{clubs[cid].schoolName}</Text>
                        <Text style={styles.club}>{clubs[cid].clubName}</Text>
                      </View>
                    }

                    key={cid}
                    switch={{ value: item.on, onValueChange: () => this.setClub(cid, !item.on), disabled: globalNotification }}
                  />

                  <View style={styles.boxView} />
                </View>
                

                
            )
          })
        }
      </View>
    );
  }
}

export default Notification
