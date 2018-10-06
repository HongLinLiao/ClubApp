import React from 'react'
import {
	View,
	TextInput,
	Button,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	StatusBar,
	Alert,
} from 'react-native'

import Expo from 'expo'

import ModalDropdown from 'react-native-modal-dropdown';
import { randomCid, getClubMemberData } from '../../modules/Club'
import Overlayer from '../common/Overlayer'


class SearchClub extends React.Component {

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
		loading: false,
	}

	componentWillMount() {
		
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

	handleJoinClub = async (cid) => {
        try {
            this.setState({ loading: true })

			await this.props.joinTheClub(cid)
			
			this.props.navigation.popToTop()

            this.setState({ loading: false })

            Alert.alert('已成功加入!')
        } catch(e) {
            Alert.alert(e.toString())
        }
    }



	render() {
		const { user, navigation } = this.props
		const { club } = navigation.state.params
		const { schoolName, clubName, open, member, introduction, imgUrl } = club
		const numberOfMember = Object.keys(member).length
		
		return (
			<View style={{flex: 1, }}>
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
							<Button title='加入社團' onPress={() => this.handleJoinClub(club.cid)}/>
							<Button title='收藏社團' onPress={() => {}}/>
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
				</View>
				{this.state.loading ? <Overlayer /> : null}
			</View>

		)
		
	}

}

export default SearchClub