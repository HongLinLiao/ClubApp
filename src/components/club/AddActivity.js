import React from 'react'
import {
    View,
    Button,
    TextInput,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Image,
    Alert,
} from 'react-native'

import { Location, DangerZone } from 'expo'
import MapView, { Marker } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { showLocation } from 'react-native-map-link'
import DateTimePicker from 'react-native-modal-datetime-picker';

import { takePhoto, selectPhoto } from '../../modules/Common'
import Overlayer from '../common/Overlayer'
import styles from '../../styles/club/AddActivity'

class AddActivity extends React.Component {

    state = {
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        showDatePicker: false,
        datePickerId: 0, // 0 or 1 設定開始跟結束
        loading: false,

        title: '',
        content: '',
        remarks: '',
        startDateTime: '',
        endDateTime: '',
        price: '',
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
            const { createActivity, currentCid } = this.props
            const { title, content, remarks, photo, startDateTime, endDateTime, place, price, open } = this.state
            const activityData = { title, content, remarks, photo, startDateTime, endDateTime, place, price, open }

            this.setState({ loading: true })
            await createActivity(currentCid, activityData)

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
        const { open } = this.state
        const { schoolName, clubName, member } = joinClubs[currentCid]
        const { status } = member[user.uid]

        return (
            <View style={styles.container}>
                <View style={styles.headView}>
                    <TouchableOpacity>
                        <Image source={require('../../images/left.png')}
                            style={styles.leftIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headText}>編輯活動</Text>
                    <View style={styles.empty}></View>
                </View>


                <ScrollView>
                    <View style={{ height: 280, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.title}>新增活動照片</Text>
                        <TouchableOpacity onPress={this.pickPicture}>
                            <Image source={require('../../images/graycamera.png')}
                                style={styles.graycamera}
                            />
                            {
                                this.state.photo ?
                                    <Image source={{ uri: this.state.photo }} resizeMode='cover' style={{ height: 300, width: '100%' }} />
                                    :
                                    <Text style={styles.bigText}>由本機上傳</Text>
                            }
                        </TouchableOpacity>

                    </View>

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
                            <View style={[styles.row,{ flex:1,paddingTop: 10}]}>
                                <Image source={require('../../images/calendar.png')}
                                    style={styles.calendarIcon} />
                                <View style={styles.littleTextView}>
                                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true, datePickerId: 0 })}>
                                        <Text style={styles.calenderText}>{this.state.startDateTime ? dateArray[0] : '請選擇開始時間'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.row,{ flex:1,paddingTop: 10}]}>
                                <Text style={styles.toText}>~</Text>
                                <View style={styles.littleTextView}>
                                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true, datePickerId: 1 })}>
                                        <Text style={styles.calenderText}>{this.state.endDateTime ? dateArray[1] : '請選擇結束時間'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>



                        <View style={[styles.row,{flex:1,paddingTop: 10}]}>
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
                        <View style={[styles.row, {flex:1 ,paddingTop: 10}]}>
                            <Image source={require('../../images/place.png')}
                                style={styles.calendarIcon} />
                            <View style={styles.littleTextView}>
                                <TextInput
                                    style={[styles.littleText,style={width:224}]}
                                    placeholder='活動地點'
                                    placeholderTextColor='rgba(102,102,102,0.5)'
                                    underlineColorAndroid='transparent'
                                    onChangeText={place => this.setState({ place })}
                                />
                            </View>
                            <TouchableOpacity onPress={this.open}>
                                <Image source={require('../../images/search.png')}
                                    style={styles.searchIcon} />
                            </TouchableOpacity>

                        </View>
                        <MapView
                            style={{ height: 250, marginLeft: 20, marginTop: 10, marginRight: 20 }}
                            region={this.state.region}
                        >
                            <Marker
                                coordinate={{
                                    latitude: this.state.region.latitude,
                                    longitude: this.state.region.longitude,
                                }}
                                title='你現在的位置'
                                description='在此位置辦活動'
                            />
                        </MapView>

                        <View style={{ padding: 30 }}>
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

                            <DateTimePicker
                                isVisible={this.state.showDatePicker}
                                onConfirm={this.setDateTime}
                                onCancel={() => this.setState({ showDatePicker: false })}
                                mode='datetime'
                            />
                        </View>
                    </View>
                </ScrollView>
                {this.state.loading ? <Overlayer /> : null}
                <KeyboardAvoidingView behavior='padding'>
                </KeyboardAvoidingView>

            </View>
        );
    }


}

export default AddActivity

































        // <GooglePlacesAutocomplete
        // textInputProps={{
        //     onChangeText: (tempText) => {
        //         console.log(tempText)
        //         this.setState({tempText})
        //     },
        //     onBlur: () => {
        //         console.log('blur')
        //         this.setState({text: this.state.tempText})
        //     },
        //     onSubmitEditing: () => {
        //         console.log('sub')
        //     },
        //     value: this.state.text

        // }}
        // placeholder='Search'
        // minLength={2} // minimum length of text to search
        // autoFocus={false}
        // returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        // listViewDisplayed='auto'   // true/false/undefined
        // fetchDetails={true}
        // renderDescription={row => row.description} // custom description render
        // onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
        //     // console.log(data, details);
        // }}


        // query={{
        //     // available options: https://developers.google.com/places/web-service/autocomplete
        //     key: 'AIzaSyBvx44uGRxGR2RlGqdbcad48Rp1CZb77p8',
        //     language: 'zh-TW', // language of the results
        //     types: 'country' // default: 'geocode'
        // }}

        // styles={{
        // textInputContainer: {
        //     width: '100%'
        // },
        // description: {
        //     fontWeight: 'bold'
        // },
        // predefinedPlacesDescription: {
        //     color: '#1faadb'
        // }
        // }}
        // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
        // currentLocationLabel="Current location"
        // nearbyPlacesAPI='GooglePlacesSearch'

        // // GooglePlacesSearchQuery={{
        // //     // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        // //     rankby: 'distance',
        // //     types: 'food'
        // // }}

        // // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        // />