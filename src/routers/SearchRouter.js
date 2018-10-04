import { createStackNavigator } from 'react-navigation'
import SearchPage from '../containers/search/SearchPage'
import { TextInput } from 'react-native'
import React from 'react'

export default createStackNavigator({
    Search: {
        screen: SearchPage,
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                color: '#666666',
                fontSize: 20,
            },
            headerStyle: {
                backgroundColor: '#f6b456'
            },
            headerLeft: (
                <TextInput>
                </TextInput>
            )
        })
    }
})