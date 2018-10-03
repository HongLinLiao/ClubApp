import React from 'react'
import {
    Text,
    View,
    StatusBar,
    ScrollView,
    Image,
    Switch,
    Alert
} from 'react-native';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import styles from '../../styles/personal/Notification';

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
            let clubSetting = { ...this.props.clubNotificationList[cid] }
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
                <StatusBarPaddingIOS style={{ backgroundColor: '#f6b456' }} />
                <StatusBar
                    backgroundColor='#f6b456'
                    barStyle="light-content"
                />
                <ScrollView>
                    <View style={styles.listView}>
                        <View style={styles.textArea}>
                            <Image style={styles.alarm}
                                source={require('../../images/alarm.png')} />
                            <Text style={styles.alarmText}>提醒</Text>
                        </View>
                        <View>
                            <Switch
                                style={[styles.switchSize, { transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }]}
                                value={globalNotification}
                                onValueChange={() => this.setGlobal(!globalNotification)}
                                onTintColor='rgba(246,180,86,1)'
                                tintColor='rgba(246,180,86,0.1)'
                                thumbTintColor='white'
                            />
                        </View>
                    </View>
                    <View style={styles.moonView}>
                        <View style={styles.textArea}>
                            <Image style={styles.alarm}
                                source={require('../../images/moon.png')} />
                            <Text style={styles.moonText} >夜間模式</Text>
                        </View>
                        <View>
                            <Switch
                                style={[styles.switchSize, { transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }]}
                                value={nightModeNotification}
                                onValueChange={() => this.setNight(!nightModeNotification)}
                                onTintColor='rgba(246,180,86,1)'
                                tintColor='rgba(246,180,86,0.1)'
                                thumbTintColor='white'
                            />
                        </View>
                    </View>
                    {
                    Object.keys(clubNotificationList).map((cid) => {
                        const item = clubNotificationList[cid]
                        return (
                            <View key={cid} style={styles.listView}>
                                <View style={styles.textArea}>
                                    <View style={styles.empty}></View>
                                    <Text style={styles.school}>{clubs[cid].schoolName}</Text>
                                    <Text style={styles.club}>{clubs[cid].clubName}</Text>
                                </View>
                                <View>
                                    <Switch
                                        style={[styles.switchSize, { transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }]}
                                        value={item.on}
                                        onTintColor='rgba(246,180,86,1)'
                                        tintColor='rgba(246,180,86,0.1)'
                                        thumbTintColor='white'
                                        onValueChange={() => this.setClub(cid, !item.on)}
                                        disabled={!globalNotification}
                                    />
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
}
export default Notification