import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    title: {
        color: 'rgba(102,102,102,1)',
        fontSize: 25,
        alignSelf: 'center',
        marginBottom: 60,
        marginTop: 30
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    botton: {
        height: 100,
        width: 140,
        backgroundColor: 'rgba(246,180,86,0.4)',
        borderRadius: 15,
        margin: 13,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginBottom: 100
    },
    bottonText: {
        color: 'rgba(102,102,102,1)',
        fontSize: 20,
        paddingTop: 6
    },
    lockIcon: {
        height: 25,
        width: 25,
        margin: 6
    },
    unlockIcon: {
        height: 25,
        width: 25,
        margin: 6
    },
    okBotton: {
        height: 40,
        width: 110,
        backgroundColor: 'rgba(0,205,205,1)',
        borderRadius: 20,
        justifyContent: 'center',
        marginBottom: 110
    },
    okText: {
        color: 'rgba(255,255,255,1)',
        fontSize: 20,
        alignSelf: 'center'
    }
})
