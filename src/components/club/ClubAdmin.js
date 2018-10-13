import React from 'react'
import { 
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Button,
    Image,
    Text,
    Alert,
} from 'react-native'
import Expo from 'expo'
import Overlayer from '../common/Overlayer'


class ClubAdmin extends React.Component {

    state = {
        loading: false
    }


    askClubOpen = () => {
        const { currentCid, joinClubs } = this.props
        const { open, schoolName, clubName } = joinClubs[currentCid]
        Alert.alert('社團公開設定', schoolName + ' ' + clubName + ' 將被' + (open ? '關閉' : '公開'), 
        [
            {text: '取消', onPress: () => console.log('取消'), style: 'cancel'},
            {text: open ? '關閉社團' : '公開社團', onPress: () => this.handleClubOpen()},
        ],
        { cancelable: false }
        )
    }
    handleClubOpen = async () => {
        try {
            const { setClubOpen, currentCid, joinClubs } = this.props

            await setClubOpen(currentCid)

            Alert.alert('社團已' + (joinClubs[currentCid].open ? '關閉' : '公開'))

        } catch(e) {
            Alert.alert(e.toString())
        }
        
    }

    handleChangePhoto = async () => {
        try {
            this.setState({loading: true})
            const { changeClubPhoto, currentCid } = this.props
            await changeClubPhoto(currentCid)

            Alert.alert('照片新增成功')

            this.setState({loading: false})
        } catch(e) {
            Alert.alert(e.toString())
        }
    }

    render() {
        const { user, joinClubs, currentCid } = this.props
        const { imgUrl, schoolName, clubName, open, member, introduction} = joinClubs[currentCid]
        const numberOfMember = Object.keys(member).length
        const status = member[user.uid].status

        return (
            <KeyboardAvoidingView style={{flex : 1}} behavior='padding' >
                <View style={{flex: 1}}>
                    <ScrollView>
                        <TouchableOpacity 
                            style={{height: 400, alignItems: 'center', justifyContent: 'center',}}
                            onPress={ () => this.handleChangePhoto() }
                        >
                            <View style={{position: 'absolute', height: 400, width: '100%'}}>
                                { imgUrl ? <Image source={{uri: imgUrl}} resizeMode='cover' style={{height: 400}}/> : null}
                            </View>
                            <Text>{schoolName}</Text>
                            <Text>{clubName}</Text>
                            <Button title={open ? '公開' : '非公開'} onPress={this.askClubOpen}/>
                            <Text>{numberOfMember}</Text>
                            <Text>{numberOfMember != 0 ? status : '沒有成員'}</Text>					
                        </TouchableOpacity>

                        <View style={{height: 100, flexDirection: 'row'}}>
                            <Button title='發布文章' disabled />
                            <Button title='舉辦活動' disabled/>
                            <Button title='管理者模式' disabled/>
                            <Button title='編輯成員' disabled/>
                        </View>

                        <View style={{height: 200, borderWidth: 1, borderColor: 'red'}}>
                            <TextInput
                                multiline
                                value={introduction ? introduction : ''}
                            />
                        </View>

                        <View style={{alignItems: 'center', justifyContent: 'center',}}>
                            <Button title='文章管理' onPress={() => {}}/>
                            <Button title='活動管理' onPress={() => {}}/>
                        </View>
                        
                    </ScrollView>
                </View>
                {this.state.loading ? <Overlayer /> : null}
            </KeyboardAvoidingView>

        )
    }
}


export default ClubAdmin