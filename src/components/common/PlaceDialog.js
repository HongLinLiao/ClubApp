import React from 'react'
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView } from 'react-native'
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
            this.setState({ loading: true })
            const result = await autocompletePlace(text)
            const { predictions, status } = result
            this.setState({ loading: false, predictions, status })

        } catch (e) {
            Alert.alert(e.toString())
        }
    }
    render() {
        const { setPlace } = this.props

        return (

            <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}>
                <View style={{ padding: 20, backgroundColor: '#f6b456' }}>
                    <TextInput
                        placeholder='輸入想搜尋的地點'
                        onChangeText={(text) => this.searchPlace(text)}
                        onFocus={() => this.setState({ overlay: true })}
                        style={{ borderBottomWidth: 1, borderBottomColor: '#0d4273' }}
                    />
                </View>

                <View style={{ flex: 1, backgroundColor: '#0d4273' }}>
                    {
                        this.state.status == 'OK' ?
                            this.state.predictions.map((item, index) => {
                                const { description, place_id } = item
                                return (
                                    <KeyboardAvoidingView behavior="position">
                                        <TouchableOpacity
                                            key={index}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                margin: 20,
                                                // backgroundColor: 'rgba(18, 117, 209, 0.3)',
                                                borderWidth: 1,
                                                borderColor: '#f6b456'
                                            }}
                                            onPress={() => setPlace(place_id)}
                                        >
                                            <Text style={{ color: '#f6b456', margin: 5, textAlign: 'center' }}>{description}</Text>
                                        </TouchableOpacity>
                                    </KeyboardAvoidingView>
                                )
                            })
                            : (
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d4273' }}>
                                    <Text style={{ color: '#f6b456' }}>查無結果(可以嘗試搜尋別的~)</Text>
                                </View>
                            )
                    }
                    {this.state.overlay ? (

                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss()
                                this.setState({ overlay: false })
                            }}
                            style={StyleSheet.absoluteFill}
                        //style={{ flex: 1, justifyContent: 'center',marginTop:100 }}
                        >
                        </TouchableOpacity>

                    ) : null}
                    {this.state.loading ? <Overlayer /> : null}
                </View>
            </View>

        )
    }
}


export default PlaceDialog