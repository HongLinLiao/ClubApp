import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'rgba(246,180,86,0.2)'
    },
    person: {
        margin: 10,
        width: 95,
        height: 95,
        borderRadius: 50,
    },
    name: {
        color: '#666666',
        fontSize: 22,
        marginBottom: 10
    },
    row: {
        flexDirection: 'row',
        flex: 1
    },
    rowx:{
        flexDirection: 'row'
    },
    hotPoint: {
        height: 22,
        width: 22,
        marginRight: 3
    },
    number: {
        color: '#666666',
        fontSize: 18
    },
    aboutMe: {
        marginLeft:50,
        marginRight:50,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        justifyContent: 'center',
        flex: 2.4
    },
    aboutMeText: {
        color: '#666666',
        fontSize: 13,
        alignSelf: 'center'
    },
    botton: {
        marginRight:15,
        marginLeft:15,
        marginBottom:5,
        marginTop:5,
        borderRadius: 25,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 1,
        borderColor: 'rgba(246,180,86,1)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex:1,
    },
    bottonIcon: {
        height: 28,
        width: 28
    },
    bottonText: {
        color: '#666666',
        fontSize: 12,
        marginTop: 7
    },
    signOut: {
        margin: 5,
        marginBottom:10,
        marginTop:10,
        borderRadius: 25,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 1,
        borderColor: '#f6b456',
        justifyContent: 'center',
        flex:1
    },
    signOutText: {
        color: '#666666',
        fontSize: 16,
        alignSelf: 'center'
    },
    one: {
        flex: 3.8,
        alignItems: 'center'
    },
    three: {
        flex: 2.2,
        justifyContent:'center',
        marginLeft:35,
        marginRight:35
    },
    four: {
        flex: 2.2,
        justifyContent:'center',
        marginLeft:35,
        marginRight:35,
    },
    five: {
        flex: 1.1,
        justifyContent:'center',
        marginLeft:45,
        marginRight:45
    }
})