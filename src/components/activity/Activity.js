import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native';
import { Button } from 'react-native-elements';

class Activity extends React.Component {

    //寫入本地State
    async componentWillMount() {
        this.setState({ activity: this.props.activity });
    }

    state = {
        activity: {},
    }

    render() {
        const activityData = this.state.activity;
        const element = JSON.parse(JSON.stringify(activityData));

        return (
            <ScrollView>
                <Image
                    source={{ uri: element.photo }}
                    resizeMode='cover'
                    style={{ width: 50, height: 50 }}
                />
                <Text>{element.schoolName}</Text>
                <Text>{element.clubName}</Text>
                <Text>{element.title}</Text>
                <Text>{element.price}</Text>     
                <Text>{element.place}</Text>
                <Text>{element.numFavorites}</Text>
                <Text>{element.content}</Text>
                <Text>{element.remarks}</Text>
            </ScrollView>
        )
    }
}

export default Activity;