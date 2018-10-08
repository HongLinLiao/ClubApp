import { createStackNavigator } from 'react-navigation'
import SearchPage from '../containers/search/SearchPage'
import SearchClubPage from '../containers/search/SearchClubPage'
import PostPage from '../containers/club/PostPage'
import { TextInput, StyleSheet, Image } from 'react-native'
import React from 'react'
import { View } from 'native-base';

export default createStackNavigator({
    Search: {
        screen: SearchPage,
        navigationOptions: ({ navigation }) => ({
            headerTitleStyle: {
                color: '#666666',
                fontSize: 20,
            },
            headerStyle: {
                backgroundColor: 'white',
            },
            headerTitle:

                <View style={styles.searchView}>
                    <TextInput
                        placeholder="搜尋 (ex:長庚大學)"
                        placeholderTextColor='gray'
                        style={{
                            height: 30,
                            padding: 10,
                            fontSize: 18,
                            flex: 1,
                        }} />
                    <Image source={require('../images/images2/search.png')}
                        style={styles.search} />
                </View>
            ,
        })
    },
    SearchClub: {
        screen: SearchClubPage
    },
    Post: {
        screen: PostPage
    },
})

const styles = StyleSheet.create({
    search: {
        height: 18,
        width: 18,
        marginRight: 10
    },
    searchView: {
        flex: 1,
        height: 35,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'rgba(102,102,102,0.2)',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },

})