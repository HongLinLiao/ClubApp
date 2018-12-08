import React from 'react'
import { ScrollView, Text, Alert, Image, TouchableOpacity, RefreshControl } from 'react-native'
import PostListElement from '../post/PostListElement'
import styles from '../../styles/home/Home'
import { View } from 'native-base';
import { getUserData, getClubData } from '../../modules/Data'
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import UserDialog from '../common/UserDialog'
import UserListDialog from '../common/UserListDialog'

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class Home extends React.Component {

    componentWillMount() {
        this.props.navigation.setParams({
            homeReload: this.homeReload.bind(this)
        })
        this.homeOverLayor();
    }

    async componentDidMount() {
        const { joinClub, likeClub, initHomeClubList, initSetPostList, navigation } = this.props;
        await initSetPostList(newPostList => { this.setState({ post: newPostList }); }, navigation);
        const homeClubList = await initHomeClubList(joinClub, likeClub);
        this.homeOverLayor();
        await this.homeReload(homeClubList);
        this.setState({ init: false });
    }

    state = {
        init: true,
        post: [],
        userData: { uid: null, user: null, clubs: null },
        userList: { keyList: {}, dataList: [], classification: '' },
        //遮罩
        loading: false,
        //重整
        refreshing: false,
    }

    //頁面重整
    homeReload = async (clubList) => {
        //開啟過門
        this.homeOverLayor();
        const { getHomePostReload, navigation } = this.props;
        await getHomePostReload(clubList, navigation);
        //關閉過門
        this.homeOverLayor();
    };

    //重整動畫
    onRefresh = async () => {
        try {
            const { clubList } = this.props;
            this.setState({ refreshing: true });
            this.setState({ refreshing: false });
            this.homeReload(clubList);
        } catch (error) {
            console.log(error.toString());
        }
    }

    //過門
    homeOverLayor = () => {
        this.setState({ loading: !this.state.loading })
    }

    showUser = async (uid) => {
        try {
            this.popupDialog.show(async () => {
                this.setState({ loading: true, userData: { uid: null, user: null, clubs: null } })
                const userData = { uid, user: {}, clubs: {} }
                const user = await getUserData(uid)

                if (user.joinClub) {
                    const promises = Object.keys(user.joinClub).map(async (cid) => {
                        const club = await getClubData(cid)
                        userData.clubs[cid] = club
                    })

                    await Promise.all(promises)
                }

                userData.user = user

                this.setState({ userData, loading: false })
            });
        } catch (e) {
            Alert.alert(e.toString())
        }

    }

    showUserList = async (userList, classification) => {
        try {
            this.userList.show(async () => {
                this.setState({ loading: true, userList: { keyList: userList, dataList: [], classification: '' } })

                let userData = [];
                let userKeyList = Object.keys(userList);
                if (userKeyList.length > 0) {
                    for (let i = 0; i < userKeyList.length; i++) {
                        let uid = userKeyList[i];
                        let user = await getUserData(uid);
                        if (user) {
                            let obj = {};
                            obj.nickName = user.nickName;
                            obj.photoUrl = user.photoUrl;
                            obj.uid = uid;
                            userData.push(obj);
                        }
                    }
                }
                this.setState({ userList: { keyList: userList, dataList: userData, classification: classification }, loading: false })
            });
        } catch (error) {
            Alert.alert(error.toString())
        }
    }

    render() {
        const newPostList = this.state.post.slice();
        const { uid, user, clubs } = this.state.userData;
        const { keyList, dataList, classification } = this.state.userList;

        let nickName;
        if (this.props.user) {
            if (this.props.user.displayName) {
                nickName = this.props.user.displayName;
            }
            else {
                nickName = "";
            }
        }
        else {
            nickName = "";
        }

        if (this.state.init) {
            return (
                <View style={{ flex: 1 }}>
                    {this.state.loading ? <Overlayer /> : null}
                </View>
            );
        }
        else if (this.state.post.length == 0) {
            return (
                <View style={{ backgroundColor: "#ffffff", flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ScrollView
                        contentContainerStyle={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.onRefresh()}
                                tintColor='#f6b456' />
                        }
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../images/notification.png')}
                                style={{ height: 50, width: 50 }} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ color: "#666666", fontSize: 15 }}>嗨 {nickName}</Text>
                                <Text style={{ color: "#666666", fontSize: 15 }}>你的社團目前沒有貼文可以顯示唷</Text>
                                <Text style={{ color: "#666666", fontSize: 15 }}>試試往下拉重整或是去搜尋喜歡的社團</Text>
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.star}
                        onPress={() => { this.props.navigation.navigate('Stories', { syncSearchActivityBack: this.props.syncSearchActivityBack }); }}>
                        <View style={styles.starButtonView}>
                            <Image source={require('../../images/images2/star.png')}
                                style={styles.starImage} />
                        </View>
                    </TouchableOpacity>
                    {this.state.loading ? <Overlayer /> : null}
                </View>
            )
        }
        else {
            return (
                <View style={{ backgroundColor: "#ffffff", flex: 1 }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.onRefresh()}
                                tintColor='#f6b456'
                            />
                        }
                    >
                        <View style={styles.containView}>
                            {
                                newPostList.map((postElement) => (
                                    Object.values(postElement).map((post) => (
                                        <PostListElement
                                            key={post.postKey}
                                            post={post}
                                            navigation={this.props.navigation}
                                            getInsidePost={this.props.getInsidePost}
                                            setPostFavorite={this.props.setPostFavorite}
                                            showUserList={this.showUserList.bind(this)}
                                            showUser={this.showUser.bind(this)}
                                            parentOverLayor={this.homeOverLayor}
                                            syncPost={this.props.syncPost}
                                            syncPostDelete={this.props.syncPostDelete}
                                            syncPostBack={this.props.syncPostBack}
                                        >
                                        </PostListElement>
                                    ))
                                ))
                            }
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.star}
                        onPress={() => { this.props.navigation.navigate('Stories', { syncSearchActivityBack: this.props.syncSearchActivityBack }); }}>
                        <View style={styles.starButtonView}>
                            <Image source={require('../../images/images2/star.png')}
                                style={styles.starImage} />
                        </View>
                    </TouchableOpacity>

                    {/* 顯示單一user */}
                    <PopupDialog
                        ref={(popupDialog) => this.popupDialog = popupDialog}
                        dialogAnimation={slideAnimation}
                        width={0.7}
                        height={0.7}
                        dialogStyle={{ borderRadius: 20 }}
                    >
                        <UserDialog
                            uid={uid}
                            user={user}
                            clubs={clubs}
                            loading={this.state.loading}
                        />
                    </PopupDialog>

                    {/* user列表 */}
                    <PopupDialog
                        ref={(userList) => this.userList = userList}
                        dialogAnimation={slideAnimation}
                        width={0.75}
                        height={0.7}
                        dialogStyle={{ borderRadius: 20 }}
                    >
                        <UserListDialog
                            keyList={keyList}
                            dataList={dataList}
                            loading={this.state.loading}
                            showUser={this.showUser.bind(this)}
                            closeList={() => { this.userList.dismiss(); }}
                            classification={classification}
                        />
                    </PopupDialog>
                    {this.state.loading ? <Overlayer /> : null}
                </View>
            );
        }
    }
}

export default Home;
