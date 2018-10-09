import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';

const ActivityListElement = ({ activity, activityList, navigation, setActivityList, setActivityFavorite, getInsideActivity }) => {

    async function pressFavorite(activity) {
        const activityData = await setActivityFavorite(activity.clubKey, activity.activityKey);
        if (activityData != null) {
            //放進首頁
            const newActivityList = JSON.parse(JSON.stringify(activityList));
            newActivityList[activityData.clubKey][activityData.activityKey] = activityData;
            setActivityList(newActivityList);
        }
    }

    async function insideActivity(activity) {
        const activityData = await getInsideActivity(activity.clubKey, activity.activityKey);
        if (activityData != null) {
            //放進首頁
            const newActivityList = JSON.parse(JSON.stringify(activityList));
            newActivityList[activityData.clubKey][activityData.activityKey] = activityData;
            setActivityList(newActivityList);

            navigation.navigate('Activity', {
                activity: activityData,
                setActivityList: setActivityList,
                activityList: activityList,
            });
        }
    }

    return (
        <TouchableOpacity onPress={async () => { await insideActivity(activity); }}>
            <Image source={{ uri: activity.photo }}
                resizeMode='cover'
                style={{ width: 50, height: 50 }} />
            <Text>{activity.title}</Text>
            <Text>{activity.schoolName}</Text>
            <Text>{activity.clubName}</Text>
            <TouchableOpacity onPress={async () => { await pressFavorite(activity); }}>
                <Text>{activity.numFavorites}</Text>
            </TouchableOpacity>
            <Image source={{ uri: activity.posterPhotoUrl }}
                resizeMode='cover'
                style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
    );
};

export default ActivityListElement;