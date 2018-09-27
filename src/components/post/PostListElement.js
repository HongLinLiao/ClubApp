import React from 'react';
import { View, Text, TouchableOpacity , Image } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../styles/home/Home'

const PostListElement = ({ post, navigation, router, setPostFavorite, getInsidePost }) => {
    async function insidePage() {
        const viewPost = {};
        viewPost[post.postKey] = { ...post };
        try {
            const newPost = await getInsidePost(post.clubKey, post.postKey, router);
        }
        catch (error) {
            console.log(error.toString());
        }
        navigation.navigate('Post', router)
    }

    async function pressFavorite(post) {
        await setPostFavorite(post.clubKey, post.postKey, false);
    }

    return (
        <TouchableOpacity onPress={async () => await insidePage() }>
            <View style={styles.containView}>
                <View style={styles.newsView}>
                    <View style={styles.shadow}>
                        <Image source={{uri: post.posterPhotoUrl}}
                            style={styles.managerImageView}
                            imageStyle={styles.managerImageView} />
                    </View>
                    <View style={styles.newsTextView}>
                        <View style={styles.clubAndManagerNameView}>
                            <Text style={styles.newsClubText}>{post.clubName}</Text>
                            <Text style={styles.newsManagerText}>{post.posterStatusChinese}</Text>
                            <Text style={styles.newsManagerText}>{post.posterNickName}</Text>
                        </View>
                        <View style={styles.actNameAndDateView}>
                            <Text style={styles.newsNameText}>{post.title}</Text>
                            <Text style={styles.newsDateText}>{post.date}</Text>
                        </View>
                        <View style={styles.newsContentView}>
                            <Text numberOfLines={3} ellipsizeMode='tail' style={styles.newsContentText}>{post.content}
                                <Text style={styles.moreText}>...more</Text>
                            </Text>

                        </View>
                        <View style={styles.iconView}>
                            <View style={styles.aIcon}>
                                <Image source={require('../../images/message.png')}
                                    style={styles.icon} />
                                <Text style={styles.iconNumber}>{post.numComments}</Text>
                            </View>
                            <TouchableOpacity onPress={async () => await pressFavorite(post)}>
                                <View style={styles.aIcon}>
                                    <Image source={require('../../images/like-gray.png')}
                                        style={styles.icon} />
                                    <Text style={styles.iconNumber}>{post.numFavorites}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.aIcon}>
                                <Image source={require('../../images/eyes.png')}
                                    style={styles.icon} />
                                <Text style={styles.iconNumber}>{post.numViews}</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </View>
        </TouchableOpacity >
    );
};

export default PostListElement;