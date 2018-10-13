import React from 'react';
import {
	View,
	Text,
	ScrollView,
	Image,
	TextInput,
	Button,
	TouchableOpacity,
	Alert,
	KeyboardAvoidingView,
	Keyboard,
	StyleSheet,
} from 'react-native';

import { takePhoto, selectPhoto } from '../../modules/Common'
import StatusBarPaddingIOS from 'react-native-ios-status-bar-padding';
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
			<KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' >
			<View style={styles.container}>
				<StatusBarPaddingIOS style={{ backgroundColor: '#f6b456' }} />
				<View style={styles.headView}>
					<View>
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate('Club')}>
							<Image source={require('../../images/arrowLeft.png')}
								style={styles.arrow} />
						</TouchableOpacity>


						<Text style={styles.headText}>發文</Text>
						<View style={styles.fake}></View>
						<TouchableOpacity>
							onPress={() => this.props.navigation.navigate('Club')}>
							<Image source={require('../../images/send.png')}
								style={styles.rightIcon} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
				{
					// <View style={{ flex: 1 }}>
					// <View style={{ flex: 1 }}>
					// 	<View style={{ flexDirection: 'row', width: 100 }}>
					// 		<Image source={{ uri: user.photoURL }} style={{ height: 100, width: 100 }} />
					// 		<View style={{ height: 100 }}>

					// 			<Text>{schoolName}</Text>
					// 			<Text>{clubName}</Text>
					// 			<Text>{user.displayName}</Text>
					// 			<Text>{status}</Text>
					// 			<Text>{new Date().toLocaleString()}</Text>
					// 		</View>
					// 	</View>
				}
				<ScrollView style={{ width: '100%' }}>
					<View style={styles.rowLeft}>
						<Image source={{ uri: user.photoURL }} style={{ height: 100, width: 100 }} />
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



				<View>
					<ScrollView horizontal>
						<View style={{ flexDirection: 'row' }}>
							{
								this.state.images.map((uri, index) => (
									<TouchableOpacity key={index} onPress={() => this.askDelete(index)} style={{ height: 100, width: 100, marginRight: 0 }}>
										<Image source={{ uri }} style={{ height: 100, width: 100 }} />
									</TouchableOpacity>
								))
							}
						</View>
					</ScrollView>
				</View>


				<View style={{
					flexDirection: 'row',
					backgroundColor: 'white',
					height: 50,
					width: '100%',
					position: 'absolute',
					bottom: 0,
					justifyContent: 'space-between'
				}}
				>
					<Button title='拍攝照片' onPress={() => this.handleTakePhoto()} />
					<Button title='從圖庫取得照片' onPress={() => this.handleSelectPhoto()} />
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

				
				</KeyboardAvoidingView>
			)
		
	}
}


export default AddPost


	// <TextInput
	// 	placeholder='內容......'
	// 	multiline={true}
	// 	style={{
	// 		width: '100%',
	// 		flex: 1,
	// 		backgroundColor: '#ffe6b5'
	// 	}}
	// 	onChangeText={(content) => this.setState({ content })}
	// 	onFocus={() => this.setState({ texting: true })}
