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

    render() {
        const activityData = this.state.activity;
        const element = JSON.parse(JSON.stringify(activityData));
        console.log(element);

        return (
            <ScrollView>
                <Image
                    source={{ uri: element.photo }}
                    resizeMode='cover'
                    style={{ width: 50, height: 50 }}
                />
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