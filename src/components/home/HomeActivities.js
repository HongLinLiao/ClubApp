import React from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { Button } from 'react-native-elements'
import ActivityListElement from '../activity/ActivityListElement';
import Overlayer from '../common/Overlayer'
import Masonry from 'react-native-masonry-layout'

class HomeActivities extends React.Component {

    async componentDidMount() {
        await this.activityReload();
    }

    state = {
        activity: {},
        loading: false,
        refreshing: false,
    }

    //頁面重整
    activityReload = async () => {
        const { getHomeActivityReload } = this.props;
        this.homeOverLayar();
        await getHomeActivityReload((newActivityList) => { this.setState({ activity: newActivityList }) });
        this.homeOverLayar();
    }

    //重整動畫
    onRefresh = () => {
        this.setState({ refreshing: true });
        this.setState({ refreshing: false });
        this.activityReload();
    }

    //過門
    homeOverLayar = () => {
        this.setState({ loading: !this.state.loading });
    }

    setActivityList = (activityList) => {
        this.setState({ activity: activityList });
    }

    render() {
        const newActivityList = { ...this.state.activity };
  
        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    <Button
                        title='reload!'
                        onPress={async () => {
                            await this.activityReload();
                        }}
                    />
                    {
                        Object.values(newActivityList).map((clubElement) => (
                            Object.values(clubElement).map((activityElement) => (
                                <ActivityListElement
                                    key={activityElement.activityKey}
                                    activity={activityElement}
                                    activityList={this.state.activity}
                                    navigation={this.props.navigation}
                                    setActivityList={this.setActivityList}
                                    setActivityFavorite={this.props.setActivityFavorite}
                                    getInsideActivity={this.props.getInsideActivity}
                                    parentOverLayer={this.homeOverLayar}
                                />
                            ))
                        ))
                    }
                </ScrollView>
                {this.state.loading ? <Overlayer /> : null}
            </View >
        );
    }
}

export default HomeActivities