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


import Overlayer from '../common/Overlayer'


class AddPost extends React.Component {

	state ={
		title: '',
		content: '',
		images: [],
		loading: false,
		texting: false,
	}

	componentDidMount() {
		this.props.navigation.setParams({
			askCreate: this.askCreate.bind(this)
		})
	}

	checkAllDone = () => {
		const { title, content } = this.state

		if(title == '') {
			Alert.alert('請輸入標題')
			return false
		}
		if(content == '') {
			Alert.alert('請輸入內容')
			return false
		}

		return true
	}

	askCreate = () => {

		const { schoolName, clubName } = this.props.navigation.state.params
		if(this.checkAllDone()) {
			Alert.alert('新增貼文', '您將新增 ' + this.state.title + ' 於 ' + schoolName + ' ' + clubName, 
			[
				{text: '取消', onPress: () => console.log('取消'), style: 'cancel'},
				{text: '新增', onPress: () => this.createPost()},
			],
			{ cancelable: false }
			)
		}
			
	}

	createPost = async () => {

		try {
			this.setState({ loading: true })
			const { cid } = this.props.navigation.state.params
			const { title, content, images} = this.state
			const postData = {title, content, images}

			await this.props.createPost(cid, postData)

			Alert.alert('貼文發佈成功！')
			this.props.navigation.popToTop()

		} catch(e) {
			Alert.alert(e.toString())
		}
	}

	
	handleTakePhoto = async () => {

		try {
			const url = await takePhoto()
			const imagesList = [...this.state.images]
			imagesList.push(url)
			this.setState({
				images: imagesList
			})

		} catch(e) {
		
		}

	}

	handleSelectPhoto = async () => {
		
		try {
			const url = await selectPhoto()
			if(url) {
				const imagesList = [...this.state.images]
				imagesList.push(url)
				this.setState({
					images: imagesList
				})
			} else {
				Alert.alert('取消')
			}

			

		} catch(e) {
			
			console.log(e)
		}

	}

	askDelete = (index) => {
		Alert.alert('刪除照片', '', 
        [
			{text: '取消', onPress: () => {}, style: 'cancel'},
			{text: '確定刪除', onPress: () => this.handleDeletePhoto(index)},
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
		const { displayName } = this.props.user
		const { cid, schoolName, clubName, status } = this.props.navigation.state.params

		return (
		<View style={{flex: 1}}>
			<View style={{flex: 1, }}>
				<View style={{flexDirection: 'row', width: 100}}>
					<Image source={{}} style={{height: 100, width: 100}}/>
					<View style={{height: 100}}>
					<Text>{schoolName}</Text>
					<Text>{clubName}</Text>
					<Text>{displayName}</Text>
					<Text>{status}</Text>
					<Text>{new Date().toLocaleString()}</Text>
					</View>
				</View>
				<TextInput 
					placeholder='標題' 
					onChangeText={(title) => this.setState({title})}
					onFocus={ () => this.setState({ texting: true }) }
				/>
				
				<View>
					<ScrollView horizontal>
						<View style={{flexDirection: 'row'}}>
							{
								this.state.images.map((uri, index) => (
									<TouchableOpacity key={index} onPress={() => this.askDelete(index) } style={{height: 100, width: 100, marginRight: 0}}>
										<Image source={{uri}} style={{height: 100, width: 100 }}/>
									</TouchableOpacity>
								))
							}
						</View>
					</ScrollView>
				</View>
				

				<TextInput 
					placeholder='內容......'
					multiline={true}
					numberOfLines={30}
					style={{
					width: '100%',
					flex: 1,
					backgroundColor: '#ffe6b5' 
					}}
					onChangeText={(content) => this.setState({content})}
					onFocus={ () => this.setState({ texting: true }) }
				/> 
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
				<Button title='拍攝照片' onPress={() => this.handleTakePhoto()}/>
				<Button title='從圖庫取得照片' onPress={() => this.handleSelectPhoto()}/>
			</View>

			{ this.state.texting ? 
				<TouchableOpacity style={[ StyleSheet.absoluteFill ]} 
					onPress={ () => {
						Keyboard.dismiss()
						this.setState({ texting: false })
					}}
				>
				</TouchableOpacity> : null }
			<KeyboardAvoidingView behavior='padding'></KeyboardAvoidingView>
			{ this.state.loading ? <Overlayer /> : null }
		</View>
		)
	}
}

export default AddPost