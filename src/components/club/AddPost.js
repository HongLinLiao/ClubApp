import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
    Keyboard,
    Alert
} from 'react-native';
import { takePhoto, selectPhoto } from '../../modules/Common'
import Overlayer from '../common/Overlayer'
import styles from '../../styles/club/AddPost'

class AddPost extends React.Component {

    state = {
        title: '',
        content: '',
        images: [],
        loading: false,
        texting: false,
    }

    componentWillMount() {
        this.props.navigation.setParams({
            askCreate: this.askCreate.bind(this)
        })
    }

    checkAllDone = () => {
        const { title, content } = this.state

        if (title == '') {
            Alert.alert('請輸入標題')
            return false
        }
        if (content == '') {
            Alert.alert('請輸入內容')
            return false
        }

        return true
    }

    askCreate = () => {

        const { joinClubs, currentCid } = this.props
        const { schoolName, clubName } = joinClubs[currentCid]
        Alert.alert('新增貼文', '您將新增 ' + this.state.title + ' 於 ' + schoolName + ' ' + clubName,
            [
                { text: '取消', onPress: () => console.log('取消'), style: 'cancel' },
                { text: '新增', onPress: () => this.createPost() },
            ],
            { cancelable: false }
        )
    }

    createPost = async () => {
        try {
            this.setState({ loading: true })
            const { createPost, currentCid } = this.props
            const { title, content, images } = this.state
            const postData = { title, content, images }
            await createPost(currentCid, postData)
            Alert.alert('貼文發佈成功！')
            this.props.navigation.popToTop()
        } catch (e) {
            Alert.alert(e.toString())
        }
    }


    handleTakePhoto = async () => {
        try {
            const url = await takePhoto()
            if (url) {
                const imagesList = [...this.state.images]
                imagesList.push(url)
                this.setState({
                    images: imagesList
                })
            } else {
                Alert.alert('取消')
            }
        } catch (e) {
            console.log(e)
            Alert.alert('發生錯誤')
        }
    }

    handleSelectPhoto = async () => {
        try {
            const url = await selectPhoto()
            if (url) {
                const imagesList = [...this.state.images]
                imagesList.push(url)
                this.setState({
                    images: imagesList
                })
            } else {
                Alert.alert('取消')
            }
        } catch (e) {
            console.log(e)
            Alert.alert('發生錯誤')
        }
    }

    askDelete = (index) => {
        Alert.alert('刪除照片', '',
            [
                { text: '取消', onPress: () => { }, style: 'cancel' },
                { text: '確定刪除', onPress: () => this.handleDeletePhoto(index) },
            ],
            { cancelable: false }
        )
    }

    handleDeletePhoto = (index) => {
        const imagesList = [...this.state.images]
        imagesList.splice(index, 1)
        this.setState({
            images: imagesList
        })
    }

    render() {
        const { user, joinClubs, currentCid } = this.props
        const { schoolName, clubName, member } = joinClubs[currentCid]
        const status = member[user.uid].status
        return (
            <View style={styles.container}>
                <ScrollView style={{ width: '100%' }}>
                    <View style={styles.rowLeft}>
                        <Image style={styles.bigHead}
                            source={{ uri: user.photoURL }} />
                        <View style={styles.column}>
                            <View style={styles.row}>
                                <Text style={styles.school}>{schoolName}</Text>
                                <Text style={styles.club}>{clubName}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.name}>{user.displayName}</Text>
                                <Text style={styles.job}>{status}</Text>
                            </View>
                        </View>
                    </View>
                    <TextInput
                        style={styles.bigTextInput}
                        placeholder='標題'
                        placeholderTextColor='rgba(102,102,102,1)'
                        underlineColorAndroid={'transparent'}
                        multiline={true}
                        onChangeText={(title) => this.setState({ title })}
                        onFocus={() => this.setState({ texting: true })}
                    />
                    <Text style={styles.date}>{new Date().toLocaleString()}</Text>
                    <TextInput
                        style={styles.littleTextInput}
                        placeholder='內容......'
                        placeholderTextColor='rgba(102,102,102,0.7)'
                        underlineColorAndroid={'transparent'}
                        multiline={true}
                        onChangeText={(content) => this.setState({ content })}
                        onFocus={() => this.setState({ texting: true })}
                    />
                </ScrollView>
                <ScrollView horizontal>
							<View style={{ flexDirection: 'row' }}>
								{
									this.state.images.map((uri, index) => (
										<TouchableOpacity key={index} 
										onPress={() => this.askDelete(index)} style={{ height: 100, width: 100, marginRight: 0 }}>
											<Image source={{ uri }} style={{ height: 100, width: 100 }} />
										</TouchableOpacity>
									))
								}
							</View>
				</ScrollView>
                <View style={styles.tabBar}>
                    <TouchableOpacity onPress={() => this.handleTakePhoto()}>
                        <Image style={styles.barIcon}
                            source={require('../../images/graycamera.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleSelectPhoto()}>
                        <Image style={styles.barIcon}
                            source={require('../../images/grayphoto.png')} />
                    </TouchableOpacity>
                </View>
                
					{
						this.state.texting ?
							<TouchableOpacity style={[StyleSheet.absoluteFill]}
								onPress={() => {
									Keyboard.dismiss()
									this.setState({ texting: false })
								}}
							>
							</TouchableOpacity> : null
					}

					{this.state.loading ? <Overlayer /> : null}
                <KeyboardAvoidingView behavior='padding'></KeyboardAvoidingView>
            </View>
        );
    }
}
export default AddPost