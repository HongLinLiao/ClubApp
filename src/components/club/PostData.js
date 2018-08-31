import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';


class PostData extends React.Component {

    render() {
        return (
            <ScrollView>
                <View>
                    <Text>{this.props.post.schoolName}</Text>
                    <Text>{this.props.post.clubName}</Text>
                    <Text>{this.props.post.posterNickName}</Text>
                    <Text>{this.props.post.posterStatusChinese}</Text>
                    <Text>{this.props.post.title}</Text>
                    <Text>{this.props.post.content}</Text>
                    <Text>{this.props.post.date}</Text>
                </View>
            </ScrollView>
        )
    }
}

export default PostData;
