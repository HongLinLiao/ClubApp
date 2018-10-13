import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../styles/club/Activities'
import MapView, { Marker } from 'react-native-maps'
import { showLocation } from 'react-native-map-link'
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
    render() {
        const activityData = this.state.activity;
        const element = JSON.parse(JSON.stringify(activityData));
        console.log(element);

        return (
            <View style={styles.container}>
                <View style={styles.headView}>
                    <View style={styles.arrowView}>
                        <TouchableOpacity>
                            <Image source={require('../../images/arrowLeft.png')}
                                style={styles.arrow} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headText}>{element.title}</Text>
                    <View style={styles.fake} />


                </View>

                <ScrollView>
                    <View style={styles.clubBackground} >
                        <Image
                            source={{ uri: element.photo }}
                            resizeMode='cover'
                            style={styles.clubBackground} />
                    </View>

                    <View style={styles.clubTextView}>
                        <Text style={styles.clubText}>{element.schoolName}</Text>
                        <Text style={styles.clubText}>{element.clubName}</Text>
                        <TouchableOpacity>

                            <Image source={require('../../images/bookmark.png')}
                                style={styles.collect} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.actText}>{element.title}</Text>
                    <TouchableOpacity onPress={async () =>
                        await this.pressFavorite(element.clubKey, element.activityKey)}>
                        <Image source={require('../../images/like-gray.png')}
                            style={styles.collect} />
                            <Text style={styles.summaryText}>{element.numFavorites}</Text>
                    </TouchableOpacity>

                    <View style={styles.summaryTextView}>
                        <Image source={require('../../images/calendar.png')}
                            style={styles.icon} />
                        <Text style={styles.summaryText}>{element.startDateTime}</Text>
                        <Text style={styles.toText}>~</Text>
                        <Text style={styles.summaryText}>{element.endDateTime}</Text>
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