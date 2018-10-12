import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    empty: {
        width: 40
    },
    listView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'rgba(102,102,102,0.1)',
        backgroundColor: 'rgba(246,180,86,0)',
        width: 370,
        height: 50
    },
    textArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    alarm: {
        width: 22,
        height: 22,
        marginRight:12,
        marginLeft:15
    },
    alarmText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgba(102,102,102,1)'
    },
    moonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'rgba(102,102,102,0.5)',
        backgroundColor: 'rgba(246,180,86,0)',
        width: 370,
        height: 50
    },
    moonText: {
        fontSize: 20,
        color: 'rgba(102,102,102,1)'
    },
    switchSize:{
        marginRight:15
    },
    school: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 15,
        color: 'rgba(102,102,102,1)'
    },
    club: {
        fontSize: 20,
        color: 'rgba(102,102,102,1)'
    }
})