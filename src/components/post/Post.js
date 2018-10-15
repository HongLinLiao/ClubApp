//這頁應該是沒啥問題了
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
import styles from "../../styles/post/Post";
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import UserDialog from '../common/UserDialog'

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
		userData: { uid: null, user: null, clubs: null },
		loading: false
  };

  //頁面重整
  reload = async (clubKey, postKey) => {
    const { getInsidePost, navigation, postList, setPostList } = this.props;
    const newPost = await getInsidePost(clubKey, postKey);
    const newPostList = JSON.parse(JSON.stringify(postList));
    if (newPost == null) {
      newPostList[clubKey][postKey] = null;
      delete newPostList[clubKey][postKey];
      setPostList(newPostList);
      navigation.goBack();
    } else {
      newPostList[clubKey][postKey] = newPost.post;
      setPostList(newPostList);
      this.setState({ post: newPost.post, comment: newPost.comment });
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
  setPost = (postData) => {
    this.setState({ post: postData });
  };

  //設定本頁comment
  setComment = (commentData) => {
    this.setState({ comment: commentData });
  };

  //刪除貼文
  deletePost = async (clubKey, postKey) => {
    const { deletePostData, setPostList, postList, navigation } = this.props;
    const newPostList = await deletePostData(clubKey, postKey, postList);
    setPostList(newPostList);
    navigation.goBack();
	};
	
	showUser = async (uid) => {
		try {
			this.popupDialog.show(async () => {
				this.setState({ loading: true, userData: { uid: null, user: null, clubs: null } })
				const userData = { uid, user: {}, clubs: {} }
				const user = await getUserData(uid)

				if (user.joinClub) {
					const promises = Object.keys(user.joinClub).map(async (cid) => {
						const club = await getClubData(cid)
						userData.clubs[cid] = club
					})

					await Promise.all(promises)
				}

				userData.user = user

				this.setState({ userData, loading: false })
			});
		} catch (e) {
			Alert.alert(e.toString())
		}
	}

  render() {
    const postData = this.state.post;
    const commentData = this.state.comment;
    const element = JSON.parse(JSON.stringify(postData));
    const { uid, user, clubs } = this.state.userData

    return (
      <View style={{flex:1,backgroundColor:'#ffffff'}}>
        <ScrollView>
          
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
                  <View style={styles.circle}>
                    <Image
                      source={{ uri: element.posterPhotoUrl }}
                      //resizeMode="cover"
                      style={styles.bigHead}
                    />
                  </View>
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
                  <TouchableOpacity style={{flexDirection:'row'}}
                  
                    onPress={async () =>
                      await this.pressFavorite(element.clubKey, element.postKey)
                    }
                  >
                    <Image
                      style={styles.icon}
                      source={element.statusFavorite
                      ? require("../../images/images2/like-orange.png")
                      : require("../../images/images2/like-gray.png")
                  }
                    />
                    <Text style={[
                      styles.number,
                      { color: element.statusFavorite ? "#f6b456" : "#666666" }
                    ]}>{element.numFavorites} </Text>

                    

                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <Image
                    style={styles.icon}
                    source={require("../../images/message.png")}
                  />
                  <Text style={styles.number}>{element.numComments}</Text>
                  <Image
                    style={styles.icon}
                    source={
                      element.statusView
                        ? require("../../images/images2/eyes-orange.png")
                        : require("../../images/eyes.png")
                    }
                  />
                  <Text style={[
                    styles.number,
                    { color: element.statusView ? "#f6b456" : "#666666" }
                  ]}>{element.numViews}</Text>
                </View>
              </View>

              <View style={{ display: element.statusEnable ? "flex" : "none" }}>
                <Button title="Edit Post" onPress={async () => {}} />
                <Button
                  title="Delete Post"
                  onPress={async () => {
                    await this.deletePost(element.clubKey, element.postKey);
                  }}
                />
              </View>
              
            </View>
            <Comment//已留的言應該要在scrollview裡面，要留言的框框應該要在scrollview外面，不知如何切割
                userPhotoUrl={this.props.userPhotoUrl}
                comment={commentData}
                postList={this.props.postList}
                clubKey={element.clubKey}
                postKey={element.postKey}
                setPostList={this.props.setPostList}
                setPost={this.setPost}
                setComment={this.setComment}
                creatingComment={this.props.creatingComment}
                deletingComment={this.props.deletingComment}
                editingComment={this.props.editingComment}
                setCommentEditStatus={this.props.setCommentEditStatus}
                setCommentFavorite={this.props.setCommentFavorite}
              />
          </KeyboardAvoidingView>
        </ScrollView>
        <PopupDialog
					ref={(popupDialog) => this.popupDialog = popupDialog}
					dialogAnimation={slideAnimation}
					width={0.7}
					height={0.7}
					dialogStyle={{ borderRadius: 20 }}
				>
					<UserDialog
						uid={uid}
						user={user}
						clubs={clubs}
					/>
					{this.state.loading ? <Overlayer /> : null}
				</PopupDialog>          
      </View>
    );
  }
}

export default Post;
