import React from 'react'
import {
	View,
	TextInput,
	Button,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	StatusBar
} from 'react-native'

import Expo from 'expo'

import ModalDropdown from 'react-native-modal-dropdown';
import { randomClub } from '../../modules/Club'

class Club extends React.Component {

	state = {
		activities: {
			act1: {},
			act2: {},
			act3: {},
		},
		posts: {
			post1: {schoolName: '長庚大學', clubName: '熱舞社', title: '繳社費囉~~~~'},
			post2: {},
			post3: {},
		},
	}

	componentWillMount() {
		const randomCid = randomClub(this.props.clubs)
		this.props.setCurrentClub(randomCid)
	}

	generateClubsArray = () => {
		const { clubs } = this.props
		const cids = Object.keys(this.props.clubs)
		if(cids.length != 0) {
			const clubsArray = Object.keys(clubs).map(
				(cid) => {
					return {
						cid: cid,
						schoolName: clubs[cid].schoolName,
						clubName: clubs[cid].clubName,
					}
				}
			)
			return clubsArray
		} else {
			return null
		}
	}

	askToAddLike = () => {
		Alert.alert('建立活動', '您將建立 ' + this.state.title + ' 活動於 ' + schoolName + ' ' + clubName, 
		[
			{text: '取消', onPress: () => console.log('取消'), style: 'cancel'},
			{text: '建立', onPress: () => this.addLike()},
		],
		{ cancelable: false }
		)
	}

	addLike = () => {

	}

	render() {
		if(this.props.currentCid) {
			const { user, clubs, currentCid } = this.props
			const { schoolName, clubName, open, member, introduction, imgUrl } = clubs[currentCid]
			const numberOfMember = Object.keys(member).length
			const clubsArray = this.generateClubsArray()

			console.log('2')
			
			return (
				<View style={{flex: 1, marginTop: Expo.Constants.statusBarHeight}}>
					<View style={{flex: 1}}>
						<ScrollView>
							<View style={{height: 400, alignItems: 'center', justifyContent: 'center',}}>
								<View style={{position: 'absolute', height: 400, width: '100%'}}>
									{ imgUrl ? <Image source={{uri: imgUrl}} resizeMode='cover' style={{height: 400}}/> : null}	
								</View>
								<Text>{schoolName}</Text>
								<Text>{clubName}</Text>
								<Text>{open ? '公開' : '非公開'}</Text>
								<Text>{numberOfMember}</Text>
								<Text>{numberOfMember != 0 ? member[user.uid].status : '沒有成員'}</Text>					
								<Button title='加入社團' onPress={() => {}}/>
								<Button title='收藏社團' onPress={() => {}}/>
							</View>
					
							<View style={{height: 100, flexDirection: 'row'}}>
								<Button title='發布文章' onPress={() => this.props.navigation.push('AddPost', {})}/>
								<Button title='舉辦活動' onPress={() => this.props.navigation.push('AddActivity', {})}/>
								<Button title='管理者模式' onPress={() => this.props.navigation.push('ClubAdmin', {})}/>
								<Button title='編輯成員' onPress={() => this.props.navigation.push('ClubMember', {})}/>
							</View>
					
							<View style={{height: 200, borderWidth: 1, borderColor: 'red'}}>
								<Text>{introduction}</Text>
							</View>
					
							<View style={{height: 200, borderWidth: 1, borderColor: 'red'}}>
								<Text>最新活動</Text>
								<ScrollView horizontal>
									<View style={{flexDirection: 'row'}}>
										{Object.keys(this.state.activities).map(
											(actId, index) => {
												return (
												<TouchableOpacity key={actId}>
													<Image source={require('../../images/search.png')} style={{height: 200, width: 50}}/>
												</TouchableOpacity>
												)
											}
										)}
										<Button title='查看更多' onPress={() => {}}/>
									</View>
								</ScrollView>
							</View>
							
							<View style={{height: 500, borderWidth: 1, borderColor: 'red'}}>
								<Text>最新文章</Text>
								{
								// Object.keys(this.state.posts).map(
								// 	(postId, index) => {
								// 		return (
								// 		<View key={postId} style={{height: 100, borderWidth: 1, borderColor: 'green'}}>
								// 			<PostComponent key={postId} post={this.state.posts[postId]}/>
								// 		</View>     
								// 		)
								// 	}
								// )
								}
								<Button title='查看更多' onPress={() => {}}/>
							</View>
						</ScrollView>
						<View style={{position: 'absolute', top: 20, left: 50}}>
							<ModalDropdown 
								defaultValue={schoolName + '  ' + clubName}
								options={clubsArray}
								onSelect={(index, rowData) => this.props.setCurrentClub(rowData.cid)}
								renderButtonText={(rowData) => (rowData.schoolName + '  ' + rowData.clubName)}
								renderRow={(rowData, rowId) => {
								const { schoolName, clubName } = rowData
								return <Text>{ schoolName + '  ' + clubName }</Text>
								}}
							/>
						</View>
					</View>
				
				</View>

			)
		} else {
			return (
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
					<Text>您尚未擁有任何社團</Text>
				</View>
			)
		}
		
		
	}

}

export default Club