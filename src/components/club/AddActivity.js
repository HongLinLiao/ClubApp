import React from 'react'
import {
    View,
    TextInput,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Image,
    Alert,
    Button,
} from 'react-native'

import { Location } from 'expo'
import MapView, { Marker } from 'react-native-maps'
import { showLocation } from 'react-native-map-link'
import DateTimePicker from 'react-native-modal-datetime-picker';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import UserDialog from '../common/UserDialog'

import { selectPhoto } from '../../modules/Common'
import { autocompletePlace, geocodingPlaceId, test } from '../../modules/Api'
import Overlayer from '../common/Overlayer'
import styles from '../../styles/club/AddActivity'
import PlaceDialog from '../common/PlaceDialog';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

class AddActivity extends React.Component {

    state = {
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        showMap: false,
        showDatePicker: false,
        datePickerId: 0, // 0 or 1 設定開始跟結束
        loading: false,
        tempPlace: '',

        title: '',
        content: '',
        remarks: '',
        startDateTime: '',
        endDateTime: '',
        price: '',
        location: null,
        place: '',
        photo: null,
        open: true,
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

    pickPicture = async () => {
        try {
            const url = await selectPhoto()
            if (url) {
                this.setState({ photo: url })
            } else {
                Alert.alert('取消選擇照片')
            }
        } catch (e) {
            Alert.alert('發生錯誤！')
        }
    }

    setPlace = async (place_id) => {
        try {
            this.setState({ loading: true, showMap: true })
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
                region: region,
                loading: false
            })

            this.popupDialog.dismiss()

        } catch (e) {
            Alert.alert(e.toString())
        }
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
                let date = new Date(item)
                let day = date.toLocaleDateString()
                let time = date.getHours() + ':' + date.getMinutes()
                result.push(day + ' ' + time)
            }
        )

        return result
    }

    checkFormAllDone = () => {
        const { title, content, remarks, photo, startDateTime, endDateTime, place, price, open } = this.state
        if (title == '') {
            Alert.alert('請輸入title')
            return false
        }
        if (content == '') {
            Alert.alert('請輸入content')
            return false
        }
        if (!photo) {
            Alert.alert('必須上傳活動照片')
            return false
        }
        if (startDateTime == '') {
            Alert.alert('請選擇開始日期')
            return false
        }
        if (endDateTime == '') {
            Alert.alert('請選擇結束日期')
            return false
        }
        if (place == '') {
            Alert.alert('請輸入活動地點')
            return false
        }
        if (price == '') {
            Alert.alert('請輸入活動花費')
            return false
        }

        return true
    }

    askCreate = async () => {

        const { joinClubs, currentCid } = this.props
        const { schoolName, clubName } = joinClubs[currentCid]

        if (this.checkFormAllDone()) {
            Alert.alert('建立活動', '您將建立 ' + this.state.title + ' 活動於 ' + schoolName + ' ' + clubName,
                [
                    { text: '取消', onPress: () => console.log('取消'), style: 'cancel' },
                    { text: '建立', onPress: () => this.createActivity() },
                ],
                { cancelable: false }
            )
        }

    }

    createActivity = async () => {
        try {
            const { createActivity, currentCid, joinClubs } = this.props
            const { title, content, remarks, photo, startDateTime, endDateTime, location, place, price, open } = this.state
            const activityData = { title, content, remarks, photo, startDateTime, endDateTime, location, place, price, open }

            this.setState({ loading: true })
            await createActivity(currentCid, activityData, joinClubs[currentCid])
            const refresh = this.props.navigation.state.params.onRefresh;
            await refresh(currentCid);
            Alert.alert('活動已新增！')
            this.props.navigation.popToTop()

        } catch (e) {
            Alert.alert(e.toString())
        }
    }

    componentWillMount() {
        this.getUserLocation()
        this.props.navigation.setParams({
            askCreate: this.askCreate.bind(this)
        })
    }

    render() {
        const dateArray = this.getDateTime()
        const { user, joinClubs, currentCid } = this.props
        const { open, predictions, loading } = this.state
        const { schoolName, clubName, member } = joinClubs[currentCid]
        const { status } = member[user.uid]

        return (
            <KeyboardAvoidingView style={styles.container} behavior="position" keyboardVerticalOffset={64} enabled>
                <ScrollView>
                    <TouchableOpacity style={styles.image} onPress={this.pickPicture}>
                        {
                            this.state.photo ?
                                <Image source={{ uri: this.state.photo }}
                                    resizeMode='cover' style={{ height: 300, width: '100%' }}
                                />
                                : (
                                    <View>
                                        <Text style={[styles.title, style = {}]}>新增活動照片</Text>
                                        <Image source={require('../../images/graycamera.png')}
                                            style={[styles.graycamera, style = { marginLeft: 32, marginRight: 20, marginTop: 20, marginBottom: 20 }]}
                                        />
                                        <Text style={[styles.bigText, style = { marginLeft: 15 }]}>由本機上傳</Text>
                                    </View>
                                )

                        }
                    </TouchableOpacity>


                    <View style={styles.line}></View>

                    <View style={styles.main}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10, flex: 1 }}>
                            <View style={styles.nameView}>
                                <TextInput
                                    style={styles.nameInput}
                                    placeholder='活動名稱'
                                    placeholderTextColor='rgba(102,102,102,1)'
                                    underlineColorAndroid={'transparent'}
                                    multiline={false}
                                    onChangeText={title => this.setState({ title })}
                                />
                            </View>
                            <View style={[styles.row, { flex: 1, paddingTop: 10 }]}>
                                <Image source={require('../../images/calendar.png')}
                                    style={styles.calendarIcon} />
                                <View style={styles.littleTextView}>
                                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true, datePickerId: 0 })}>
                                        <Text style={styles.calenderText}>{this.state.startDateTime ? dateArray[0] : '請選擇開始時間'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.row, { flex: 1, paddingTop: 10 }]}>
                                <Text style={styles.toText}>~</Text>
                                <View style={styles.littleTextView}>
                                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true, datePickerId: 1 })}>
                                        <Text style={styles.calenderText}>{this.state.endDateTime ? dateArray[1] : '請選擇結束時間'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.row, { flex: 1, paddingTop: 10 }]}>
                            <Image source={require('../../images/coin.png')}
                                style={styles.calendarIcon} />
                            <View style={styles.littleTextView}>
                                <TextInput
                                    style={styles.littleText}
                                    placeholder='活動價錢'
                                    placeholderTextColor='rgba(102,102,102,0.5)'
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    onChangeText={price => this.setState({ price })}
                                />
                            </View>
                        </View>
                        <View style={[styles.row, { flex: 1 }]}>
                            <Image source={require('../../images/place.png')}
                                style={styles.calendarIcon} />
                            <View style={styles.littleTextView}>
                                <TextInput
                                    style={[styles.littleText]}
                                    placeholder='可以輸入活動地點'
                                    placeholderTextColor='rgba(102,102,102,0.5)'
                                    underlineColorAndroid='transparent'
                                    onChangeText={place => this.setState({ place })}
                                    defaultValue={this.state.tempPlace}
                                />
                            </View>
                        </View>
                        <View style={[styles.row, { flex: 1, paddingTop: 10 }]}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.popupDialog.show()}>
                                <Text style={{ color: '#0d4273', marginRight: 5 }}>搜尋地點</Text>
                                <Image source={require('../../images/search.png')} style={styles.searchIcon} />
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.showMap ? (
                                <MapView
                                    style={{ height: 250, marginLeft: 20, marginTop: 10, marginRight: 20 }}
                                    region={this.state.region}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: this.state.region.latitude,
                                            longitude: this.state.region.longitude,
                                            latitudeDelta: this.state.region.latitudeDelta,
                                            longitudeDelta: this.state.region.longitudeDelta
                                        }}
                                        title='你現在的位置'
                                        description='在此位置辦活動'
                                    />
                                </MapView>
                            ) : null
                        }


                        <View style={{ padding: 30 }}>
                            <KeyboardAwareScrollView>
                                <Text style={styles.title}>活動內容</Text>
                                <View style={styles.inputView}>

                                    <TextInput
                                        style={styles.inputText}
                                        placeholder='輸入內容......'
                                        placeholderTextColor='rgba(102,102,102,0.5)'
                                        underlineColorAndroid='transparent'
                                        multiline={true}
                                        onChangeText={(content) => this.setState({ content })}
                                    />

                                </View>
                            </KeyboardAwareScrollView>

                            <Text style={styles.title}>備註</Text>
                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.inputText}
                                    placeholder='輸入內容......'
                                    placeholderTextColor='rgba(102,102,102,0.5)'
                                    underlineColorAndroid='transparent'
                                    multiline={true}
                                    onChangeText={(remarks) => this.setState({ remarks })} />
                            </View>

                        </View>

                    </View>

                </ScrollView>
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
                {loading ? <Overlayer /> : null}
            </KeyboardAvoidingView>
        );
    }

}

export default AddActivity
