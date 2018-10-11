import React from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { Button } from 'react-native-elements';
import styles from "../../styles/post/Comment";

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
        },
        likeOr: false,
        comments: false,
        likeI: require('../../images/like.png')
    }

    changeLikeImg = () => {
        this.setState({
            likeOr: !this.state.likeOr,
            likeI: this.state.likeOr ? require('../../images/like.png') : require('../../images/graylike.png')
        })
    }
    commemts = (status) => {
        this.setState({
            comments: status
        })
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
                                <View style={styles.rowPadding}>
                                    <TouchableOpacity>
                                        <Image style={styles.littleHead}
                                            source={{ uri: element.commenterPhotoUrl }}
                                            resizeMode='cover' />
                                    </TouchableOpacity>
                                    <View style={styles.columnLine}>
                                        <View style={styles.sbRow}>
                                            <View style={styles.row}>
                                                <Text style={styles.littleSchool}>學校名稱</Text>
                                                <Text style={styles.littleClub}>社團名稱</Text>
                                            </View>
                                            <View style={styles.row}>
                                                <TouchableOpacity onPress={() => { this.changeLikeImg() }}>
                                                    <Image style={styles.icon}
                                                        source={item.likeImg} />
                                                </TouchableOpacity>
                                                <Text style={styles.numberLittle}>按讚次數</Text>
                                                <TouchableOpacity >
                                                    <Image source={require('../../images/pencil.png')}
                                                        style={styles.icon} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={styles.littleName}>{element.commenterNickName}</Text>
                                            <Text style={styles.littleJob}>留言者職位</Text>
                                        </View>
                                        <Text style={styles.littleJob}>{element.date}</Text>
                                        <TextInput
                                            style={styles.comment}
                                            value={element.content}
                                            editable={element.statusEdit}
                                            onChangeText={(oldContent) => { this.setState({ oldContent }); }}
                                        />
                                    </View>
                                </View>




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
                <View style={[styles.rowPaddingInput, {height: this.state.comments ? null : 55} ]}>
                    <TouchableOpacity>
                        <Image style={styles.littleHead}
                            source={require('../../images/myboyfriend.jpg')} />
                    </TouchableOpacity>
                    <View style={styles.columnTabBar}>
                        {this.state.comments ? (
                            <View>
                                <View style={styles.row}>
                                    <Text style={styles.littleSchool}>長庚大學</Text>
                                    <Text style={styles.littleClub}>Monbebe社</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.littleName}>Shownu女友</Text>
                                    <Text style={styles.littleJob}>社員</Text>
                                </View>
                            </View>
                        ) : null
                        }
                        <View style={[ styles.inputViewTabBar]}>
                            <TextInput
                                style={[ styles.textInputTabBar ]}
                                placeholder='新增留言...'
                                placeholderTextColor='rgba(102,102,102,0.7)'
                                underlineColorAndroid={'transparent'}
                                multiline={this.state.comments}
                                onFocus={() => this.commemts(true)}
                                onEndEditing={() => this.commemts(false)}
                                onChangeText={(newContent) => { this.setState({ newContent }); }}
                                onContentSizeChange={(event) => {
                                    this.setState({ height: event.nativeEvent.contentSize.height })
                                }}
                                value={this.state.newContent}
                            />
                        </View>
                    </View>
                    <View style={styles.sbColumn}>
                        {this.state.comments ?
                            (
                                <TouchableOpacity onPress={() => {
                                    this.setState({comments: false})
                                    Keyboard.dismiss()
                                }}>
                                    <Image style={styles.iconClose}
                                        source={require('../../images/close.png')} />
                                </TouchableOpacity>
                            ) : null             
                        }            
                        <TouchableOpacity onPress={async () => { await this.addComment(); }}>
                            <Image source={require('../../images/send.png')}
                                style={styles.sendIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        )
    }
}

export default Comment;
