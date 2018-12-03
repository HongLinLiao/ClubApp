import React from 'react'
import { View, ScrollView, RefreshControl, Image, Text } from 'react-native'
import ActivityListElement from '../activity/ActivityListElement';
import Overlayer from '../common/Overlayer'

class HomeActivities extends React.Component {

    state = {
        init: true,
        activity: [],
        loading: false,
        refreshing: false,
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

    render() {
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
                    {this.state.loading ? <Overlayer /> : null}
                </View >
            );
        }
    }
}

export default HomeActivities