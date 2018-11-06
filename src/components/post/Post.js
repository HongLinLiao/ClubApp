//這頁應該是沒啥問題了
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  RefreshControl
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
  componentWillMount() {
    this.setState({ post: this.props.post, comment: this.props.comment });
  }

  state = {
    post: {},
    comment: [],
    userData: { uid: null, user: null, clubs: null },
    loading: false,
    refreshing: false,
  };

  onRefresh = async () => {
    try {
      this.setState({ refreshing: true });
      this.setState({ refreshing: false });
      this.reload(this.state.post.clubKey, this.state.post.postKey);
    } catch (error) {
      console.log(error.toString());
    }
  }

  //頁面重整
  reload = async (clubKey, postKey) => {
    const { getInsidePost, navigation, postList, setPostList } = this.props;
    this.postOverLayar();
    const newPost = await getInsidePost(clubKey, postKey);
    this.postOverLayar();
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
    this.postOverLayar();
    let obj = await setPostFavorite(clubKey, postKey, true);
    if (obj != null) {
      //放回state
      this.setState({ post: obj.post, comment: obj.comment });
      //放進首頁
      let newPostList = postList.slice();
      let result = newPostList.some(function (value, index, array) {
        if (Object.keys(value)[0] == obj.post.postKey) {
          let newPost = {};
          newPost[obj.post.postKey] = obj.post
          newPostList[index] = newPost
          return true;
        }
        else {
          return false;
        }
      });
      setPostList(newPostList);
      this.postOverLayar();
    }
    else {
      const { navigation } = this.props;
      let newPostList = postList.slice();
      let result = newPostList.some(function (value, index, array) {
        if (Object.keys(value)[0] == obj.post.postKey) {
          newPostList.splice(index, 1);
          alert("該貼文不存在");
          return true;
        }
        else {
          return false;
        }
      });
      setPostList(newPostList);
      this.postOverLayar();
      navigation.goBack();
    }
  };

  //設定本頁post
  setPost = (postData) => {
    this.setState({ post: postData });
  };

  //過門
  postOverLayar = () => {
    this.setState({ loading: !this.state.loading });
  };

  //設定本頁comment
  setComment = (commentData) => {
    this.setState({ comment: commentData });
  };

  //刪除貼文
  deletePost = async (clubKey, postKey) => {
    const { deletePostData, setPostList, postList, navigation } = this.props;
    this.postOverLayar();
    const newPostList = await deletePostData(clubKey, postKey, postList);
    // setPostList(newPostList);
    this.postOverLayar();
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
    const commentData = this.state.comment
    const element = JSON.parse(JSON.stringify(this.state.post));
    const { uid, user, clubs } = this.state.userData

    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              tintColor='#f6b456'
            />
          }
        >
          <KeyboardAvoidingView behavior="padding">
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
                  <TouchableOpacity style={{ flexDirection: 'row' }}

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
                <Button title="Edit Post" onPress={async () => { }} />
                <Button
                  title="Delete Post"
                  onPress={async () => {
                    await this.deletePost(element.clubKey, element.postKey);
                  }}
                />
              </View>

            </View>
            <Comment
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
              showUser={this.showUser.bind(this)}
              postOverLayar={this.postOverLayar}
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
            loading={this.state.loading}
          />
        </PopupDialog>
        {this.state.loading ? <Overlayer /> : null}
      </View>
    );
  }
}

export default Post;
