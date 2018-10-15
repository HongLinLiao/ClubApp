import React from 'react'
import {
	View,
	Button,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	Alert,
} from 'react-native'

import Overlayer from '../common/Overlayer'
import PostListElement from '../post/PostListElement'
import { getPostKeyListFromClubKey } from '../../modules/Post'


class SearchClub extends React.Component {

	state = {
		activities: {
			act1: {},
			act2: {},
			act3: {},
		},
		post: {},
		postKey: {},
		loading: false,
		hasJoin: false,
		hasLike: false,
	}

	async componentWillMount() {
		const { navigation } = this.props
		const { hasJoin, hasLike } = navigation.state.params.status
		this.setState({
			hasJoin,
			hasLike: hasJoin ? hasJoin : hasLike,
		})
		await this.postReload(navigation.state.params.club.cid);
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

	handleJoinClub = async (cid) => {
		try {
			this.setState({ loading: true })

			await this.props.joinTheClub(cid)

			this.props.navigation.popToTop()

			this.setState({ loading: false })

			Alert.alert('已成功加入!')
		} catch (e) {
			Alert.alert(e.toString())
		}
	}

	handleLikeTheClub = async (cid) => {
		try {
			this.setState({ loading: true })

			await this.props.likeTheClub(cid)

			this.setState({ loading: false, hasLike: true })

			Alert.alert('已成功蒐藏!')
		} catch (e) {
			Alert.alert(e.toString())
		}
	}



	render() {
		const { user, navigation } = this.props
		const { hasJoin, hasLike } = this.state
		const { club } = navigation.state.params
		const { schoolName, clubName, open, member, introduction, imgUrl } = club
		const numberOfMember = Object.keys(member).length
		const newPostList = { ...this.state.post };

		return (
			<View style={{ flex: 1, }}>
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
							<Button title={hasJoin ? '已加入' : '加入社團'} disabled={hasJoin} onPress={() => this.handleJoinClub(club.cid)} />
							<Button title={hasLike ? '已蒐藏' : '蒐藏社團'} disabled={hasLike} onPress={() => this.handleLikeTheClub(club.cid)} />
						</View>

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
										>
										</PostListElement>
									))
								))
							}
							<Button title='查看更多' onPress={() => { }} />
						</View>
					</ScrollView>
				</View>
				{this.state.loading ? <Overlayer /> : null}
			</View>

		)

	}

}

export default SearchClub