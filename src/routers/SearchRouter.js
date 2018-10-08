import { createStackNavigator } from 'react-navigation'
import SearchPage from '../containers/search/SearchPage'
import { TextInput, StyleSheet, Image } from 'react-native'
import SearchClubPage from '../containers/search/SearchClubPage'
import PostPage from '../containers/club/PostPage'
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
                        placeholder="搜尋（ex:長庚大學）"
                        placeholderTextColor='gray'
                        style={{
                            height: 30,
                            padding:10,
                            backgroundColor: 'white',
                            flex: 1,
                            fontSize:15,
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
        height: 33,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'rgba(102,102,102,0.2)',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 13,
        flex: 1,
    },
})