import React from 'react'
import {
    View,
    Button,
    Alert,
} from 'react-native'

import {
    ListItem,
} from 'react-native-elements'

import { getClubMemberData } from '../../modules/Club'

class ClubMember extends React.Component {
    state = {
        memberData: null
    }

    askToKick = (uid) => {
        const { nickName } = this.props.navigation.state.params.memberData[uid]
        Alert.alert('踢出社員', '確定要踢除' + nickName, 
        [
            {text: '取消', onPress: () => console.log('取消'), style: 'cancel'},
            {text: '踢除', onPress: () => this.handleKickMember(uid)},
        ],
        { cancelable: false }
        )
    }

    handleKickMember = async (uid) => {
        const { currentCid, kickClubMember, navigation } = this.props
        const { memberData } = navigation.state.params
        try {
            delete memberData[uid]
            navigation.setParams({ memberData })

            await kickClubMember(currentCid, uid)
            
            Alert.alert('已踢出' + memberData[uid].nickName)


        } catch(e) {
            Alert.alert(e.toString())
        }
    }

    getAllUserData = async () => {
    }



    render() {
        const { user, clubs, currentCid, navigation } = this.props
        const { memberData } = navigation.state.params
        const { member } = clubs[currentCid]
        return (
            <View style={{flex: 1}}>
                {
                    Object.keys(memberData).map((uid, index) => {
                        const { photoUrl, nickName, } = memberData[uid]
                        return (
                            <ListItem
                                key={uid}
                                leftAvatar={{
                                    source: {uri: photoUrl},
                                    size: 'medium',
                                }}
                                title={nickName}
                                subtitle={member[uid].status}
                                rightElement={ <Button title='退出社團' onPress={() => this.askToKick(uid)} />}
                            />
                        )
                    })
                }
            </View>
        )
    }
}

export default ClubMember