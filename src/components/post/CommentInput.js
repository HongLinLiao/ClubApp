import React from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert
} from "react-native";
import { Button } from "react-native-elements";
import styles from "../../styles/post/Comment";

class CommentInput extends React.Component {

    state = {
        content: "",
    };

    //新增留言
    addComment = async () => {
        const content = this.state.content;
        const {
            clubKey,
            postKey,
            creatingComment,
            postOverLayar,
            navigation,
            syncPost,
            syncPostDelete
        } = this.props;
        postOverLayar();
        const obj = await creatingComment(clubKey, postKey, content);
        if (obj != null) {
            //貼文同步
            syncPost(obj);
            postOverLayar();
            //清空輸入欄
            // this.setState({ content: "" });
        }
        else {
            //刪除貼文同步
            syncPostDelete(postKey);
            Alert.alert("該貼文不存在！");
            postOverLayar();
            navigation.goBack();
        }
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.rowPaddingInput}>
                    <View style={styles.littleCircle}>
                        <Image
                            style={styles.littleHead}
                            source={{ uri: this.props.userPhotoUrl }}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.inputViewTabBar}>
                        <TextInput
                            style={styles.textInputTabBar}
                            placeholder='新增留言...'
                            placeholderTextColor='rgba(102,102,102,0.7)'
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                            onChangeText={content => { this.setState({ content }); }}
                        />
                    </View>
                    <TouchableOpacity onPress={async () => {
                        if (this.state.content != "") {
                            await this.addComment();
                        }
                        else {
                            Alert.alert("請輸入內容！");
                        }
                    }}>
                        <Image source={require('../../images/send.png')}
                            style={styles.sendIcon} />
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}

export default CommentInput;