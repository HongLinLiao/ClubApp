import React from 'react'
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ImageBackground,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import { selectPhoto } from '../../modules/Common';
import Overlayer from '../common/Overlayer';
import styles from '../../styles/personal/ProfileSetting';
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';


class ProfileSetting extends React.Component {

    state = {
        nickName: this.props.user.displayName,
        photoURL: this.props.user.photoURL,
        aboutMe: this.props.aboutMe,
        loading: false,
        nameColor: 'rgba(102,102,102,0.5)',//預設姓名顏色
        aboutColor: 'rgba(102,102,102,0.5)', //預設介紹顏色
        nameEditable: false, //預設姓名更改是關閉的
        aboutEditable: false, //預設介紹更改是關閉的
    }
    changeAboutEditable = () => {
        this.setState({
            aboutEditable: !this.state.aboutEditable,
            aboutColor: this.state.aboutEditable ? 'rgba(102,102,102,0.5)' : 'rgba(102,102,102,1)'
        });
    }

    changeNameEditable = () => {
        this.setState({
            nameEditable: !this.state.nameEditable, //編輯開關
            nameColor: this.state.nameEditable ? 'rgba(102,102,102,0.5)' : 'rgba(102,102,102,1)'
        })
    }

    componentWillMount() {
    }

    handleSelectPhoto = async () => {
        const photoURL = await selectPhoto()
        if (photoURL) this.setState({ photoURL })
    }

    saveProfile = async () => {
        try {
            const { nickName, aboutMe, photoURL } = this.state
            if (nickName) {
                this.setState({ loading: true })
                await this.props.updateUserProfile({
                    nickName,
                    photoURL,
                    aboutMe
                })
                this.props.navigation.pop()
            }
            else {
                Alert.alert('請輸入暱稱！')
            }
        } catch (e) {
            this.setState({ loading: false })
            console.log(e)
        }
    }

    render() {
        const { user, aboutMe, joinClub } = this.props
        const { displayName, photoURL } = user
        return (
            <View style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.container}>

                        <View style={styles.one}>
                            {this.state.photoURL ?
                                <ImageBackground
                                    style={styles.person}
                                    imageStyle={styles.personImage}
                                    source={{ uri: this.state.photoURL }}
                                    resizeMode='cover'>
                                    <TouchableOpacity onPress={() => this.handleSelectPhoto()}>
                                        <Image source={require('../../images/camera.png')}
                                            style={styles.cameraIcon} />
                                    </TouchableOpacity>
                                </ImageBackground> :
                                <ImageBackground
                                    style={styles.person}
                                    imageStyle={styles.personImage}
                                    source={require('../../images/man-user.png')}
                                    resizeMode='contain'>
                                    <TouchableOpacity onPress={() => this.handleSelectPhoto()}>
                                        <Image source={require('../../images/camera.png')}
                                            style={styles.cameraIcon} />
                                    </TouchableOpacity>
                                </ImageBackground>
                            }
                        </View>

                        <View style={styles.two}>
                            <View style={styles.nameView}>
                                <View style={styles.empty}></View>
                                <TextInput style={[styles.nameInput, { color: this.state.nameColor }]}  //state變數代姓名顏色
                                    placeholder='請輸入名字'
                                    placeholderTextColor={this.state.nameColor}
                                    underlineColorAndroid='rgba(246,180,86,0)'
                                    multiline={true}
                                    editable={this.state.nameEditable}
                                    onChangeText={(nickName) => this.setState({ nickName })}
                                    defaultValue={displayName}
                                />
                                <TouchableOpacity onPress={() => { this.changeNameEditable() }}>
                                    <Image style={styles.hotPoint}
                                        source={require('../../images/pencil.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.row}>
                                <Image style={styles.hotPoint}
                                    source={require('../../images/newstar.png')} />
                                <Text style={styles.number}>{Object.keys(joinClub).length}</Text>
                            </View>
                        </View>

                        <View style={styles.aboutMeView}>
                            <View style={styles.empty}></View>
                            <TextInput style={[styles.aboutMeInput, { color: this.state.aboutColor }]}  //state變數代表自介顏色
                                placeholder='請輸入自我介紹'
                                multiline={true}
                                defaultValue={aboutMe || ''}
                                placeholderTextColor={this.state.aboutColor}
                                underlineColorAndroid='rgba(246,180,86,0)'
                                editable={this.state.aboutEditable}
                                onChangeText={(aboutMe) => this.setState({ aboutMe })}
                            />
                            <TouchableOpacity onPress={() => { this.changeAboutEditable() }}>
                                <Image style={styles.hotPoint}
                                    source={require('../../images/pencil.png')} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.four}>
                            <TouchableOpacity style={styles.save} onPress={() => this.saveProfile()}>
                                <Text style={styles.saveText}>儲存</Text>
                            </TouchableOpacity>
                        </View>

                        <KeyboardAvoidingView behavior='padding'></KeyboardAvoidingView>
                        {this.state.loading ? <Overlayer /> : null}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}


export default ProfileSetting
