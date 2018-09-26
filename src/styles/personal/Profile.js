import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'rgba(246,180,86,0.2)'
    },
    person: {
        marginTop: 45,
        margin: 15,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    name: {
        color: '#666666',
        fontSize: 25,
        marginBottom: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    hotPoint: {
        height: 23,
        width: 23,
        marginRight: 5
    },
    number: {
        color: '#666666',
        fontSize: 18
    },
    aboutMe: {
        width: 290,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 25,
        justifyContent: 'center',
        marginBottom: 10
    },
    aboutMeText: {
        color: '#666666',
        fontSize: 15,
        alignSelf: 'center'
    },
    botton: {
        margin: 10,
        width: 135,
        height: 90,
        borderRadius: 25,
        backgroundColor: 'rgba(246,180,86,0)',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(246,180,86,1)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    bottonIcon: {
        height: 30,
        width: 30
    },
    bottonText: {
        color: '#666666',
        fontSize: 13,
        marginTop: 8
    },
    signOut: {
        margin: 10,
        marginBottom: 12,
        width: 290,
        height: 35,
        borderRadius: 25,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 1,
        borderColor: '#f6b456',
        justifyContent: 'center'
    },
    signOutText: {
        color: '#666666',
        fontSize: 15,
        alignSelf: 'center'
    },
    tabBar: {
        height: 50,
        alignSelf: 'stretch',
        backgroundColor: '#f6b456',
        flexDirection: 'row'
    },
})