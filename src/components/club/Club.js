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
import { randomCid, getClubMemberData } from '../../modules/Club'
import { getPostKeyListFromClubKey } from '../../modules/Post'
import PostListElement from '../post/PostListElement'
import { joinOrLikeClub } from '../../modules/Common'
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class Club extends React.Component {

	state = {
		activities: {
			act1: {},
			act2: {},
			act3: {},
		},
		postKey: {},
		post: {},
		userData: { uid: null, user: null, clubs: null},
        loading: false,
	}

	async componentWillMount() {
		const { joinClub, likeClub } = this.props
		let allClubCids = Object.keys(joinClub).concat(Object.keys(likeClub))
		const cid = randomCid(allClubCids)
		this.props.setCurrentClub(cid)
		await this.postReload(cid);
	}

	//貼文重整
	postReload = async (clubKey) => {
		const { getPostDataComplete } = this.props;
		const postKey = await getPostKeyListFromClubKey(clubKey);
		const postData = await getPostDataComplete(postKey);
		this.setState({ postKey: postKey, post: postData });
	}
	//更改postList
	setPostList = (postList) => {
		this.setState({ post: postList });
	}

	generateClubsArray = () => {
		const { joinClubs, likeClubs } = this.props
		let clubsArray = []
		if (Object.keys(joinClubs).length != 0) {
			Object.keys(joinClubs).map((cid) => {
				clubsArray.push({
					cid: cid,
					schoolName: joinClubs[cid].schoolName,
					clubName: joinClubs[cid].clubName,
				})
			})
		}
		if (Object.keys(likeClubs).length != 0) {
			Object.keys(likeClubs).map((cid) => {
				clubsArray.push({
					cid: cid,
					schoolName: likeClubs[cid].schoolName,
					clubName: likeClubs[cid].clubName,
				})
			})
		}
		return clubsArray
	}

	askToAddLike = () => {
		Alert.alert('建立活動', '您將建立 ' + this.state.title + ' 活動於 ' + schoolName + ' ' + clubName,
			[
				{ text: '取消', onPress: () => console.log('取消'), style: 'cancel' },
				{ text: '建立', onPress: () => this.addLike() },
			],
			{ cancelable: false }
		)
	}

	addLike = () => {

	}

	handleGoToMember = async () => {
		const { navigation, joinClubs, currentCid } = this.props
		const memberData = await getClubMemberData(joinClubs[currentCid].member)
		navigation.push('ClubMember', { memberData })
	}

	showUser = async (uid) => {
        try {
            this.popupDialog.show(async () => {
                this.setState({loading: true, userData: { uid: null, user: null, clubs: null}})
                const userData = { uid, user: {}, clubs: {}}
                const user = await getUserData(uid)

                if(user.joinClub) {
                    const promises = Object.keys(user.joinClub).map(async (cid) => {
                        const club = await getClubData(cid)
                        userData.clubs[cid] = club
                    })

                    await Promise.all(promises)
                }

				userData.user = user
				
				console.log(userData)

                this.setState({userData, loading: false})
            });
        } catch(e) {
            Alert.alert(e.toString())
        }
        
    }

	render() {
		if (this.props.currentCid) {
			const newPostList = { ...this.state.post };
			const { userData } = this.state
			const { user, joinClubs, likeClubs, currentCid } = this.props
			let type = joinOrLikeClub(currentCid)
			let clubs = {}
			let status = ''
			if (type == 'JOIN') {
				clubs = joinClubs
				status = clubs[currentCid].member[user.uid].status
			}
			else if (type == 'LIKE') {
				clubs = likeClubs
				status = '路人'
			}

			const { schoolName, clubName, open, member, introduction, imgUrl } = clubs[currentCid]
			const numberOfMember = Object.keys(member).length
			const clubsArray = this.generateClubsArray()


			return (
				<View style={{ flex: 1, marginTop: Expo.Constants.statusBarHeight }}>
					<View style={{ flex: 1 }}>
						<ScrollView>
							<View style={{ height: 400, alignItems: 'center', justifyContent: 'center', }}>
								<View style={{ position: 'absolute', height: 400, width: '100%' }}>
									{imgUrl ? <Image source={{ uri: imgUrl }} resizeMode='cover' style={{ height: 400 }} /> : null}
								</View>
								<Text>{schoolName}</Text>
								<Text>{clubName}</Text>
								<Text>{open ? '公開' : '非公開'}</Text>
								<Text>{numberOfMember}</Text>
								<Text>{status}</Text>
							</View>
							{
								type == 'JOIN' ?
									<View style={{ height: 100, flexDirection: 'row' }}>
										<Button title='發布文章' onPress={() => this.props.navigation.push('AddPost', {})} />
										<Button title='舉辦活動' onPress={() => this.props.navigation.push('AddActivity', {})} />
										<Button title='管理者模式' onPress={() => this.props.navigation.push('ClubAdmin', {})} />
										<Button title='編輯成員' onPress={this.handleGoToMember} />
									</View> : null
							}

							<View style={{ height: 200, borderWidth: 1, borderColor: 'red' }}>
								<Text>{introduction}</Text>
							</View>

							<View style={{ height: 200, borderWidth: 1, borderColor: 'red' }}>
								<Text>最新活動</Text>
								<ScrollView horizontal>
									<View style={{ flexDirection: 'row' }}>
										{Object.keys(this.state.activities).map(
											(actId, index) => {
												return (
													<TouchableOpacity key={actId}>
														<Image source={require('../../images/search.png')} style={{ height: 200, width: 50 }} />
													</TouchableOpacity>
												)
											}
										)}
										<Button title='查看更多' onPress={() => { }} />
									</View>
								</ScrollView>
							</View>

							<View style={{ height: 500, borderWidth: 1, borderColor: 'red' }}>
								<Text>最新文章</Text>
								{
									Object.values(newPostList).map((clubElement) => (
										Object.values(clubElement).map((postElement) => (
											<PostListElement
												key={postElement.postKey}
												post={postElement}
												navigation={this.props.navigation}
												getInsidePost={this.props.getInsidePost}
												getPostComment={this.props.getPostComment}
												setPostFavorite={this.props.setPostFavorite}
												postList={this.state.post}
												setPostList={this.setPostList}
												showUser={this.showUser.bind(this)}
											>
											</PostListElement>
										))
									))
								}
								<Button title='查看更多' onPress={() => { }} />
							</View>
						</ScrollView>
						<View style={{ position: 'absolute', top: 20, left: 50 }}>
							<ModalDropdown
								defaultValue={schoolName + '  ' + clubName}
								options={clubsArray}
								onSelect={(index, rowData) => {
									this.props.setCurrentClub(rowData.cid)
									this.postReload(rowData.cid);
								}}
								renderButtonText={(rowData) => (rowData.schoolName + '  ' + rowData.clubName)}
								renderRow={(rowData, rowId) => {
									const { schoolName, clubName } = rowData
									return <Text>{schoolName + '  ' + clubName}</Text>
								}}
							/>
						</View>
					</View>
					<PopupDialog
						ref={(popupDialog) => this.popupDialog = popupDialog}
						dialogAnimation={slideAnimation}
						width={0.7}
						height={0.7}
						dialogStyle={{borderRadius: 20}}
					>
						{
							userData.user ? (
								<View style={{flex: 1, borderRadius: 20, overflow: 'hidden'}}>
									<View style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: '#f6b456',
									}}>
										<View style={{  width: 100, height: 100, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', margin: 10}}>
											{ userData.user.photoUrl ? 
												<Image source={{uri: userData.user.photoUrl}} resizeMode='cover' style={{ width: 100, height: 100, }}/> : 
												<Image source={require('../../images/man-user.png')} resizeMode='contain' style={{width: 100, height: 100, borderRadius: 50}}/>
											}
										</View>
										<View>
											<Text style={{fontSize: 25, fontWeight: 'bold', color: '#0d4273'}}>{userData.user.nickName}</Text>
										</View>
									</View>
									<View style={{
										flex: 1.5,
										backgroundColor: '#0d4273',
									}}>
										<View style={{flex: 1, justifyContent: 'center',}}>
											<Text style={{color: '#f6b456', lineHeight: 20, marginLeft: 20, marginRight: 20,}}>{userData.user.aboutMe}</Text>
										</View>
										<View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(18, 117, 209, 0.3)'}}>
											<ScrollView contentContainerStyle={{paddingBottom: 20}}>
											{
												Object.keys(userData.clubs).map((cid) => {
													const { schoolName, clubName, member } = userData.clubs[cid]
													const { status } = member[userData.uid]
													let _status = ''
													switch(status) {
														case 'master': _status = '社長'; break
														case 'member': _status = '社員'; break
													}
													return (
														<View
															key={cid}
															style={{marginTop: 20}}
														>
															<Text style={{color: '#f6b456'}}>{`${schoolName} ${clubName} [${_status}]`}</Text>
														</View>
													)
												})
											}
											</ScrollView>
										</View>
									</View>
								</View>
							) : null
						}                 
						{this.state.loading ? <Overlayer /> : null}
					</PopupDialog>
				</View>

			)
		} else {
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
					<Text>您尚未擁有任何社團</Text>
				</View>
			)
		}


	}

}

export default Club