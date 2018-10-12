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
class Post extends React.Component {
  //寫入本地State
  async componentWillMount() {
    this.setState({ post: this.props.post, comment: this.props.comment });
  }

  state = {
    post: {},
    comment: {}
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

  deletePost = async (clubKey, postKey) => {
    const { deletePostData, setPostList, postList, navigation } = this.props;
    const newPostList = await deletePostData(clubKey, postKey, postList);
    setPostList(newPostList);
    navigation.goBack();
  };

  render() {
    const postData = this.state.post;
    const commentData = this.state.comment;
    const element = JSON.parse(JSON.stringify(postData));

    return (
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
              <TouchableOpacity>
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
                >
                  <Image style={styles.icon} source={element.statusFavorite ? require("../../images/images2/message.png") : require("../../images/eyes.png")} />
                  <Text style={styles.number}>{element.numFavorites} </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Image
                  style={styles.icon}
                  source={require("../../images/images2/message.png")}
                />
                <Text style={styles.number}>{element.numComments}</Text>
                <Image
                  style={styles.icon}
                  source={element.statusView ? require("../../images/images2/message.png") : require("../../images/eyes.png")}
                />
                <Text style={styles.number}>{element.numViews}</Text>
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
              setComment={this.setComment}
              creatingComment={this.props.creatingComment}
              deletingComment={this.props.deletingComment}
              editingComment={this.props.editingComment}
              setCommentEditStatus={this.props.setCommentEditStatus}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

export default Post;
