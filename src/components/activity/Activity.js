import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../../styles/club/Activities'
import MapView, { Marker } from 'react-native-maps'
import { showLocation } from 'react-native-map-link'
import { Location, DangerZone } from 'expo'
import Overlayer from '../common/Overlayer'
import Modal from 'react-native-modalbox';

class Activity extends React.Component {

    //寫入本地State
    async componentWillMount() {
        const { initSetActivity, navigation, initActivityToReducer } = this.props;
        initSetActivity((obj) => { this.setState({ activity: obj.activity }); }, navigation);
        initActivityToReducer({ activity: this.props.activity }, navigation);
        this.setState({ activity: this.props.activity });
    }

    state = {
        activity: {},
        region: null,
        loading: false,
        refreshing: false,
    }

    onRefresh = () => {
        try {
            this.setState({ refreshing: true });
            this.setState({ refreshing: false });
            this.reload(this.state.activity.clubKey, this.state.activity.activityKey);
        } catch (error) {
            console.log(error.toString());
        }
    }

    //頁面重整
    reload = async (clubKey, activityKey) => {
        const { getInsideActivity, navigation, syncActivity, syncActivityDelete } = this.props;
        this.activityOverLayar();
        const obj = await getInsideActivity(clubKey, activityKey);
        this.activityOverLayar();
        if (obj != null) {
            //貼文同步
            syncActivity(obj);
        }
        else {
            //刪除貼文同步
            syncActivityDelete(activityKey);
            const syncActivityBack = navigation.state.params.syncActivityBack;
            const routeName = navigation.state.routeName;
            await syncActivityBack(routeName);
            Alert.alert("該活動不存在！");
            navigation.goBack();
        }
    };

    //點讚
    pressFavorite = async (clubKey, activityKey) => {
        const { setActivityFavorite, syncActivity, syncActivityDelete, navigation } = this.props;
        this.activityOverLayar();
        let obj = await setActivityFavorite(clubKey, activityKey);
        if (obj != null) {
            //活動同步
            syncActivity(obj);
            this.activityOverLayar();
        }
        else {
            //刪除活動同步
            syncActivityDelete(activityKey);
            const syncActivityBack = navigation.state.params.syncActivityBack;
            const routeName = navigation.state.routeName;
            await syncActivityBack(routeName);
            Alert.alert("該貼文不存在！");
            this.activityOverLayar();
            navigation.goBack();
        }
    };

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
        const { setActivityKeep, syncActivity, syncActivityDelete, navigation } = this.props;
        this.activityOverLayar();
        let obj = await setActivityKeep(activity.clubKey, activity.activityKey);
        if (obj != null) {
            //活動同步
            syncActivity(obj);
            this.activityOverLayar();
        }
        else {
            //刪除活動同步
            syncActivityDelete(activityKey);
            const syncActivityBack = navigation.state.params.syncActivityBack;
            const routeName = navigation.state.routeName;
            await syncActivityBack(routeName);
            Alert.alert("該貼文不存在！");
            this.activityOverLayar();
            navigation.goBack();
        }
    }

    //過門
    activityOverLayar = () => {
        this.setState({ loading: !this.state.loading });
    }



    render() {
        const element = JSON.parse(JSON.stringify(this.state.activity));
        const { location } = element

        return (
            <View style={[styles.container]}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                            tintColor='#f6b456'
                        />
                    }
                >
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
                                    <Image
                                        style={styles.collect}
                                        source={element.statusKeep ? require("../../images/bookmark-yellow.png") : require("../../images/bookmark-gray.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.clubTextView]}>
                                <Text style={styles.actText}>{element.title}</Text>
                                <TouchableOpacity style={styles.like}
                                    onPress={async () =>
                                        await this.pressFavorite(element.clubKey, element.activityKey)}>
                                    <Image
                                        style={styles.titleLikesView}
                                        source={element.statusFavorite ? require("../../images/like-orange.png") : require("../../images/like-gray.png")}
                                    />
                                    <Text style=
                                        {[
                                            styles.number,
                                            { color: element.statusFavorite ? "#f6b456" : "#666666" }]}>{element.numFavorites}</Text>
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
                                <Text style={styles.summaryText}>{element.price}</Text>
                            </View>
                            <View style={styles.summaryTextView}>
                                <Image source={require('../../images/place.png')}
                                    style={styles.icon} />
                                <Text style={styles.summaryText}>{element.place}</Text>
                            </View>
                        </View>
                    </View>
                    {
                        location ? (
                            <MapView
                                style={{ height: 250, marginLeft: 20, marginTop: 10, marginRight: 20 }}
                                region={location}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: location.latitude,
                                        longitude: location.longitude,
                                        latitudeDelta: location.latitudeDelta,
                                        longitudeDelta: location.longitudeDelta
                                    }}
                                    title='你現在的位置'
                                    description='在此位置辦活動'
                                />
                            </MapView>
                        ) : null
                    }

                    <View style={styles.main}>
                        <View style={styles.divide}>
                            <Text style={styles.titleText}>活動內容</Text>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleContentText}>{element.content}
                            </Text>

                        </View>
                        <View style={styles.divide}>
                            <Text style={styles.titleText}>備註</Text>
                            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.titleContentText}>{element.remarks}
                            </Text>

                        </View>
                    </View>

                </ScrollView>

                {/* 進階活動 */}
                <Modal style={{ height: 200, justifyContent: 'center', alignItems: 'center' }} position={"bottom"} ref={"advancedActivity"}>
                    <Button
                        buttonStyle={[styles.advancedActivityBtn, { display: element.editStatus ? 'flex' : 'none' }]}
                        title="編輯活動"
                        onPress={() => {
                            // this.refs.advancedPost.close();
                            // this.refs.editPost.open();
                        }}
                    />
                    <Text></Text>
                    <Button
                        buttonStyle={[styles.advancedActivityBtn, { display: element.deleteStatus ? 'flex' : 'none' }]}
                        onPress={async () => {
                            Alert.alert('確定要刪除活動嗎？', '', [
                                { text: '取消', onPress: () => { } },
                                {
                                    text: '確定', onPress: async () => {
                                        this.refs.advancedActivity.close();
                                        // await this.deletePost(this.state.post.clubKey, this.state.post.postKey)
                                    }
                                },
                            ]);
                        }}
                        title="刪除活動"
                    />
                </Modal>
                {this.state.loading ? <Overlayer /> : null}
            </View>
        )
    }
}

export default Activity;
