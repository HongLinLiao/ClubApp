import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import Overlayer from '../common/Overlayer'

const PlaceDialog = ({predictions, setPlace, status, loading}) => {
    console.log(predictions)
    if(status == 'OK') {
        return (
            <View style={{flex: 1}}>
                {predictions.map((place, index) => {
                    const { description, place_id } = place
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setPlace(place_id)}
                            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                        >
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Text>{description}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
                {loading ? <Overlayer /> : null}
            </View>
        )
    } else {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>查無資料(可以嘗試搜尋別的相關字喔～)</Text>
            </View>
        )
    }
}


export default PlaceDialog