import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';

import styles from '../../styles/home/Home'

const PostListElement = ({ post, navigation, getInsidePost, getPostComment, setPostFavorite, postList, setPostList, showUser }) => {

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
            newPostList[obj['post'].clubKey][obj['post'].postKey] = obj.post;
            setPostList(newPostList);

            navigation.navigate('Post', {
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
                <TouchableOpacity style={styles.shadow} onPress={() => showUser(post.poster)}>
                    <Image source={{ uri: post.posterPhotoUrl }}
                        style={styles.managerImageView}
                        imageStyle={styles.managerImageView} />
                </TouchableOpacity>
                <View style={styles.newsTextView}>
                    <View style={styles.clubAndManagerNameView}>
                        <Text style={styles.newsClubText}>{post.schoolName}</Text>
                        <Text style={styles.newsClubText}>{post.clubName}</Text>
                        <Text style={styles.newsManagerText}>{post.posterStatusChinese}</Text>
                        <Text style={styles.newsManagerText}>{post.posterNickName}</Text>
                    </View>
                    <View style={styles.actNameAndDateView}>
                        <Text style={styles.newsNameText}>{post.title}</Text>
                        <Text style={styles.newsDateText}>{post.date}</Text>
                    </View>
                    <View style={styles.newsContentView}>
                        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.newsContentText}>{post.content}
                        </Text>
                        <Text style={styles.moreText}>...more</Text>
                    </View>
                    <View style={styles.iconView}>
                        <View style={styles.aIcon}>
                            <Image source={require('../../images/message.png')}
                                style={styles.icon} />
                            <Text style={styles.iconNumber}>{post.numComments}</Text>
                        </View>
                        <TouchableOpacity onPress={async () => { await pressFavorite(post); }}>
                            <View style={styles.aIcon}>
                                <Image source={post.statusFavorite ? require("../../images/images2/message.png") : require("../../images/eyes.png")}
                                    style={styles.icon} />
                                <Text style={styles.iconNumber}>{post.numFavorites}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.aIcon}>
                            <Image source={post.statusView ? require("../../images/images2/message.png") : require("../../images/eyes.png")}
                                style={styles.icon} />
                            <Text style={styles.iconNumber}>{post.numViews}</Text>
                        </View>
                    </View>

                </View>
            </View>
        </TouchableOpacity >
    );
};

export default PostListElement;
