import React from 'react'
import { View, ScrollView, RefreshControl, Image, Text } from 'react-native'
import ActivityListElement from '../activity/ActivityListElement';
import Overlayer from '../common/Overlayer'
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import { getUserData, getClubData } from '../../modules/Data'
import UserListDialog from '../common/UserListDialog'
import UserDialog from '../common/UserDialog'


const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class HomeActivities extends React.Component {

    state = {
        init: true,
        activity: [],
        loading: false,
        refreshing: false,
        userData: { uid: null, user: null, clubs: null },
        userList: { keyList: {}, dataList: [], classification: '' },
    }

    async componentDidMount() {
        const { initSetActivityList, navigation } = this.props;
        this.homeOverLayar();
        await initSetActivityList(newActivityList => { this.setState({ activity: newActivityList }); }, navigation);
        this.homeOverLayar();
        await this.activityReload();
        this.setState({ init: false });
    }

    //過門
    homeOverLayar = () => {
        this.setState({ loading: !this.state.loading });
    }

    //頁面重整
    activityReload = async () => {
        const { getHomeActivityReload, navigation } = this.props;
        this.homeOverLayar();
        await getHomeActivityReload(navigation);
        this.homeOverLayar();
    }

    //重整動畫
    onRefresh = () => {
        try {
            this.setState({ refreshing: true });
            this.setState({ refreshing: false });
            this.activityReload();
        } catch (error) {
            console.log(error.toString());
        }
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

        let newActivityList = this.state.activity.slice();
        let tempActivityList = [];
        //移除沒有收藏的社團
        newActivityList.map((child, index) => {
            Object.keys(child).map((value) => {
                if (child[Object.keys(child)[0]].statusKeep == true) {
                    tempActivityList.push(child);
                }
            })
        });

        if (this.state.init) {
            return (
                <View style={{ flex: 1 }}>
                    {this.state.loading ? <Overlayer /> : null}
                </View>
            );
        }
        else if (tempActivityList.length == 0) {
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
                                <Text style={{ color: "#666666", fontSize: 15 }}>你目前沒有收藏活動唷</Text>
                                <Text style={{ color: "#666666", fontSize: 15 }}>試試往下拉重整或是去搜尋喜歡的社團</Text>
                            </View>
                        </View>
                    </ScrollView>
                    {this.state.loading ? <Overlayer /> : null}
                </View>
            )
        }
        else {
            //處理排版
            let flexActivity = [];
            let temp = [];
            let tempNum;
            //產生二維陣列
            for (let i = 0; i < Math.ceil(tempActivityList.length / 3); i++) {
                //清空每階層暫存
                temp = [];
                for (let j = 0; j < 3; j++) {
                    tempNum = i * 3 + j;
                    if (tempActivityList[tempNum]) {
                        temp[j] = tempActivityList[tempNum];
                    }
                }
                if (temp.length > 0) {
                    flexActivity[i] = temp.slice();
                }
            }
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this.onRefresh()}
                                tintColor='#f6b456'
                            />
                        }
                    >
                        {
                            flexActivity.map((valueParent, index) => (
                                <View style={{ flexDirection: 'row' }} key={index}>
                                    {
                                        valueParent.map((value) => (
                                            Object.values(value).map((activity) => (
                                                <ActivityListElement
                                                    key={activity.activityKey}
                                                    showUserList={this.showUserList.bind(this)}
                                                    showUser={this.showUser.bind(this)}
                                                    activity={activity}
                                                    navigation={this.props.navigation}
                                                    getInsideActivity={this.props.getInsideActivity}
                                                    setActivityFavorite={this.props.setActivityFavorite}
                                                    parentOverLayor={this.homeOverLayar}
                                                    syncActivity={this.props.syncActivity}
                                                    syncActivityDelete={this.props.syncActivityDelete}
                                                    syncActivityBack={this.props.syncActivityBack}
                                                >
                                                </ActivityListElement>
                                            ))
                                        ))
                                    }
                                </View>
                            ))
                        }
                    </ScrollView>
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
                </View >
            );
        }
    }
}

export default HomeActivities