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
  setPostList,
  showUser
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
    const obj = await getInsidePost(post.clubKey, post.postKey);
    if (obj != null) {
      //放進首頁
      const newPostList = JSON.parse(JSON.stringify(postList));
      newPostList[obj["post"].clubKey][obj["post"].postKey] = obj.post;
      setPostList(newPostList);

      navigation.navigate("Post", {
        post: obj.post,
        setPostList: setPostList,
        postList: postList,
        comment: obj.comment
      });
    }
  }

  return (
    <TouchableOpacity onPress={async () => await insidePost(post)}>
      <View style={styles.newsView}>
        <TouchableOpacity onPress={() => showUser(post.poster)}>
          <View style={styles.shadow}>
            <Image
              source={{ uri: post.posterPhotoUrl }}
              style={styles.managerImageView}
              imageStyle={styles.managerImageView}
            />
          </View>
        </TouchableOpacity>
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
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.newsNameText}
            >
              {post.title}
            </Text>
            <Text style={styles.newsDateText}>{post.date}</Text>
          </View>
          <View style={styles.newsContentView}>
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              //ellipsizeText="...more"好像無法顯示除了...的字
              style={styles.newsContentText}
            >
              {post.content}
            </Text>
          </View>
          <View style={styles.iconView}>
            <View style={styles.aIcon}>
              <Image //留言icon 不會留過言變色 字也不會變色
                source={require("../../images/message.png")}
                style={styles.icon}
              />
              <Text style={styles.iconNumber}>{post.numComments}</Text>
            </View>
            <TouchableOpacity //按讚icon
              style={styles.aIcon}
              onPress={async () => {
                await pressFavorite(post);
              }}
            >
              <Image
                source={
                  post.statusFavorite
                    ? require("../../images/images2/like-orange.png")
                    : require("../../images/images2/like-gray.png")
                }
                style={styles.icon}
              />
              <Text
                style={[
                  styles.iconNumber,
                  { color: post.statusFavorite ? "#f6b456" : "#666666" }
                ]}
              >
                {post.numFavorites}
              </Text>
            </TouchableOpacity>
            <View style={styles.aIcon}>
              <Image //看過icon
                source={
                  post.statusView
                    ? require("../../images/images2/eyes-orange.png")
                    : require("../../images/eyes.png")
                }
                style={styles.icon}
              />
              <Text
                style={[
                  styles.iconNumber,
                  { color: post.statusView ? "#f6b456" : "#666666" }
                ]}
              >
                {post.numViews}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostListElement;
