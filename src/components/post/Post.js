import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image
} from "react-native";
import { Button } from "react-native-elements";
import Comment from "./Comment";
import styles from "../../styles/club/Post";
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class Post extends React.Component {
  //寫入本地State
  async componentWillMount() {
    this.setState({ post: this.props.post, comment: this.props.comment });
  }

  state = {
    post: {},
    comment: {},
    userData: { uid: null, user: null, clubs: null},
    loading: false
  };

  //頁面重整
  reload = async (clubKey, postKey) => {
    const { getInsidePost, navigation } = this.props;
    const newPost = await getInsidePost(clubKey, postKey);
    if (newPost == null) {
      navigation.goBack();
    } else {
      this.setState({ post: newPost });
    }
  };

  //點讚
  pressFavorite = async (clubKey, postKey) => {
    const { setPostFavorite, postList, setPostList } = this.props;
    const postData = await setPostFavorite(clubKey, postKey);
    if (postData != null) {
      //放進postList
      const newPostList = JSON.parse(JSON.stringify(postList));
      newPostList[postData.clubKey][postData.postKey] = postData;
      setPostList(newPostList);
      this.setState({ post: postData });
    }
  };

  //設定本頁post
  setPost = postData => {
    this.setState({ post: postData });
  };

  deletePost = async (clubKey, postKey) => {
    const { deletePostData, setPostList, postList, navigation } = this.props;
    const newPostList = await deletePostData(clubKey, postKey, postList);
    setPostList(newPostList);
    navigation.goBack();
  };

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

				this.setState({userData, loading: false})
			});
		} catch(e) {
			Alert.alert(e.toString())
		}  
	}

  render() {
    const postData = this.state.post;
	const commentData = this.props.comment;
	const { uid, user, clubs } = this.state.userData
    const element = JSON.parse(JSON.stringify(postData));

    changeLikeI = () => {
      this.setState({
        likeOr: !this.state.likeOr,
        likeI: this.state.likeOr
          ? require("../../images/like.png")
          : require("../../images/like.png") //圖片要確認
      });
    };

    return (
	<View style={{flex: 1}}>
		<ScrollView>
			//背景底色還沒改成白色
			<KeyboardAvoidingView behavior="padding">
			<Button
				title="reload"
				onPress={async () => {
				await this.reload(element.clubKey, element.postKey);
				}}
			/>
			<View style={styles.container}>
				<View style={styles.rowLeft}>
				<TouchableOpacity onPress={() => this.showUser(postData.poster)}>
					<Image
						source={{ uri: element.posterPhotoUrl }}
						resizeMode="cover"
						style={styles.bigHead}
					/>
				</TouchableOpacity>
				<View style={styles.column}>
					<View style={styles.row}>
					<Text style={styles.school}>{element.schoolName}</Text>
					<Text style={styles.club}>{element.clubName}</Text>
					</View>
					<View style={styles.row}>
					<Text style={styles.name}>{element.posterNickName}</Text>
					<Text style={styles.job}>{element.posterStatusChinese}</Text>
					</View>
				</View>
				</View>

				<View style={styles.postView}>
				<Text style={styles.postTitle}>{element.title}</Text>
				<Text style={styles.postDate}>{element.date}</Text>
				<View style={styles.postTextView}>
					<Text style={styles.postText}>{element.content}</Text>
				</View>
				</View>

				<View style={styles.postPictureView} />

				<View style={styles.sbRowLine}>
				<View style={styles.row}>
					<TouchableOpacity
					onPress={async () =>
						await this.pressFavorite(element.clubKey, element.postKey)
					}
					//onPress={() =>  { this.changeLikeI() }}要怎麼插進去? 按愛心會換圖片
					>
					<Image style={styles.icon} source={this.state.likeI} />
					<Text style={styles.number}>
						按讚人數: {element.numFavorites}
					</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.row}>
					<Image
					style={styles.icon}
					source={require("../../images/images2/message.png")}
					/>
					<Text style={styles.number}>520</Text> //這個數字的功能沒有
					<Image
					style={styles.icon}
					source={require("../../images/eyes.png")}
					/>
					<Text style={styles.number}>觀看人數: {element.numViews}</Text>
				</View>
				</View>
				<Button
				title="Delete Post"
				onPress={async () => {
					await this.deletePost(element.clubKey, element.postKey);
				}}
				/>

				<Comment
					comment={commentData}
					clubKey={element.clubKey}
					postKey={element.postKey}
					setPostList={this.props.setPostList}
					setPost={this.setPost}
					creatingComment={this.props.creatingComment}
					deletingComment={this.props.deletingComment}
					editingComment={this.props.editingComment}
					setCommentEditStatus={this.props.setCommentEditStatus}
				/>
			</View>
        </KeyboardAvoidingView>
	</ScrollView>
	<PopupDialog
				ref={(popupDialog) => this.popupDialog = popupDialog}
				dialogAnimation={slideAnimation}
				width={0.7}
				height={0.7}
				dialogStyle={{borderRadius: 20}}
			>
            {
                user ? (
                    <View style={{flex: 1, borderRadius: 20, overflow: 'hidden'}}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f6b456',
                        }}>
                            <View style={{  width: 100, height: 100, borderRadius: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', margin: 10}}>
                                { user.photoUrl ? 
                                    <Image source={{uri: user.photoUrl}} resizeMode='cover' style={{ width: 100, height: 100, }}/> : 
                                    <Image source={require('../../images/man-user.png')} resizeMode='contain' style={{width: 100, height: 100, borderRadius: 50}}/>
                                }
                            </View>
                            <View>
                                <Text style={{fontSize: 25, fontWeight: 'bold', color: '#0d4273'}}>{user.nickName}</Text>
                            </View>
                        </View>
                        <View style={{
                            flex: 1.5,
                            backgroundColor: '#0d4273',
                        }}>
                            <View style={{flex: 1, justifyContent: 'center',}}>
                                <Text style={{color: '#f6b456', lineHeight: 20, marginLeft: 20, marginRight: 20,}}>{user.aboutMe}</Text>
                            </View>
                            <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(18, 117, 209, 0.3)'}}>
                                <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                                {
                                    Object.keys(clubs).map((cid) => {
                                        const { schoolName, clubName, member } = clubs[cid]
                                        const { status } = member[uid]
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
    );
  }
}

export default Post;
