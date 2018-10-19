import React from 'react'
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, Alert, StyleSheet, Keyboard } from 'react-native'
import Overlayer from '../common/Overlayer'
import { autocompletePlace } from "../../modules/Api";

class PlaceDialog extends React.Component {
    state = {
        loading: false,
        place: '',
        predictions: [],
        status: null,
        overlay: false,
    }
    searchPlace = async (text) => {
        try {
            this.setState({loading: true})
            const result = await autocompletePlace(text)
            const { predictions, status } = result
            this.setState({loading: false, predictions, status})
            
        } catch(e) {
            Alert.alert(e.toString())
        }
    }
    render() {
        const { setPlace } = this.props
        return (
            <View style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
                <View style={{padding: 20, backgroundColor: '#f6b456'}}>
                    <TextInput
                        placeholder='輸入想搜尋的地點'
                        onChangeText={(text) => this.searchPlace(text)}
                        onFocus={() => this.setState({overlay: true})}
                        style={{borderBottomWidth: 1}}
                    />
                </View>
                <View style={{flex: 1}}>
                    {
                        this.state.status == 'OK' ? 
                            this.state.predictions.map((item, index) => {
                                const { description, place_id } = item
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingLeft: 20,
                                            paddingRight: 20,
                                            backgroundColor: '#0d4273',
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#f6b456'
                                        }}
                                        onPress={() => setPlace(place_id)}
                                    >
                                        <Text style={{color: '#f6b456'}}>{description}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        : (
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d4273'}}>
                                <Text style={{color: '#f6b456'}}>查無結果(可以嘗試搜尋別的~)</Text>
                            </View>
                        )
                    }
                    {this.state.overlay ? (
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss()
                                this.setState({overlay: false})
                            }}
                            style={StyleSheet.absoluteFill}
                        >
                        </TouchableOpacity> 
                    ): null}
                    {this.state.loading ? <Overlayer /> : null}
                </View>
            </View>
        )
    }
}


export default PlaceDialog