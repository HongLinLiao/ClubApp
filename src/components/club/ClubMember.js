import React from 'react'
import {
    View,
    Button,
    Alert,
    Image,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native'

import {
    ListItem,
} from 'react-native-elements'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';

import { getUserData, getClubData } from '../../modules/Data'
import { getClubMemberData } from '../../modules/Club'
import Overlayer from '../common/Overlayer'
import UserDialog from '../common/UserDialog'

import styles from '../../styles/club/ClubMember'
const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class ClubMember extends React.Component {
    state = {
        currentCid: null,
        joinClubs: null,
        memberData: null,
        loading: false,
        userData: { uid: null, user: null, clubs: null },
    }

    async componentWillMount() {
        await this.getAllUserData()
    }

    async componentWillReceiveProps(nextProps) {
        try {
            this.setState({ loading: true })
            const { currentCid, joinClubs } = nextProps
            const memberData = await getClubMemberData(joinClubs[currentCid].member)
            this.setState({ memberData, currentCid, joinClubs, loading: false })

        } catch (e) {
            Alert.alert(e.toString())
        }
    }

    askToKick = (uid, nickName) => {
        const { joinClubs, currentCid } = this.props
        
        Alert.alert('踢出社員', '確定要踢除' + nickName,
            [
                { text: '取消', onPress: () => console.log('取消'), style: 'cancel' },
                { text: '踢除', onPress: () => this.handleKickMember(uid, nickName) },
            ],
            { cancelable: false }
        )
    }

    handleKickMember = async (uid, nickName) => {
        const { currentCid, kickClubMember, joinClubs } = this.props
        try {

            await kickClubMember(currentCid, uid)

            Alert.alert('已踢出' + nickName)


        } catch (e) {
            Alert.alert(e.toString())
        }
    }

    getAllUserData = async () => {
        try {
            this.setState({ loading: true })
            const { currentCid, joinClubs } = this.props
            const memberData = await getClubMemberData(joinClubs[currentCid].member)
            this.setState({ memberData, currentCid, joinClubs, loading: false })

        } catch (e) {
            Alert.alert(e.toString())
        }
    }

    showUser = async (uid) => {
        try {
            this.popupDialog.show(async () => {
                this.setState({ loading: true, userData: { uid: null, user: null, clubs: null } })
                const userData = { uid, user: {}, clubs: {} }
                const user = await getUserData(uid)

                if (user.joinClub) {
                    const promises = Object.keys(user.joinClub).map(async (cid) => {
                        const club = await getClubData(cid)
                        userData.clubs[cid] = club
                    })

                    await Promise.all(promises)
                }

                userData.user = user

                console.log(userData)

                this.setState({ userData, loading: false })
            });
        } catch (e) {
            Alert.alert(e.toString())
        }

    }




    render() {
        const { currentCid, joinClubs } = this.state
        const memberData = this.state.memberData || {}
        const member = joinClubs ? joinClubs[currentCid].member : {}
        const { uid, user, clubs } = this.state.userData
        return (
            <ScrollView style={{ flex: 1 }}>
                {
                    Object.keys(memberData).map((_uid, index) => {
                        const { photoUrl, nickName, } = memberData[_uid]
                        return (
                            <TouchableOpacity key={_uid} onPress={() => this.showUser(_uid)}>

                                <ListItem
                                    key={_uid}
                                    leftAvatar={{
                                        source: { uri: photoUrl ? photoUrl : 'https://image.freepik.com/free-icon/man-dark-avatar_318-9118.jpg' },
                                        size: 'medium',
                                    }}

                                    title={

                                        <Text style={styles.bigText}>{nickName}</Text>
                                    }
                                    subtitle={

                                        <Text style={styles.smallText}>{member[_uid].status}</Text>
                                    }


                                    rightElement={
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => this.askToKick(_uid, nickName)}
                                            disabled={(member[_uid].status == 'master')}
                                        >
                                            <Text style={[styles.buttonText]}>確定退出</Text>
                                        </TouchableOpacity>
                                    }

                                />
                            </TouchableOpacity>

                        )
                    })
                }
                <PopupDialog
                    ref={(popupDialog) => this.popupDialog = popupDialog}
                    dialogAnimation={slideAnimation}
                    width={0.7}
                    height={0.7}
                    dialogStyle={{ borderRadius: 20 }}
                >
                    <UserDialog
                        uid={uid}
                        user={user}
                        clubs={clubs}
                        loading={this.state.loading}
                    />
                </PopupDialog>
                {this.state.loading ? <Overlayer /> : null}
            </ScrollView>
        )
    }
}

export default ClubMember