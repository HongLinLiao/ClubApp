import React from 'react'
import {
    View,
    Text,
    Alert,
    Button,
} from 'react-native'

import { VictoryPie } from "victory-native";

class Analysis extends React.Component {
    state = {

    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <VictoryPie
                    data={[
                    { x: "Cats", y: 35 },
                    { x: "Dogs", y: 40 },
                    { x: "Birds", y: 55 }
                    ]}
                />
            </View>
        )
    }
}

export default Analysis