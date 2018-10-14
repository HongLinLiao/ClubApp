import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    selectClub: {
        position: 'absolute',
        top: 50, //與最上端的距離
        right: 150, //與右邊的距離
        width: 200,
        height: 20,
        backgroundColor: 'rgba(255, 157, 0, 0.5)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    selectClubText: {
        color: 'rgba(0,0,0,0.8)'
    },
    clubBackground: {
        height: 380,
        justifyContent: 'flex-end',
    },
    iconCamera: {
        height: 150,
        width: 150,
        paddingBottom: 100
    },
    cameraView: {
        paddingBottom: 50,
        alignItems: 'center',
    },
    cameraText: {
        fontSize: 30,
        color: '#ffffff'
    },
    clubInfoView: {
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 30,
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    flexDirectionRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    iconPancil: {
        height: 20,
        width: 20,
        marginLeft: 10,
    },
    clubTextView: {
        flexDirection: 'row'
    },
    schoolText: {
        fontSize: 22,
        color: '#ffffff',
        fontWeight: 'bold'
    },
    clubTopNameText: {
        fontSize: 22,
        color: '#ffffff',
        fontWeight: 'bold',
        paddingTop: 8,
    },
    numberext: {
        fontSize: 14,
        color: '#ffffff',
        paddingTop: 10,
        paddingLeft: 15,
    },
    clubLeftTextView: {
        flexDirection: 'column',
    },
    clubRightTextView: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        paddingLeft: 20,
        paddingRight: 5,
    },
    calanderButton: {
        height: 50,
        width: 50,
        borderRadius: 100,
        backgroundColor: '#f6b456',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCalendar: {
        height: 35,
        width: 35,
    },
    adminButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
    },
    adminButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    adminText: {
        fontSize: 12,
        padding: 5,
        color: '#666666'
    },
    adminIcon: {
        width: 35,
        height: 35
    },
    clubSummaryView: {
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: 'rgba(102,102,102,0.15)',
        borderRadius: 30,
        marginLeft: 20,
        marginRight: 20,
    },
    clubSummaryText: {
        fontSize: 18,
        color: '#666666',
        lineHeight: 32,
    },
    icon: {

        height: 15,
        width: 15,
    }
});