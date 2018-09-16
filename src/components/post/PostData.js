import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Comment from './Comment';

class PostData extends React.Component {

    render() {
        const newPost = { ...this.props.post };
        const newComment = { ...this.props.comment };
        return (
            Object.values(newPost).map((element) => (
                <ScrollView key={element.postKey}>
                    <View >
                        <Text>{element.schoolName}</Text>
                        <Text>{element.clubName}</Text>
                        <Text>{element.posterNickName}</Text>
                        <Text>{element.posterStatusChinese}</Text>
                        <Text>{element.title}</Text>
                        <Text>{element.content}</Text>
                        <Text>{element.date}</Text>
                        <Text>觀看人數: {element.numViews}</Text>
                        <TouchableOpacity onPress={async () => await this.props.setPostFavorite(element.clubKey, element.postKey)}>
                            <Text>按讚人數: {element.numFavorites}</Text>
                        </TouchableOpacity>
                    </View>
                    <Comment
                        comment={newComment}
                    />
                </ScrollView>
            ))
        )
    }
}

export default PostData;
