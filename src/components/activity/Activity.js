import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert, TextInput, Switch } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Button } from 'react-native-elements';
import { takePhoto, selectPhoto } from '../../modules/Common'
import styles from '../../styles/club/Activities'
import MapView, { Marker } from 'react-native-maps'
import { showLocation } from 'react-native-map-link'
import { Location, DangerZone } from 'expo'
import Overlayer from '../common/Overlayer'
import Modal from 'react-native-modalbox';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import PlaceDialog from '../common/PlaceDialog';
import { autocompletePlace, geocodingPlaceId, test } from '../../modules/Api'
import { convertDateFormat } from '../../modules/Common'

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class Activity extends React.Component {

    //寫入本地State
    async componentWillMount() {
        const { initSetActivity, navigation, initActivityToReducer, syncActivity } = this.props;
        initSetActivity((obj) => { this.setState({ activity: obj.activity }); }, navigation);
        initActivityToReducer({ activity: this.props.activity }, navigation);
        //活動同步
        syncActivity({ activity: this.props.activity });
        this.setState({
            activity: this.props.activity,
            title: this.props.activity.title,
            open: this.props.activity.open,
            startDateTime: this.props.activity.startDateTime,
            endDateTime: this.props.activity.endDateTime,
            price: this.props.activity.price,
            content: this.props.activity.content,
            remarks: this.props.activity.remarks,
            newImg: this.props.activity.photo,
            place: this.props.activity.place,
            location: this.props.activity.location,
        });
    }

    state = {
        activity: {},
        region: null,
        loading: false,
        refreshing: false,

        editLoading: false,
        location: null,
        tempPlace: '',
        showMap: false,
        showDatePicker: false,
        newRegion: null,
        title: '',
        place: '',
        open: false,
        startDateTime: '',
        endDateTime: '',
        price: '',
        content: '',
        remarks: '',
        newImg: [],//新增照片
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

    //刪除活動
    deleteActivity = async (clubKey, activityKey) => {
        const { deletingActivity, navigation, syncActivityDelete } = this.props;
        this.activityOverLayar();
        const obj = await deletingActivity(clubKey, activityKey);
        //刪除活動同步
        syncActivityDelete(activityKey);
        if (obj.status) {
            Alert.alert("成功刪除！");
            this.activityOverLayar();
        }
        else {
            Alert.alert("該活動不存在！");
            this.activityOverLayar();
        }
        const syncActivityBack = navigation.state.params.syncActivityBack;
        const routeName = navigation.state.routeName;
        await syncActivityBack(routeName);
        navigation.goBack();
    };

    //參加
    pressJoin = async (clubKey, activityKey) => {
        const { setActivityJoin, syncActivity, syncActivityDelete, navigation } = this.props;
        this.activityOverLayar();
        let obj = await setActivityJoin(clubKey, activityKey);
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
            Alert.alert("該活動不存在！");
            this.activityOverLayar();
            navigation.goBack();
        }
    };

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
            Alert.alert("該活動不存在！");
            this.activityOverLayar();
            navigation.goBack();
        }
    }

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
            Alert.alert("該活動不存在！");
            this.activityOverLayar();
            navigation.goBack();
        }
    };

    setDateTime = (date) => {
        if (this.state.datePickerId == 0) {
            this.setState({
                startDateTime: date,
                showDatePicker: false
            })
        } else { // 1
            this.setState({
                endDateTime: date,
                showDatePicker: false
            })
        }
    }

    getDateTime = () => {
        const { startDateTime, endDateTime } = this.state
        const dateArray = [startDateTime, endDateTime]
        let result = []
        dateArray.map(
            (item, index) => {
                if (dateArray[index + 1]) {
                    if (new Date(dateArray[index]) > new Date(dateArray[index + 1])) {
                        dateArray[index + 1] = dateArray[index];
                    }
                }
                let date = new Date(item).toUTCString();
                date = convertDateFormat(date);
                // let day = date.toLocaleDateString()
                // let time = date.getHours() + ':' + date.getMinutes()
                result.push(date)
            }
        )

        return result
    }

    resetProps = () => {
        this.setState({
            showMap: false,
            title: this.props.activity.title,
            open: this.props.activity.open,
            startDateTime: this.props.activity.startDateTime,
            endDateTime: this.props.activity.endDateTime,
            price: this.props.activity.price,
            content: this.props.activity.content,
            remarks: this.props.activity.remarks,
            newImg: this.props.activity.photo,
            place: this.props.activity.place,
            location: this.props.activity.location,
            tempPlace: '',
            newRegion: null
        });
    }

    setPlace = async (place_id) => {
        try {
            this.setState({ loading: true })
            const result = await geocodingPlaceId(place_id)
            const { formatted_address, geometry } = result.results[0]
            const { location } = geometry
            const region = {
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: 0.003, //經度縮放比例
                longitudeDelta: 0.003, //緯度縮放比例
            }
            this.setState({
                place: formatted_address,
                tempPlace: formatted_address,
                location: region,
                newRegion: region,
                loading: false,
                showMap: true
            })

            this.popupDialog.dismiss()

        } catch (e) {
            Alert.alert(e.toString())
        }
    }

    //開啟相機
    handleTakePhoto = async () => {
        try {
            const url = await takePhoto()
            if (url) {
                this.setState({
                    newImg: url,
                })
            } else {
                Alert.alert('取消')
            }
        } catch (e) {
            console.log(e)
            Alert.alert('發生錯誤')
        }
    }

    //開啟相簿
    handleSelectPhoto = async () => {
        try {
            const url = await selectPhoto()
            if (url) {
                this.setState({
                    newImg: url,
                })
            } else {
                Alert.alert('取消')
            }
        } catch (e) {
            console.log(e)
            Alert.alert('發生錯誤')
        }
    }

    //過門
    activityOverLayar = () => {
        this.setState({ loading: !this.state.loading });
    }

    editOverLayar = () => {
        this.setState({ editLoading: !this.state.editLoading });
    }

    //編輯活動
    editActivity = async () => {

        const { editingActivity, syncActivity, syncActivityDelete, navigation } = this.props;
        let obj;

        let newObj = {};
        if (this.state.newImg != this.props.activity.photo) {
            newObj.photo = this.state.newImg;
        }
        if (this.state.title != this.props.activity.title) {
            newObj.title = this.state.title;
        }
        if (this.state.open != this.props.activity.open) {
            newObj.open = this.state.open;
        }
        if (this.state.startDateTime != this.props.activity.startDateTime) {
            newObj.startDateTime = new Date(this.state.startDateTime).toUTCString();
        }
        if (this.state.endDateTime != this.props.activity.endDateTime) {
            newObj.endDateTime = new Date(this.state.endDateTime).toUTCString();
        }
        if (this.state.price != this.props.activity.price) {
            newObj.price = parseInt(this.state.price);
        }
        if (this.state.place != this.props.activity.place) {
            newObj.place = this.state.place;
            if (this.state.region != null) {
                newObj.location = this.state.region;
            }
            else {
                newObj.location = false;
            }
        }
        if (this.state.content != this.props.activity.content) {
            newObj.content = this.state.content;
        }
        if (this.state.remarks != this.props.activity.remarks) {
            newObj.remarks = this.state.remarks;
        }

        if (Object.keys(newObj).length > 0) {
            this.editOverLayar();
            obj = await editingActivity(this.state.activity.clubKey, this.state.activity.activityKey, newObj);
            if (obj != null) {
                //活動同步
                await syncActivity(obj);
                this.setState({
                    title: this.props.activity.title,
                    open: this.props.activity.open,
                    startDateTime: this.props.activity.startDateTime,
                    endDateTime: this.props.activity.endDateTime,
                    price: this.props.activity.price,
                    content: this.props.activity.content,
                    remarks: this.props.activity.remarks,
                    newImg: this.props.activity.photo,
                    place: this.props.activity.place,
                    location: this.props.activity.location,
                    editLoading: false
                })
                this.refs.editAdvanced.close();
                this.editOverLayar();
            }
            else {
                //刪除活動同步
                await syncActivityDelete(this.state.activity.activityKey);
                const syncActivityBack = navigation.state.params.syncActivityBack;
                const routeName = navigation.state.routeName;
                await syncActivityBack(routeName);
                Alert.alert("該活動不存在！");
                this.editOverLayar();
                this.refs.editAdvanced.close();
                navigation.goBack();
            }
        }
        else {
            Alert.alert('請做出更改！');
        }
    }



    render() {
        const dateArray = this.getDateTime()
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
                            </View>
                            <View style={[styles.clubTextView]}>
                                <Text style={styles.actText}>{element.title}</Text>
                            </View>
                        </View>

                        <View style={styles.advancedView} >
                            <TouchableOpacity onPress={async () =>
                                await this.pressJoin(element.clubKey, element.activityKey)}>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image
                                            style={styles.collect}
                                            source={element.statusJoin ? require("../../images/join-yellow.png") : require("../../images/join-gray.png")}
                                        />
                                        <Text style={{ marginTop: 13, marginLeft: 3, fontSize: 12, color: element.statusJoin ? "#f6b456" : "#666666" }}>{element.numJoins}</Text>
                                    </View>
                                    <Text style={[styles.advancedViewText, { color: element.statusJoin ? '#f6b456' : "#666666" }]}>參加</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={async () =>
                                await this.pressKeep(element)}>
                                <View>
                                    <Image
                                        style={styles.collect}
                                        source={element.statusKeep ? require("../../images/bookmark-yellow.png") : require("../../images/bookmark-gray.png")}
                                    />
                                    <Text style={[styles.advancedViewText, { color: element.statusKeep ? '#f6b456' : "#666666" }]}>收藏</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={async () =>
                                await this.pressFavorite(element.clubKey, element.activityKey)}>
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <Image
                                            style={styles.collect}
                                            source={element.statusFavorite ? require("../../images/like-orange.png") : require("../../images/like-deepGray.png")}
                                        />
                                        <Text style={{ marginTop: 13, fontSize: 12, color: element.statusFavorite ? "#f6b456" : "#666666" }}>{element.numFavorites}</Text>
                                    </View>
                                    <Text style={[styles.advancedViewText, { color: element.statusFavorite ? '#f6b456' : "#666666" }]}>按讚</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={async () => {
                                this.refs.advancedActivity.open();
                            }}>
                                <View>
                                    <Image
                                        style={styles.collect}
                                        source={require("../../images/setting-gray.png")}
                                    />
                                    <Text style={[styles.advancedViewText, { color: "#666666" }]}>設定</Text>
                                </View>
                            </TouchableOpacity>
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
                            this.refs.advancedActivity.close();
                            this.refs.editAdvanced.open();
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
                                        await this.deleteActivity(this.state.activity.clubKey, this.state.activity.activityKey)
                                    }
                                },
                            ]);
                        }}
                        title="刪除活動"
                    />
                </Modal>

                {/* 編輯活動 */}
                <Modal backdropPressToClose={false} swipeToClose={false}
                    style={{ height: 550 }} position={"center"} ref={"editAdvanced"}>
                    <ScrollView>
                        {/* 照片 */}
                        <View style={{ height: 200, width: '100%' }} >
                            <TouchableOpacity
                                onPress={async () => {
                                    Alert.alert('選取照片', '', [
                                        { text: '相機', onPress: async () => { await this.handleTakePhoto(); } },
                                        { text: '相簿', onPress: async () => { await this.handleSelectPhoto(); } },
                                        { text: '取消', onPress: () => { } }
                                    ]);
                                }}
                            >
                                <Image
                                    source={{ uri: element.photo }}
                                    resizeMode='cover'
                                    style={{ height: 200, width: '100%' }} />
                            </TouchableOpacity>
                        </View>
                        {/* 活動名稱 */}
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={{ fontSize: 15, color: '#666666', marginTop: 13, marginLeft: 10, }}>名稱: </Text>
                            <TextInput
                                defaultValue={element.title}
                                style={{ fontSize: 22, fontWeight: 'bold', marginTop: 7, marginBottom: 7, color: '#666666', width: '80%', borderBottomWidth: 0.5, borderColor: 'rgba(102,102,102,0.5)' }}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(content) => this.setState({ title: content })}
                            />
                        </View>
                        {/* 開放控制 */}
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={{ fontSize: 15, color: '#666666', marginTop: 13, marginLeft: 10, }}>開放:  </Text>
                            <Switch
                                onTintColor={'rgba(246,180,86,1)'}
                                tintColor={'rgba(246,180,86,0.1)'}
                                thumbTintColor={'white'}
                                value={element.open}
                                onValueChange={() => this.setState({ open: !this.state.open })}
                            />
                        </View>
                        {/* 開始時間 */}
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={{ fontSize: 15, color: '#666666', marginTop: 13, marginLeft: 10, }}>開始時間: </Text>
                            <TouchableOpacity
                                onPress={() => this.setState({ showDatePicker: true, datePickerId: 0 })}>
                                <Text style={{ color: '#666666', fontSize: 20, marginTop: 8 }}>{dateArray[0]}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* 結束時間 */}
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={{ fontSize: 15, color: '#666666', marginTop: 13, marginLeft: 10, }}>結束時間: </Text>
                            <TouchableOpacity
                                onPress={() => this.setState({ showDatePicker: true, datePickerId: 1 })}>
                                <Text style={{ color: '#666666', fontSize: 20, marginTop: 8 }}>{dateArray[1]}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* 價錢 */}
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={{ fontSize: 15, color: '#666666', marginTop: 13, marginLeft: 10 }}>金額: </Text>
                            <TextInput
                                defaultValue={element.price.toString()}
                                style={{ fontSize: 20, marginTop: 8, color: '#666666', width: '80%', borderBottomWidth: 0.5, borderColor: 'rgba(102,102,102,0.5)' }}
                                underlineColorAndroid='transparent'
                                keyboardType='numeric'
                                onChangeText={price => this.setState({ price: price })}
                            />
                        </View>
                        {/* 位置 */}
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={{ fontSize: 15, color: '#666666', marginTop: 13, marginLeft: 10, }}>位置: </Text>
                            <TextInput
                                defaultValue={element.place}
                                style={{ fontSize: 20, marginTop: 8, color: '#666666', width: '70%' }}
                                underlineColorAndroid='transparent'
                                onChangeText={place => this.setState({ place: place })}
                            />
                        </View>
                        {/* GoogleMap */}
                        <View style={{ width: '100%' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10 }} onPress={() => this.popupDialog.show()}>
                                <Text style={{ color: '#0d4273', marginRight: 5 }}>搜尋地點</Text>
                                <Image source={require('../../images/search.png')} style={{ height: 15, width: 15 }} />
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.showMap ? (
                                <MapView
                                    style={{ height: 250, marginLeft: 20, marginTop: 10, marginRight: 20 }}
                                    region={this.state.newRegion}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: this.state.newRegion.latitude,
                                            longitude: this.state.newRegion.longitude,
                                            latitudeDelta: this.state.newRegion.latitudeDelta,
                                            longitudeDelta: this.state.newRegion.longitudeDelta
                                        }}
                                        title='你現在的位置'
                                        description='在此位置辦活動'
                                    />
                                </MapView>
                            ) : null
                        }


                        {/* 內容 */}
                        <View style={{ width: '100%' }}>
                            <Text style={{ fontSize: 15, color: '#666666', marginTop: 13, marginLeft: 10, }}>內容</Text>
                            <TextInput
                                defaultValue={element.content}
                                multiline={true}
                                style={{ fontSize: 15, marginTop: 5, color: '#666666', marginLeft: 10, marginRight: 10, borderBottomWidth: 0.5, borderColor: 'rgba(102,102,102,0.5)', }}
                                underlineColorAndroid='transparent'
                                onChangeText={content => this.setState({ content: content })}
                            />
                        </View>
                        {/* 備註 */}
                        <View style={{ width: '100%' }}>
                            <Text style={{ fontSize: 15, color: '#666666', marginTop: 13, marginLeft: 10, }}>備註</Text>
                            <TextInput
                                defaultValue={element.remarks}
                                multiline={true}
                                style={{ fontSize: 15, marginTop: 5, color: '#666666', marginLeft: 10, marginRight: 10, borderBottomWidth: 0.5, borderColor: 'rgba(102,102,102,0.5)', }}
                                underlineColorAndroid='transparent'
                                onChangeText={remarks => this.setState({ remarks: remarks })}
                            />
                        </View>

                    </ScrollView>

                    {/* 底部button */}
                    <View style={{ bottom: 10, alignItems: 'stretch', height: 50 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flex: 1 }}>
                            <Button
                                onPress={() => {
                                    Alert.alert('確定要離開嗎？', '', [
                                        { text: '取消', onPress: () => { } },
                                        {
                                            text: '確定', onPress: async () => {
                                                this.resetProps();
                                                this.refs.editAdvanced.close();
                                            }
                                        },
                                    ]);
                                }}
                                buttonStyle={{ backgroundColor: 'rgba(246,180,86,1)', width: 100, height: 30, borderColor: "transparent", borderWidth: 0, borderRadius: 30, }}
                                title="取消"
                                titleStyle={{ fontSize: 15, }}
                            />
                            <Button
                                onPress={async () => {
                                    Alert.alert('確定要修改嗎？', '', [
                                        { text: '取消', onPress: () => { } },
                                        {
                                            text: '確定', onPress: async () => {
                                                await this.editActivity();
                                            }
                                        },
                                    ]);
                                }}
                                buttonStyle={{ backgroundColor: 'rgba(246,180,86,1)', width: 100, height: 30, borderColor: "transparent", borderWidth: 0, borderRadius: 30, }}
                                title="確定"
                                titleStyle={{ fontSize: 15, }}
                            />
                        </View>
                    </View>
                    <DateTimePicker
                        isVisible={this.state.showDatePicker}
                        onConfirm={this.setDateTime}
                        onCancel={() => this.setState({ showDatePicker: false })}
                        mode='datetime'
                    />
                    <PopupDialog
                        ref={(popupDialog) => this.popupDialog = popupDialog}
                        dialogAnimation={slideAnimation}
                        width={0.9}
                        height={0.7}
                        dialogStyle={{ borderRadius: 10 }}
                    >
                        <PlaceDialog
                            setPlace={this.setPlace.bind(this)}
                        />

                    </PopupDialog>
                    {this.state.editLoading ? <Overlayer /> : null}
                </Modal>
                {this.state.loading ? <Overlayer /> : null}
            </View >
        )
    }
}

export default Activity;
