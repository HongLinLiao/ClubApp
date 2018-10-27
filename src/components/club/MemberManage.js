import React from 'react'
import { View, Alert } from 'react-native'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel}  from 'react-native-simple-radio-button'
import Overlayer from '../common/Overlayer'
import { changeStatus } from '../../modules/Club'
import { convertClubStatus } from '../../modules/Common'

class MemberManage extends React.Component {
    state = {
        uid: null,
        member: null,
        loading: false,
        currentCid: null,
        radio_props: [
            {label: '社長', value: 'master'},
            {label: '幹部', value: 'supervisor'},
            {label: '社員', value: 'member'}
        ]
    }
    componentWillMount() {
        this.setState({ loading: true })
        const { joinClubs, currentCid, navigation } = this.props
        const { uid } = navigation.state.params
        const { status } = joinClubs[currentCid].member[uid]
        this.setState({ loading: false, uid, currentCid, member: {status} })
    }

    componentWillReceiveProps(nextProps) {
        try {
            this.setState({ loading: true })
            const { currentCid, joinClubs, navigation } = nextProps
            const { uid } = this.state
            const { status } = joinClubs[currentCid].member[uid]
            if(this.state.currentCid == currentCid) { //不是被踢出社團
                if(status != 'master') { //有人被升為社長
                    this.setState({ loading: false, member: {status} })
                } else {
                    navigation.pop()
                }
            } else {
                navigation.popToTop()
            } 
        } catch(e) {
            Alert.alert(e.toString())
        }
    }

    checkToChange = async (status) => {
        if(status != this.state.member.status) {
            const { userData } = this.props.navigation.state.params
            const { nickName } = userData
            const _status = convertClubStatus(status)
            let title = '更改成員職位'
            let message = `確定要將 ${nickName} 的職位變更為[${_status}]?`
            if(status == 'master') {
                title = '社長交接'
                message = `確定要將社長交給 ${nickName}\n(你將回歸成社員)`
            }
            Alert.alert( title, message,
                [
                    { text: '取消', onPress: () => console.log('取消'), style: 'cancel' },
                    { text: '確定變更', onPress: () => this.changeStatus(status) },
                ],
                { cancelable: false }
            )
        }
    }

    changeStatus = async (status) => {
        try {
            const { currentCid, navigation } = this.props
            const { uid } = navigation.state.params
            await changeStatus(uid, currentCid, status)

            Alert.alert('已更改')

        } catch(e) {
            Alert.alert(e.toString())
        }
    }

    render() {
        const { status } = this.state.member
        let _status = 0
        if(status == 'master') _status = 0
        else if(status == 'supervisor') _status = 1
        else if(status == 'member') _status = 2

        return (
            <View style={{flex: 1}}>
                <RadioForm
                    buttonColor={'#f6b456'}
                    labelColor={'#0d4273'}
                    selectedButtonColor={'#f6b456'}
                    style={{ marginLeft: 20, marginTop: 20, }}
                >
                    {this.state.radio_props.map((obj, index) => (
                        <RadioButton key={index}>
                            <RadioButtonInput
                                obj={obj}
                                index={index}
                                isSelected={index == _status}
                                onPress={(status) => this.checkToChange(status)}
                                buttonInnerColor={'#f6b456'}
                                buttonOuterColor={'#f6b456'}
                                buttonWrapStyle={{ marginBottom: 5,}}
                            />
                            <RadioButtonLabel
                                obj={obj}
                                index={index}
                                labelStyle={{color: '#0d4273'}}
                                labelWrapStyle={{ marginLeft: 5}}
                                onPress={(status) => this.checkToChange(status)}
                            />
                        </RadioButton>
                    ))}
                </RadioForm>
                {this.state.loading ? <Overlayer /> : null}
            </View>
        )
        
    }
}

export default MemberManage