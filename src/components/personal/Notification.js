import React from 'react'
import { ListItem, Button } from 'react-native-elements'
import {
  Text,
  View,
  ScrollView,
  Image,
  Alert,
  TextInput
} from 'react-native';
import styles from '../../styles/personal/Notification'

class Notification extends React.Component {
  state = {
    loading: false,
    globalChecked: true,
    nightModeChecked: false,
    clubList: {},
    nightModeEdit: false,
    nightStart: '',
    nightEnd: '',
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

  setNightTime = async () => {
    if (this.state.nightModeEdit) {
      if (this.state.nightStart == '' || this.state.nightEnd == '') {
        Alert.alert('請輸入時間區間！');
      }
      else if (this.state.nightStart.indexOf(".") > -1 || this.state.nightEnd.indexOf(".") > -1) {
        Alert.alert('請輸入整數！');
      }
      else if (
        parseInt(this.state.nightStart) > 24 ||
        parseInt(this.state.nightStart) < 0 ||
        parseInt(this.state.nightEnd) > 24 ||
        parseInt(this.state.nightEnd) < 0
      ) {
        Alert.alert('請輸入正確時間區間！');
      }
      else if (this.state.nightStart == this.state.nightEnd) {
        Alert.alert('請勿輸入相同起末點！');
      }
      else {
        await this.props.setNightModeTime(parseInt(this.state.nightStart), parseInt(this.state.nightEnd));
        this.setState(this.setState({ nightModeEdit: false, nightStart: '', nightEnd: '' }));
      }
    }
    else {
      this.setState({ nightModeEdit: true });
      this.textInputStart.setNativeProps({ text: ' ' });
      setTimeout(() => {
        this.textInputStart.setNativeProps({ text: '' });
      });
      this.textInputEnd.setNativeProps({ text: ' ' });
      setTimeout(() => {
        this.textInputEnd.setNativeProps({ text: '' });
      });
      this.setState({ nightModeEdit: true });
    }
  }

  render() {
    const {
      globalNotification,
      nightModeNotification,
      clubNotificationList,
      joinClubs,
      likeClubs,
      nightModeStart,
      nightModeEnd
    } = this.props;
    const clubs = { ...joinClubs, ...likeClubs };

    return (
      <ScrollView>
        <View style={styles.container}>
          <ListItem
            title='提醒'
            titleStyle={{ fontSize: 18, color: '#666666', fontWeight: 'bold' }}
            switch={{
              value: globalNotification,
              onValueChange: () => this.setGlobal(!globalNotification),
              style: { transform: [{ scaleX: 1 }, { scaleY: 1 }] },
              onTintColor: 'rgba(246,180,86,1)',
              tintColor: 'rgba(246,180,86,0.1)',
              thumbTintColor: 'white'
            }}
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
            switch={{
              value: nightModeNotification,
              onValueChange: () => {
                if (this.state.nightModeEdit) {
                  Alert.alert('請先儲存下方時間區間！');
                }
                else {
                  this.setNight(!nightModeNotification)
                }
              },
              style: { transform: [{ scaleX: 1 }, { scaleY: 1 }] },
              onTintColor: 'rgba(246,180,86,1)',
              tintColor: 'rgba(246,180,86,0.1)',
              thumbTintColor: 'white'
            }}
            leftIcon={
              <View style={styles.leftIcon}>
                <Image source={require('../../images/moon.png')} style={styles.alarm} />
              </View>}
          />
          {
            <ListItem
              title='時間區間 (24H)'
              containerStyle={{ display: nightModeNotification ? 'flex' : 'none' }}
              titleStyle={{ fontSize: 18, color: '#666666', }}
              rightTitle={
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={{
                      fontSize: 15, color: this.state.nightModeEdit ? '#444444' : '#AAAAAA', width: 25,
                      backgroundColor: this.state.nightModeEdit ? '#FFA488' : '#FFFFFF'
                    }}
                    keyboardType='numeric'
                    editable={this.state.nightModeEdit}
                    defaultValue={nightModeStart.toString()}
                    ref={(textInputStart) => this.textInputStart = textInputStart}
                    onChangeText={(content) => { this.setState({ nightStart: content }); }}
                  />
                  <TextInput
                    style={{ fontSize: 15, color: this.state.nightModeEdit ? '#444444' : '#AAAAAA' }}
                    value={'－'}
                    editable={false}
                  />
                  <TextInput
                    style={{
                      fontSize: 15, color: this.state.nightModeEdit ? '#444444' : '#AAAAAA', width: 25, marginRight: 5,
                      backgroundColor: this.state.nightModeEdit ? '#FFA488' : '#FFFFFF'
                    }}
                    keyboardType='numeric'
                    editable={this.state.nightModeEdit}
                    defaultValue={nightModeEnd.toString()}
                    ref={(textInputEnd) => this.textInputEnd = textInputEnd}
                    onChangeText={(content) => { this.setState({ nightEnd: content }); }}
                  />
                  <Button
                    buttonStyle={{ backgroundColor: this.state.nightModeEdit ? '#0066FF' : 'rgba(246,180,86,1)', borderWidth: 0, borderRadius: 10, }}
                    title={this.state.nightModeEdit ? '儲存' : '編輯'}
                    titleStyle={{ fontSize: 15, }}
                    onPress={() => { this.setNightTime(); }}
                  />
                </View>
              }
              leftIcon={
                <View style={styles.leftIcon}>
                  <Image source={require('../../images/moon.png')} style={styles.alarm} />
                </View>}
            />
          }
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
                    switch={{
                      value: item.on,
                      onValueChange: () => this.setClub(cid, !item.on),
                      disabled: !globalNotification,
                      style: { transform: [{ scaleX: 1 }, { scaleY: 1 }] },
                      onTintColor: 'rgba(246,180,86,1)',
                      tintColor: 'rgba(246,180,86,0.1)',
                      thumbTintColor: 'white'
                    }}
                  />
                  <View style={styles.boxView} />
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    );
  }
}

export default Notification