import React from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import ActivityListElement from '../activity/ActivityListElement';
import Overlayer from '../common/Overlayer'

class HomeActivities extends React.Component {

    state = {
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
        let newActivityList = this.state.activity.slice();
        let tempActivityList = [];
        //移除沒有收藏的社團
        newActivityList.map((child, index) => {
            Object.keys(child).map((value)=>{
                if(child[Object.keys(child)[0]].statusKeep==true){
                    tempActivityList.push(child);
                }
            })
        });

        //處理排版
        let flexActivity = [];
        let temp = [];
        let tempNum;
        let num = tempActivityList.length; //總長度
        let height = Math.ceil(num / 3); //有幾列(無條件進位)
        //產生二維陣列
        for (let i = 0; i < height; i++) {
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

export default HomeActivities