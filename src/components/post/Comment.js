import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-elements';

class Comment extends React.Component {

    state = {
        content: '',
        height: 0
    }

    addComment = async (clubKey, postKey) => {
        const content = this.state.content;
        const { addComment } = this.props;
        await addComment(clubKey, postKey, content);
        this.setState({ content: '' });
    }



    render() {
        const { comment, clubKey, postKey } = this.props;
        let commentData = comment[Object.keys(comment)[0]];
        if (commentData === undefined) {
            commentData = {};
        }
        return (
            <View>
                <View>
                    {
                        Object.values(commentData).map((element) => (
                            <View key={element.commentKey}>
                                <Text>{element.commenterNickName}</Text>
                                <Text>{element.content}</Text>
                                <Text>{element.date}</Text>
                                <Button
                                    title='編輯留言'
                                />
                                <Button
                                    title='刪除留言'
                                />
                            </View>
                        ))
                    }
                </View>
                <View>
                    <TextInput
                        style={{ height: 40, borderColor: 'black', borderWidth: 2, height: Math.max(30, this.state.height) }}
                        multiline={true}
                        placeholder='留言'
                        onChangeText={(content) => { this.setState({ content }); }}
                        onContentSizeChange={(event) => {
                            this.setState({ height: event.nativeEvent.contentSize.height })
                        }}
                        value={this.state.content}
                    />
                    <Button
                        title='發送留言'
                        onPress={async () => { await this.addComment(clubKey, postKey); }}
                    />
                </View>
            </View>

        )
    }
}

export default Comment;
