import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../styles/club/Activities'
import MapView, { Marker } from 'react-native-maps'
import { showLocation } from 'react-native-map-link'
import { Location, DangerZone } from 'expo'
class Activity extends React.Component {

    //寫入本地State
    async componentWillMount() {
        this.setState({ activity: this.props.activity });
    }

    state = {
        activity: {},
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
    }
    getUserLocation = async () => {
        let location = await Location.getCurrentPositionAsync();

        this.setState({
            region: {
                latitude: location.coords.latitude, //緯度
                longitude: location.coords.longitude, //經度
                latitudeDelta: 0.003, //經度縮放比例
                longitudeDelta: 0.003, //緯度縮放比例
            }
        })
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

    open = async () => {
        let location = await Location.getCurrentPositionAsync();
        console.log(location)
        showLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            // title: '活動地點',  // optional
            dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
            dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you li
            cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
            appsWhiteList: ['google-maps', 'apple-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
            app: 'google-maps'  // optionally specify specific app to use
        })
    }
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
            this.setState({ activity: newActivity });
        }
    };

    render() {
        const activityData = this.state.activity;
        const element = JSON.parse(JSON.stringify(activityData));

        return (
            <View style={[styles.container, { flex: 1 }]}>
                <ScrollView>
                    <Button
                        title="reload"
                        onPress={async () => {
                            await this.reload(element.clubKey, element.activityKey);
                        }}
                    />
                    <View style={styles.main}>
                        <View style={styles.clubBackground} >
                            <Image
                                source={{ uri: element.photo }}
                                resizeMode='cover'
                                style={styles.clubBackground} />
                        </View>
                    </View>
                    <View style={styles.main}>
                        <View style={styles.main}>
                            <View style={[styles.clubTextView, { flex: 1 }]}>
                                <Text style={styles.schoolText}>{element.schoolName}    {element.clubName}</Text>
                                <TouchableOpacity onPress={async () =>
                                        await this.pressKeep(element)}>
                                    <Image source={require('../../images/bookmark.png')}
                                        style={styles.collect} />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.clubTextView]}>
                                <Text style={styles.actText}>{element.title}</Text>
                                <TouchableOpacity style={styles.like}
                                    onPress={async () =>
                                        await this.pressFavorite(element.clubKey, element.activityKey)}>
                                    <Image
                                        style={styles.titleLikesView}
                                        source={element.numFavorites ? require("../../images/like-orange.png") : require("../../images/like-gray.png")}
                                    />
                                    <Text style={styles.number}>{element.numFavorites}</Text>
                                </TouchableOpacity>


                            </View>
                        </View>

                        <View style={styles.main}>
                            <View style={styles.summaryTextView}>
                                <Image source={require('../../images/calendar.png')}
                                    style={styles.icon} />
                                <Text style={[styles.summaryText, style = { marginRight: 1 }]}>{element.startDateTime}</Text>
                                <Text style={styles.toText}>~</Text>
                                <Text style={[styles.summaryText, style = { marginLeft: 1 }]}>{element.endDateTime}</Text>
                            </View>
                            <View style={styles.summaryTextView}>
                                <Image source={require('../../images/coin.png')}
                                    style={styles.icon} />
                                <Text style={styles.summaryText}>自行負擔</Text>
                            </View>
                            <View style={styles.summaryTextView}>
                                <Image source={require('../../images/place.png')}
                                    style={styles.icon} />
                                <Text style={styles.summaryText}>淡水捷運站一號出口</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.main}>
                        <MapView
                            style={{ height: 250, marginLeft: 20, marginTop: 10, marginRight: 20 }}
                            region={this.state.region}>
                            <Marker
                                coordinate={{
                                    latitude: this.state.region.latitude,
                                    longitude: this.state.region.longitude,
                                }}
                                title='你現在的位置'
                                description='在此位置辦活動'
                            />
                        </MapView>
                    </View>
                    <View style={styles.main}>
                        <View style={styles.divide}>
                            <Text style={styles.titleText}>活動內容</Text>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleContentText}>{element.content}
                            </Text>

                        </View>
                        <View style={styles.divide}>
                            <Text style={styles.titleText}>備註</Text>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleContentText}>{element.content}
                            </Text>

                        </View>
                    </View>
                    {
                        // <View style={styles.divideN}>
                        //     <Text style={styles.titleText}>你有興趣</Text>
                        //     <View style={styles.intrestView}>
                        //         <View style={styles.recommendView} />
                        //         <View style={styles.recommendView} />
                        //     </View>
                        //     <View style={styles.intrestView}>
                        //         <View style={styles.recommendView} />
                        //         <View style={styles.recommendView} />
                        //     </View>

                        // </View>
                    }
                </ScrollView>

            </View>
        )
    }
}

export default Activity;

{
    //     <ScrollView>
    //     <Image
    //         source={{ uri: element.photo }}
    //         resizeMode='cover'
    //         style={{ width: 50, height: 50 }}
    //     />
    //     <Text>{element.schoolName}</Text>
    //     <Text>{element.clubName}</Text>
    //     <Text>標題： {element.title}</Text>
    //     <Text>活動開始時間： {element.startDateTime}</Text>
    //     <Text>活動結束時間： {element.endDateTime}</Text>
    //     <Text>費用： {element.price}</Text>
    //     <Text>地點： {element.place}</Text>
    //     <TouchableOpacity
    //         onPress={async () =>
    //             await this.pressFavorite(element.clubKey, element.activityKey)
    //         }
    //     >
    //         <Text>按讚人數: {element.numFavorites}</Text>
    //     </TouchableOpacity>
    //     <Text>{element.content}</Text>
    //     <Text>{element.remarks}</Text>
    // </ScrollView>


}