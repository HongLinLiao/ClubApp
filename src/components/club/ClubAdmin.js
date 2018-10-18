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
    ImageBackground
} from 'react-native'
import styles from "../../styles/club/ClubAdmin";
import Overlayer from '../common/Overlayer'


class ClubAdmin extends React.Component {

    state = {
        introduction: '',
        loading: false,
    }

    componentWillMount() {
        const { user, joinClubs, currentCid } = this.props
        const { introduction } = joinClubs[currentCid]
        this.setState({ introduction })
    }

    askClubOpen = () => {
        const { currentCid, joinClubs } = this.props
        const { open, schoolName, clubName } = joinClubs[currentCid]
        Alert.alert('社團公開設定', schoolName + ' ' + clubName + ' 將被' + (open ? '關閉' : '公開'),
            [
                { text: '取消', onPress: () => console.log('取消'), style: 'cancel' },
                { text: open ? '關閉社團' : '公開社團', onPress: () => this.handleClubOpen() },
            ],
            { cancelable: false }
        )
    }

    handleClubOpen = async () => {
        try {
            this.setState({ loading: true })
            const { setClubOpen, currentCid, joinClubs } = this.props

            await setClubOpen(currentCid)

            Alert.alert('社團已' + (joinClubs[currentCid].open ? '關閉' : '公開'))
            this.setState({ loading: false })
        } catch (e) {
            Alert.alert(e.toString())
        }
    }

    handleChangePhoto = async () => {
        try {
            this.setState({ loading: true })
            const { changeClubPhoto, currentCid } = this.props
            await changeClubPhoto(currentCid)

            Alert.alert('照片新增成功')
            this.setState({ loading: false })
        } catch (e) {
            Alert.alert(e.toString())
        }
    }

    updateIntroduction = async () => {
        try {
            this.setState({ loading: true })
            const { currentCid, updateIntroduction } = this.props
            const { introduction } = this.state
            await updateIntroduction(currentCid, introduction)

            this.setState({ loading: false })
        } catch (e) {
            Alert.alert(e.toString())
        }
    }

    render() {
        const { user, joinClubs, currentCid } = this.props
        const { imgUrl, schoolName, clubName, open, member, introduction } = joinClubs[currentCid]
        const numberOfMember = Object.keys(member).length
        const status = member[user.uid].status
        return (
            <View style={styles.container}>
                <ScrollView>
                    <ImageBackground style={styles.clubBackground}
                        source={{ uri: imgUrl ? imgUrl : 'https://steamuserimages-a.akamaihd.net/ugc/87100177918375746/EDFEECCE614D4A17D884A5E5B7E9D5810C4C1312/' }} resizeMode='cover' style={{ height: 400 }}>

                        <TouchableOpacity style={styles.cameraView} onPress={() => this.handleChangePhoto()}>
                            <Image source={require('../../images/camera.png')}
                                style={styles.iconCamera} />
                            <Text style={styles.cameraText}>更換照片</Text>
                        </TouchableOpacity>

                        <View style={styles.clubInfoView}>
                            <View style={styles.clubTextView}>
                                <View style={styles.clubLeftTextView}>
                                    <View style={styles.flexDirectionRow}>
                                        <Text style={styles.schoolText}>{schoolName}</Text>
                                    </View>
                                    <View style={styles.flexDirectionRow}>
                                        <Text style={styles.clubTopNameText}>{clubName}</Text>
                                    </View>
                                </View>

                                <View style={styles.clubRightTextView}>
                                    <TouchableOpacity style={styles.flexDirectionRow} onPress={this.askClubOpen}>
                                        <Text style={styles.numberext}>{open ? '公開' : '非公開'}</Text>
                                        <Image source={require('../../images/exchange.png')}
                                            style={styles.iconPancil} />
                                    </TouchableOpacity>
                                    <Text style={styles.numberext}>{numberOfMember},{status}</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>

                    <View style={styles.adminButtonView}>
                        <View style={styles.adminButton}>
                            <Image source={require('../../images/contract-gray.png')}
                                style={styles.adminIcon} />
                            <Text style={styles.adminText}>發布文章</Text>
                        </View>
                        <View style={styles.adminButton}>
                            <Image source={require('../../images/idea-gray.png')}
                                style={styles.adminIcon} />
                            <Text style={styles.adminText}>舉辦活動</Text>
                        </View>
                        <View style={styles.adminButton}>
                            <Image source={require('../../images/manager-gray.png')}
                                style={styles.adminIcon} />
                            <Text style={styles.adminText}>切換管理者</Text>
                        </View>
                        <View style={styles.adminButton}>
                            <View style={styles.adminIcon} >
                                <Image source={require('../../images/changeMember-gray.png')}
                                    style={styles.adminIcon} />
                            </View>
                            <Text style={styles.adminText}>編輯成員</Text>
                        </View>
                    </View>
                    <View style={styles.titleTextView}>
                        <Text style={styles.titleText}>社團簡介</Text>
                    </View>
                    <View style={styles.clubSummaryView}>
                        <TextInput style={styles.clubSummaryText}
                            multiline={true}
                            placeholder='來點社團介紹吧~'
                            defaultValue={introduction ? introduction : ''}
                            onChangeText={(introduction) => this.setState({ introduction })}
                            onEndEditing={() => this.updateIntroduction()}
                            underlineColorAndroid='transparent'
                        />
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <Button title='文章管理' onPress={() => { }} />
                        <Button title='活動管理' onPress={() => { }} />
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.selectClub}>
                    <Text style={styles.selectClubText}>長庚大學 紫藤花親善社</Text>
                    <Image source={require('../../images/arrowDown.png')}
                        style={styles.icon} />
                </TouchableOpacity>
                <KeyboardAvoidingView behavior="padding">
                </KeyboardAvoidingView>
                {this.state.loading ? <Overlayer /> : null}
            </View>
        );
    }
}
export default ClubAdmin