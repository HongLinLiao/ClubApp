import React from 'react'
import {
    View,
    Button,
    TextInput,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native'

import { Location, DangerZone } from 'expo'
import MapView from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { showLocation } from 'react-native-map-link'
import DateTimePicker from 'react-native-modal-datetime-picker';




class AddActivity extends React.Component {

    state = {
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        showDatePicker: false,
        date: '',
    }

    componentWillMount() {
        // this.getUserLocation()
    }

    getUserLocation = async () => {
        let location = await Location.getCurrentPositionAsync();
        console.log(location)

        this.setState({
            region: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        })
    }

    open = async () => {
        let location = await Location.getCurrentPositionAsync();
        console.log(location)
        showLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            // title: 'The White House',  // optional
            dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
            dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you li
            cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
            appsWhiteList: ['google-maps', 'apple-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
            app: 'google-maps'  // optionally specify specific app to use
        })

        console.log('hahaha')
    }

    searchPlace = async () => {
        let location = await Location.getCurrentPositionAsync();
        console.log(location)

        let response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/xml?input=Taipei&location=37.78825,-122.4324&radius=500&key=AIzaSyBvx44uGRxGR2RlGqdbcad48Rp1CZb77p8`)

        this.setState({
            result: result
        })

        console.log(response)
    }

    setDateTime = (date) => {
        
        this.setState({ 
            date,
            showDatePicker: false
        })
    }

    getDateTime = () => {
        let { date } = this.state
        let newDate = new Date(date)
        let day = newDate.toLocaleDateString()
        let time = newDate.getHours() + ':' + newDate.getMinutes()
        let result = day + ' ' + time

        return result 
    }

    render() {
        const { latitude, longitude } = this.state.region
        const date = this.getDateTime()
        console.log(latitude)
        console.log(longitude)
        
        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    <View>
                        <TouchableOpacity 
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 300}}
                            onPress={() => {}}
                        >
                            <Text>新增活動照片</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <TextInput placeholder='活動名稱' />
                        <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                            <Text>{this.state.date ? date : '請選擇時間'}</Text>
                        </TouchableOpacity>
                        
                        <TextInput placeholder='活動名稱' />
                        <TextInput placeholder='活動名稱' />
                    </View>
                    <DateTimePicker
                        isVisible={this.state.showDatePicker}
                        onConfirm={this.setDateTime}
                        onCancel={() => {console.log('取消')}}
                        mode='datetime'
                    />
                </ScrollView>
            </View>
            
        )
    }
}

export default AddActivity


// <MapView
//     style={{ flex: 1 }}
//     initialRegion={this.state.region}
//     region={this.state.region}
// />

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