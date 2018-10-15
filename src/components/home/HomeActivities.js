import React from 'react'
import { ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import ActivityListElement from '../activity/ActivityListElement';

class HomeActivities extends React.Component {

    async componentDidMount() {
        await this.activityReload();
    }

    state = {
        activity: {}
    }

    //頁面重整
    activityReload = async () => {
        const { getHomeActivityReload } = this.props;
        await getHomeActivityReload((newActivityList) => { this.setState({ activity: newActivityList }) });
    }

    setActivityList = (activityList) => {
        this.setState({ activity: activityList });
    }

    render() {
        const newActivityList = { ...this.state.activity };
        return (
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
                            />
                        ))
                    ))
                }
            </ScrollView>
        );
    }
}

export default HomeActivities