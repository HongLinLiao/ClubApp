import React from 'react';
import { Dimensions, View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image, RefreshControl, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../styles/home/ActivityListElement'
const Dimensionsss = require('Dimensions');
const { width, height, scale } = Dimensions.get('window');
{
    //     const cols = 3; 
    // const cellWH = 100; 
    // const vMargin = (screenW - cellWH * cols) / (cols + 1); 
}



const ActivityListElement = ({ activity, activityList, navigation, setActivityList, setActivityFavorite, getInsideActivity, parentOverLayer }) => {


    async function pressFavorite(activity) {
        parentOverLayer();
        const activityData = await setActivityFavorite(activity.clubKey, activity.activityKey);
        parentOverLayer();
        if (activityData != null) {
            //放進首頁
            const newActivityList = JSON.parse(JSON.stringify(activityList));
            newActivityList[activityData.clubKey][activityData.activityKey] = activityData;
            setActivityList(newActivityList);
        }
    }

    async function insideActivity(activity) {
        parentOverLayer();
        const activityData = await getInsideActivity(activity.clubKey, activity.activityKey);
        parentOverLayer();
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

        
                <TouchableOpacity style={styles.posterView}
                    onPress={async () => { await insideActivity(activity); }}>
                    <ImageBackground source={{ uri: activity.photo }}
                        resizeMode='cover'
                        style={styles.poster}>

                        <View style={styles.black}>
                            <View style={styles.actTextView}>
                                <Text style={styles.actText}>{activity.title}</Text>
                            </View>

                            <View style={styles.clubTextView}>
                                <Text style={styles.clubText}>{activity.schoolName}{activity.clubName}</Text>
                            </View>
                            {
                                // <View style={styles.clubTextView}>
                                //     <Text style={styles.clubText}>{activity.clubName}</Text>
                                // </View>
                            }
                            <Image source={{ uri: activity.posterPhotoUrl }}
                                resizeMode='cover'
                                style={styles.clubImage}
                                imageStyle={styles.clubImage}
                            />
                            <TouchableOpacity style={styles.heartView}
                                onPress={async () => { await pressFavorite(activity); }}>
                                <Text style={styles.heartText}>{activity.numFavorites}</Text>
                                <Image
                                    style={styles.likeIcon}
                                    source={activity.statusFavorite ? require("../../images/like-orange.png") : require("../../images/like-gray.png")}
                                />
                            </TouchableOpacity>
                        </View>

                    </ImageBackground>
                </TouchableOpacity>

        


    );

};

export default ActivityListElement;

