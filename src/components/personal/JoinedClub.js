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
import styles from '../../styles/personal/JoinedClub';

class JoinedClub extends React.Component {
    state = {
    }
    componentDidMount() {
        // console.log(this.props.navigation)
    }
    quit = (cid) => {
        Alert.alert('退出社團', '確定要退出社團(一旦退出社團相關資料將被刪除))',
            [
                { text: '再思考一下', onPress: () => console.log('再思考一下'), style: 'cancel' },
                { text: '退出', onPress: () => this.handleQuit(cid) },
            ],
            { cancelable: false }
        )
    }
    handleQuit = async (cid) => {

        try {
            this.props.quitTheClub(cid)

            Alert.alert('成功退出社團')

        } catch (e) {
            console.log(e)
            Alert.alert(e.toString())
        }
    }

    render() {
        const { joinClub, clubs } = this.props
        return (
            <View style={styles.container}>
                <StatusBarPaddingIOS style={{ backgroundColor: '#f6b456' }} />
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />
                <ScrollView>
                    {Object.keys(joinClub).map((cid, index) => {
                        const { clubName, schoolName } = clubs[cid]
                        return (
                            <View style={styles.listView}>
                                <View style={styles.textArea}>
                                    <Text style={styles.school}>{schoolName}</Text>
                                    <Text style={styles.club}>{clubName}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => this.quit(cid)}>
                                        <Image source={require('../../images/cancel.png')}
                                            style={styles.cancelIcon} />
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
export default JoinedClub