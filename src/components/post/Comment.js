import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';

class Comment extends React.Component {

    render() {
        const { comment } = this.props;
        let commentData = comment[Object.keys(comment)[0]];
        if (commentData === undefined) {
            commentData = {};
        }
        return (
            Object.values(commentData).map((element) => (
                <View key={element.commentKey}>
                    <Text>{element.commenter}</Text>
                    <Text>{element.content}</Text>
                    <Text>{element.date}</Text>
                </View>
            ))
        )
    }
}

export default Comment;
