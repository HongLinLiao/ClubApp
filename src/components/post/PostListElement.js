import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-elements";
import styles from "../../styles/home/Home";

const PostListElement = ({
  post,
  navigation,
  getInsidePost,
  getPostComment,
  setPostFavorite,
  postList,
  setPostList
}) => {
  async function pressFavorite(post) {
    const postData = await setPostFavorite(post.clubKey, post.postKey);
    if (postData != null) {
      //放進首頁
      const newPostList = JSON.parse(JSON.stringify(postList));
      newPostList[postData.clubKey][postData.postKey] = postData;
      setPostList(newPostList);
    }
  }

  async function insidePost(post) {
    const postData = await getInsidePost(post.clubKey, post.postKey);
    const commentData = await getPostComment(post.clubKey, post.postKey);
    if (postData != null) {
      //放進首頁
      const newPostList = JSON.parse(JSON.stringify(postList));
      newPostList[postData.clubKey][postData.postKey] = postData;
      setPostList(newPostList);

      navigation.navigate("Post", {
        post: postData,
        setPostList: setPostList,
        postList: postList,
        comment: commentData
      });
    }
  }
  state = {
    likeOr: false,
    likeI: require("../../images/like-gray.png")
  };
  changeLikeI = () => {
    //我還是不會
    this.setState({
      likeOr: !this.state.likeOr,
      likeI: this.state.likeOr
        ? require("../../images/like-gray.png")
        : require("../../images/images2/like-orange.png")
    });
  };
  return (
    <TouchableOpacity onPress={async () => await insidePost(post)}>
      <View style={styles.newsView}>
        <View style={styles.shadow}>
          <Image
            source={{ uri: post.posterPhotoUrl }}
            style={styles.managerImageView}
            imageStyle={styles.managerImageView}
          />
        </View>
        <View style={styles.newsTextView}>
          <View style={styles.clubAndManagerNameView}>
            <Text style={styles.newsClubText}>{post.schoolName}</Text>
            <Text style={styles.newsClubText}>{post.clubName}</Text>
            <Text style={styles.newsManagerText}>
              {post.posterStatusChinese}
            </Text>
            <Text style={styles.newsManagerText}>{post.posterNickName}</Text>
          </View>
          <View style={styles.actNameAndDateView}>
            <Text style={styles.newsNameText}>{post.title}</Text>
            <Text style={styles.newsDateText}>{post.date}</Text>
          </View>
          <View style={styles.newsContentView}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.newsContentText}
            >
              {post.content}
            </Text>
            <Text style={styles.moreText}>...more</Text>
          </View>
          <View style={styles.iconView}>
            <Image
              source={require("../../images/message.png")}
              style={styles.icon}
            />
            <Text style={styles.iconNumber}>{post.numComments}</Text>

            <TouchableOpacity
              style={styles.aIcon}
              onPress={async () => {
                await pressFavorite(post);
                this.changeLikeI();
              }}
              style={styles.aIcon}
            >
              <Image source={this.state.likeI} style={styles.icon} />
              <Text style={styles.iconNumber}>{post.numFavorites}</Text>
            </TouchableOpacity>
            <View style={styles.aIcon}>
              <Image
                source={require("../../images/eyes.png")}
                style={styles.icon}
              />
              <Text style={styles.iconNumber}>{post.numViews}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostListElement;
