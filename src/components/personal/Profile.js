import React from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StatusBar
} from 'react-native';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
import styles from '../../styles/personal/Profile';
class Profile extends React.Component {

    componentWillMount() {

    }

    render() {
        const { user, signOut } = this.props
        return (
            <View style={styles.container}>
                <StatusBarPaddingIOS style={{ backgroundColor: '#f6b456' }} />
                <StatusBar hidden={false} height={50}
                    backgroundColor={'#f6b456'} />

                <View style={styles.one}>
                    {user.photoURL ?
                        <Image style={styles.person} source={{ uri: user.photoURL }} resizeMode='contain' /> :
                        <Image style={styles.person} source={require('../../images/man-user.png')} resizeMode='contain' />
                    }
                    <Text style={styles.name}>{user.displayName}</Text>
                    <View style={styles.row}>
                        <Image style={styles.hotPoint}
                            source={require('../../images/star.png')} />
                        <Text style={styles.number}>社團數量</Text>
                    </View>
                </View>

                <View style={styles.aboutMe}>
                    <Text style={styles.aboutMeText}>我很帥，我是一潔的唷</Text>
                </View>

                <View style={styles.three}>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.botton}
                            onPress={() => this.props.navigation.push('ProfileSetting')}>
                            <Image style={styles.bottonIcon}
                                source={require('../../images/edit.png')} />
                            <Text style={styles.bottonText}>編輯個人</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botton}
                            onPress={() => this.props.navigation.push('ClubManage')}>
                            <Image style={styles.bottonIcon}
                                source={require('../../images/heart.png')} />
                            <Text style={styles.bottonText}>社團管理</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.four}>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.botton}
                            onPress={() => this.props.navigation.push('Notification')}>
                            <Image style={styles.bottonIcon}
                                source={require('../../images/bell.png')} />
                            <Text style={styles.bottonText}>通知設定</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botton}
                            onPress={() => this.props.navigation.push('AdvancedSetting')}>
                            <Image style={styles.bottonIcon}
                                source={require('../../images/settings.png')} />
                            <Text style={styles.bottonText}>
                                進階管理</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.five}>
                    <TouchableOpacity style={styles.signOut}
                        onPress={() => signOut()}>
                        <Text style={styles.signOutText}>登出</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
export default Profile