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

  render() {
    const postData = this.state.post;
    const commentData = this.props.comment;
    const element = JSON.parse(JSON.stringify(postData));

    changeLikeI = () => {
        this.setState({
            likeOr: !this.state.likeOr,
            likeI: this.state.likeOr ? require('../../images/like.png') : require('../../images/like.png')//圖片要確認
        })
    }
    return (
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <Button
            title="reload"
            onPress={async () => {
              await this.reload(element.clubKey, element.postKey);
            }}
          />
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

          <View style={styles.postPictureView}>
          
          </View>
   

          <View style={styles.sbRowLine}>
          <View style={styles.row}>
          <TouchableOpacity
            onPress={async () =>
              await this.pressFavorite(element.clubKey, element.postKey)
             
            }
            onPress={() =>  { this.changeLikeI() }}//要怎麼插進去?

          ><Image style={styles.icon}
          source={this.state.likeI} />
            <Text style={styles.number}>按讚人數: {element.numFavorites}</Text>
          </TouchableOpacity>
          </View>

          <View style={styles.row}>
          <Image style={styles.icon}
                                source={require('../../images/images2/message.png')} />
                            <Text style={styles.number}>520</Text>
          <Image style={styles.icon}
                                source={require('../../images/eyes.png')} />
          <Text style={styles.number}>觀看人數: {element.numViews}</Text>
          </View>
          </View>






          <Button
            title="Delete Post"
            onPress={async () => {
              await this.deletePost(element.clubKey, element.postKey);
            }}
          />
          <View style={styles.rowPadding}>
          <Comment
            comment={commentData}
            clubKey={element.clubKey}
            postKey={element.postKey}
            setPostList={this.props.setPostList}
            setPost={this.setPost}
            creatingComment={this.props.creatingComment}
            deletingComment={this.props.deletingComment}
            editingComment={this.props.editingComment}
            
          />
          </View>

///絲帶兒部分
          <TouchableOpacity>
              <Image style={styles.littleHead}
                  source={item.headImg} />
          </TouchableOpacity>
          <View style={styles.columnLine}>
              <View style={styles.sbRow}>
                  <View style={styles.row}>
                      <Text style={styles.littleSchool}>{item.schoolName}</Text>
                      <Text style={styles.littleClub}>{item.clubName}</Text>
                  </View>
                  <View style={[styles.row]}>
                      <TouchableOpacity onPress={() => { this.changeLikeImg(index) }}>
                          <Image style={styles.icon}
                              source={item.likeImg} />
                      </TouchableOpacity>
                      <Text style={styles.numberLittle}>520</Text>
                      <TouchableOpacity>
                          <Image source={require('../../images/images2/pencil.png')}
                              style={styles.icon} />
                      </TouchableOpacity>
                  </View>
              </View>
              <View style={styles.row}>
                  <Text style={styles.littleName}>{item.memberName}</Text>
                  <Text style={styles.littleJob}>{item.memberJob}</Text>
              </View>
              <Text style={styles.comment}>{item.memberCommemt}</Text>
          </View>
     /////還沒拼好




        </KeyboardAvoidingView>
        <Comment
      setCommentEditStatus={this.props.setCommentEditStatus}
      />
      </ScrollView>

      
    );
  }
}

export default Post;
