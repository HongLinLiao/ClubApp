import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';

const PostListElement = ({ post, navigation, router, setPostFavorite, getInsidePost }) => {
    const { titleText } = styles;

    async function insidePage() {
        const viewPost = {};
        viewPost[post.postKey] = { ...post };
        try {
            await getInsidePost(post.clubKey, post.postKey, router);
        }
        catch (error) {
            console.log(error.toString());
        }
        navigation.navigate('Post',router)
    }

    async function pressFavorite(post) {
        const viewPost = {};
        viewPost[post.postKey] = { ...post };
        await setPostFavorite(viewPost);
    }

    return (
        <View>
            <TouchableOpacity onPress={async () => await insidePage()}>
                <Text>{post.schoolName}</Text>
                <Text>{post.clubName}</Text>
                <Text>{post.posterNickName}</Text>
                <Text>{post.posterStatusChinese}</Text>
                <Text style={titleText}>{post.title}</Text>
                <Text>{post.content}</Text>
                <Text>{post.date}</Text>
                <Text>觀看人數: {post.numViews}</Text>
                <TouchableOpacity onPress={async () => await pressFavorite(post)}>
                    <Text>按讚人數: {post.numFavorites}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    titleText: {
        fontSize: 28,
    }
};

export default PostListElement;