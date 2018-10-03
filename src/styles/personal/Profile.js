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
        justifyContent: 'center',
        alignItems: 'center'
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
        width: 305,
        //height: 75,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        justifyContent: 'center',
        flex: 2.4,
        borderColor:'red',
        borderWidth:1
    },
    aboutMeText: {
        color: '#666666',
        fontSize: 13,
        alignSelf: 'center'
    },
    botton: {
        //margin:5,
        marginRight:15,
        marginLeft:15,
        width: 135,
        height: 85,
        borderRadius: 25,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 1,
        borderColor: 'rgba(246,180,86,1)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
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
        //marginBottom:10,
        width: 305,
        height: 30,
        borderRadius: 25,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 1,
        borderColor: '#f6b456',
        justifyContent: 'center'
    },
    signOutText: {
        color: '#666666',
        fontSize: 16,
        alignSelf: 'center'
    },
    one: {
        flex: 3.8,
        alignItems: 'center',
        borderColor:'red',
        borderWidth:1
    },
    three: {
        flex: 2.2,
        borderColor:'red',
        justifyContent:'center',
        borderWidth:1
    },
    four: {
        flex: 2.2,
        borderColor:'red',
        justifyContent:'center',
        borderWidth:1
    },
    five: {
        flex: 1.1,
        borderColor:'red',
        borderWidth:1,
        justifyContent:'center',

    }
})