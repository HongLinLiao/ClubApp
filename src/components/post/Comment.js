import React from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';

class Comment extends React.Component {

    async componentWillMount() {
        this.setState({ comment: this.props.comment });
    }

    state = {
        //留言列
        comment: {},
        //更新
        oldContent: '',
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
        const { clubKey, postKey, creatingComment, setPostList, setPost } = this.props;
        const obj = await creatingComment(clubKey, postKey, content);
        if (obj != null) {
            //放進postList
            setPostList(obj.postList);
            //放進post
            setPost(obj.postList[clubKey][postKey]);
            //放進comment state
            this.setState({ comment: obj.comment });
            //清空輸入欄
            this.setState({ newContent: '' });
        }
    }

    //刪除留言
    deleteComment = async (commentKey) => {
        const { deletingComment, clubKey, postKey, setPostList, setPost } = this.props;
        const obj = await deletingComment(clubKey, postKey, commentKey);
        if (obj != null) {
            //放進postList
            setPostList(obj.postList);
            //放進post
            setPost(obj.postList[clubKey][postKey]);
            //放進comment state
            this.setState({ comment: obj.comment });
        }
    }

    //編輯狀態改變
    statusEditChange = async (element) => {
        const newComment = JSON.parse(JSON.stringify(this.state.comment));
        newComment[element.commentKey]['statusEdit'] = !newComment[element.commentKey]['statusEdit'];
        this.setState({
            comment: newComment,
            oldContent: ''
        });
    }

    //編輯留言完成
    editComment = async (commentKey) => {
        const content = this.state.oldContent;
        const { editingComment, clubKey, postKey, setPostList, setPost } = this.props;
        const obj = await editingComment(clubKey, postKey, commentKey, content);
        if (obj != null) {
            //放進postList
            setPostList(obj.postList);
            //放進post
            setPost(obj.postList[clubKey][postKey]);
            //放進comment state
            this.setState({ comment: obj.comment });
            this.setState({ oldContent: '' });
        }
    }

    render() {
        const comment = JSON.parse(JSON.stringify(this.state.comment));
        return (
            <View>
                <View>
                    {
                        Object.values(comment).map((element) => (
                            <View key={element.commentKey}>
                                <Image
                                    source={{ uri: element.commenterPhotoUrl }}
                                    resizeMode='cover'
                                    style={{ width: 50, height: 50 }}
                                />
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
