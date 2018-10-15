import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { Button } from 'react-native-elements';

class Activity extends React.Component {

    //寫入本地State
    async componentWillMount() {
        this.setState({ activity: this.props.activity });
    }

    state = {
        activity: {},
    }

    //設定本頁activity
    setActivity = (activityData) => {
        this.setState({ activity: activityData });
    };

    //點讚
    pressFavorite = async (clubKey, activityKey) => {
        const { setActivityFavorite, activityList, setActivityList } = this.props;
        const activityData = await setActivityFavorite(clubKey, activityKey);
        if (activityData != null) {
            //放進activityList
            const newActivityList = JSON.parse(JSON.stringify(activityList));
            newActivityList[activityData.clubKey][activityData.activityKey] = activityData;
            setActivityList(newActivityList);
            this.setState({ activity: activityData });
        }
    };

    //點擊收藏
    pressKeep = async (activity) => {
        const { setActivityKeep, activityList, setActivityList } = this.props;
        const activityData = await setActivityKeep(activity.clubKey, activity.activityKey);
        if (activityData != null) {
            //放進activityList
            const newActivityList = JSON.parse(JSON.stringify(activityList));
            newActivityList[activityData.clubKey][activityData.activityKey] = activityData;
            setActivityList(newActivityList);
            this.setState({ activity: activityData });
        }
    }

    //頁面重整
    reload = async (clubKey, activityKey) => {
        const { getInsideActivity, navigation, activityList, setActivityList } = this.props;
        const newActivity = await getInsideActivity(clubKey, activityKey);
        const newActivityList = JSON.parse(JSON.stringify(activityList));
        if (newActivity == null) {
            newActivityList[clubKey][activityKey] = null;
            delete newActivityList[clubKey][activityKey];
            setActivityList(newActivityList);
            navigation.goBack();
        } else {
            newActivityList[clubKey][activityKey] = newActivity;
            setActivityList(newActivityList);
            this.setState({ activity: newActivity  });
        }
    };

    render() {
        const activityData = this.state.activity;
        const element = JSON.parse(JSON.stringify(activityData));

        return (
            <ScrollView>
                <Button
                    title="reload"
                    onPress={async () => {
                        await this.reload(element.clubKey, element.activityKey);
                    }}
                />
                <Image
                    source={{ uri: element.photo }}
                    resizeMode='cover'
                    style={{ width: 50, height: 50 }}
                />
                <TouchableOpacity
                    onPress={async () => { await this.pressKeep(element); }}
                >
                    <Text>收藏狀態: {element.statusKeep.toString()}</Text>
                </TouchableOpacity>
                <Text>{element.schoolName}</Text>
                <Text>{element.clubName}</Text>
                <Text>標題： {element.title}</Text>
                <Text>活動開始時間： {element.startDateTime}</Text>
                <Text>活動結束時間： {element.endDateTime}</Text>
                <Text>費用： {element.price}</Text>
                <Text>地點： {element.place}</Text>
                <TouchableOpacity
                    onPress={async () =>
                        await this.pressFavorite(element.clubKey, element.activityKey)
                    }
                >
                    <Text>按讚人數: {element.numFavorites}</Text>
                </TouchableOpacity>
                <Text>{element.content}</Text>
                <Text>{element.remarks}</Text>
            </ScrollView>
        )
    }
}

export default Activity;