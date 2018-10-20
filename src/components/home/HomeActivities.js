import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import ActivityListElement from '../activity/ActivityListElement';
import Overlayer from '../common/Overlayer'

class HomeActivities extends React.Component {

    async componentDidMount() {
        await this.activityReload();
    }

    state = {
        activity: {},
        loading: false,
    }

    homeOverLayar = () => {
        this.setState({ loading: !this.state.loading });
    }

    //頁面重整
    activityReload = async () => {
        const { getHomeActivityReload } = this.props;
        this.homeOverLayar();
        await getHomeActivityReload((newActivityList) => { this.setState({ activity: newActivityList }) });
        this.homeOverLayar();
    }

    setActivityList = (activityList) => {
        this.setState({ activity: activityList });
    }

    render() {
        const newActivityList = { ...this.state.activity };
        return (
            <View>
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
            </View>
        );
    }
}

export default HomeActivities