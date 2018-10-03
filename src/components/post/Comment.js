import React from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-elements';

class Comment extends React.Component {

    state = {
        //更新
        oldContent: '',
        //取消
        tempContent: '',
        //新增
        newContent: '',
        height: 0,
        display: {
            enable: 'flex',
            disable: 'none'
        }
    }

    //新增留言
    addComment = async () => {
        const content = this.state.newContent;
        const { clubKey, postKey, creatingComment, router } = this.props;
        await creatingComment(clubKey, postKey, router, content);
        this.setState({ newContent: '' });
    }

    //刪除留言
    deleteComment = async (commentKey) => {
        const { deletingComment, clubKey, postKey, router } = this.props;
        await deletingComment(clubKey, postKey, commentKey, router);
    }

    //編輯狀態改變
    statusEditChange = async (element) => {
        const { setCommentEditStatus, postKey, router, comment } = this.props;
        await setCommentEditStatus(postKey, element.commentKey, router, comment, element);
        this.setState({ tempContent: element.content });
        this.setState({ oldContent: '' });
    }

    //編輯留言完成
    editComment = async (commentKey) => {
        const content = this.state.oldContent;
        const { editingComment, clubKey, postKey, router } = this.props;
        await editingComment(clubKey, postKey, commentKey, router, content);
        this.setState({ oldContent: '' });
    }

    render() {
        const comment = { ...this.props.comment };
        let commentData = comment[Object.keys(comment)[0]];
        if (commentData === undefined || commentData === false) {
            commentData = {};
        }
        return (
            <View>
                <View>
                    {
                        Object.values(commentData).map((element) => (
                            <View key={element.commentKey}>
                                <Text>{element.commenterNickName}</Text>
                                <TextInput
                                    value={element.content}
                                    editable={element.statusEdit}
                                    onChangeText={(oldContent) => { this.setState({ oldContent }); }}
                                />
                                <Text>{element.date}</Text>
                                <View style={{ display: element.statusEnable ? this.state.display.enable : this.state.display.disable }}>
                                    <Button
                                        style={{ display: element.statusEdit ? this.state.display.enable : this.state.display.disable }}
                                        title='完成'
                                        onPress={async () => await this.editComment(element.commentKey)}
                                    />
                                    <Button
                                        style={{ display: element.statusEdit ? this.state.display.enable : this.state.display.disable }}
                                        title='取消'
                                        onPress={() => this.statusEditChange(element)}
                                    />
                                    <Button
                                        disabled={element.statusEnable ? element.statusEdit ? element.statusEdit : element.statusEdit : !element.statusEnable}
                                        title='編輯留言'
                                        onPress={() => this.statusEditChange(element)}
                                    />
                                    <Button
                                        disabled={element.statusEnable ? element.statusEdit ? element.statusEdit : element.statusEdit : !element.statusEnable}
                                        title='刪除留言'
                                        onPress={async () => { await this.deleteComment(element.commentKey) }}
                                    />
                                </View>

                            </View>
                        ))
                    }
                </View>
                <View>
                    <TextInput
                        style={{ borderColor: 'black', borderWidth: 2, height: Math.max(30, this.state.height) }}
                        multiline={true}
                        placeholder='留言'
                        onChangeText={(newContent) => { this.setState({ newContent }); }}
                        onContentSizeChange={(event) => {
                            this.setState({ height: event.nativeEvent.contentSize.height })
                        }}
                        value={this.state.newContent}
                    />
                    <Button
                        title='發送留言'
                        onPress={async () => { await this.addComment(); }}
                    />
                </View>
            </View>

        )
    }
}

export default Comment;
