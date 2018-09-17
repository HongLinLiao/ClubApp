import React from 'react';
import {
	View,
	Text,
	ScrollView,
	Image,
	TextInput,
	Button,
	TouchableOpacity,
	Alert
} from 'react-native';

import { takePhoto, selectPhoto } from '../../modules/Common'


class AddPost extends React.Component {

	state ={
		title: '',
		content: '',
		images: []
	}

	componentDidMount() {
		this.props.navigation.setParams({
			askCreate: this.askCreate.bind(this)
		})
	}

	askCreate = () => {

		const { schoolName, clubName } = this.props.navigation.state.params
		Alert.alert('新增貼文', '您將新增 ' + this.state.title + ' 於 ' + schoolName + ' ' + clubName, 
        [
			{text: '取消', onPress: () => console.log('取消'), style: 'cancel'},
			{text: '新增', onPress: () => this.createPost()},
        ],
        { cancelable: false }
    	)
	}

	createPost = async () => {

		try {
			const { cid } = this.props.navigation.state.params
			const { title, content, images} = this.state
			const postData = {title, content, images}

			await this.props.createPost(cid, postData)

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

	setData = () => {
		this.setState({
			images: [
				'https://www.w3schools.com/w3css/img_lights.jpg',
				'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg'
			]
		})
	}

	render() {
		const { displayName } = this.props.user
		const { cid, schoolName, clubName, status} = this.props.navigation.state.params

		return (
		<View style={{flex: 1}}>
			<Button title='hahaha' onPress={() => this.setData()} />
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
				<TextInput placeholder='標題' onChangeText={(title) => this.setState({title})}/>
				
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
		</View>
		)
	}
}

export default AddPost