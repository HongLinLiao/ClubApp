import React from 'react'
import { ScrollView, Text } from 'react-native'

class SelectClub extends React.Component {

    render() {
        return (
            <ScrollView>
                <Text>{this.props.user.uid}</Text>
            </ScrollView>
        );
    }
}

export default SelectClub