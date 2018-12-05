import React from 'react'
import {
    View,
    Alert,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native'

import {
    ListItem,
} from 'react-native-elements'
import PopupDialog, { SlideAnimation} from 'react-native-popup-dialog';
import RadioForm from 'react-native-simple-radio-button'

import { getUserData, getClubData } from '../../modules/Data'
import { convertClubStatus } from '../../modules/Common'
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
        radio_props: null
    }

    async componentWillMount() {
        await this.getAllUserData()
    }

    async componentWillReceiveProps(nextProps) {
        try {
            this.setState({ loading: true })
            const { currentCid, joinClubs, navigation } = nextProps
            if(this.state.currentCid == currentCid) {
                const _memberData = await getClubMemberData(joinClubs[currentCid].member)
                console.log(_memberData)
                const memberData = this.sortMember(_memberData, joinClubs, currentCid)

                console.log(memberData)
                this.setState({ memberData, currentCid, joinClubs, loading: false })
            } else {
                this.popupDialog.dismiss()
                navigation.popToTop()
            } 
            
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
            const _memberData = await getClubMemberData(joinClubs[currentCid].member)
            const memberData = this.sortMember(_memberData, joinClubs, currentCid)
            this.setState({ memberData, currentCid, joinClubs, loading: false })

        } catch (e) {
            Alert.alert(e.toString())
        }
    }

    sortMember = (memberData, joinClubs, currentCid) => {
        const master = []
        const supervisor = []
        const _member = []
        const nothing = []
        const { member } = joinClubs[currentCid]
        Object.keys(memberData).map((uid) => {
            const { status } = member[uid]
            switch(status) {
                case 'master':
                    master.push({uid, ...memberData[uid]})
                    break;
                case 'supervisor':
                    supervisor.push({uid, ...memberData[uid]})
                    break;
                case 'member':
                    _member.push({uid, ...memberData[uid]})
                    break;
                default:
                    nothing.push({uid,...memberData[uid]})
            }
        })

        const memberArray = master.concat(supervisor, _member, nothing)
        return memberArray
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

    filterStatusPermission = (uid) => {
        const { user } = this.props
        const { joinClubs, currentCid } = this.state
        const status = joinClubs[currentCid].member[user.uid].status //目前使用者職位
        const _status = joinClubs[currentCid].member[uid].status //社團成員職位
        let canChangeStatus = false
        let canKickMember = false
        if(user.uid == uid) return {canChangeStatus, canKickMember} //自己
        else {
            if(status == 'master') { //是社長
                canChangeStatus = true
                canKickMember = true
            }
            else if(status == 'supervisor') { //是管理者
                if(_status == 'master' || _status == 'supervisor') { //管理者對於社長或是管理者
                    canChangeStatus = false
                    canKickMember = false
                } else { //管理者對於社員
                    canChangeStatus = false
                    canKickMember = true
                }
            }
            
        }

        return {canChangeStatus, canKickMember}

        
    }

    render() {
        const { currentCid, joinClubs } = this.state
        const memberData = this.state.memberData || []
        const member = joinClubs ? joinClubs[currentCid].member : {}
        const { uid, user, clubs } = this.state.userData

        console.log(memberData)
        
        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    {
                        memberData.map((_user, index) => {
                            const { photoUrl, nickName } = _user
                            console.log(member[_user.uid].status);
                            const status = member[_user.uid].status
                            console.log(status);
                            const _status = convertClubStatus(status) //職位轉成中文
                            console.log(_status);
                            const { canChangeStatus, canKickMember } = this.filterStatusPermission(_user.uid) //過濾每個人的權限
                            return (
                                <TouchableOpacity key={_user.uid} disabled={!canChangeStatus} onPress={() => this.props.navigation.push('MemberManage', {uid: _user.uid, userData: _user})}>

                                    <ListItem
                                        key={_user.uid}
                                        leftAvatar={{
                                            source: { uri: photoUrl },
                                            size: 'medium',
                                            onPress: () => this.showUser(_user.uid)
                                        }}

                                        title={
                                            <Text style={styles.bigText}>{nickName}</Text>
                                        }
                                        subtitle={
                                            <Text style={styles.smallText}>{_status}</Text>
                                        }
                                        rightElement={
                                            canKickMember ?
                                                <TouchableOpacity
                                                    style={styles.button}
                                                    onPress={() => this.askToKick(_user.uid, nickName)}
                                                >
                                                    <Text style={[styles.buttonText]}>確定退出</Text>
                                                </TouchableOpacity> : null
                                        }
                                        containerStyle={{ flex: 1, alignContent: 'center', justifyContent: 'center'}}
                                    />
                                </TouchableOpacity>

                            )
                        })
                    }
                </ScrollView>
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
            </View>
        )
    }
}

export default ClubMember