import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    sbRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    rowPadding: {
        flexDirection: 'row',
        margin: 5
    },
    littleHead: {
        height: 50,
        width: 50,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 10,
        borderRadius: 80
    },
    littleCircle:{
        width: 50, 
        height: 50, 
        borderRadius: 80, 
        overflow: 'hidden', 
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: 10,
    },
    columnLine: {
        flexDirection: 'column',
        borderBottomWidth: 0.5,
        borderColor: 'rgba(102,102,102,0.2)',
        flex: 1,
        padding: 5
    },
    littleSchool: {
        color: '#666666',
        fontSize: 14,
        marginRight: 8
    },
    littleClub: {
        color: '#666666',
        fontSize: 18
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    numberLittle: {
        color: '#666666',
        fontSize: 12,
        margin: 5,
        marginRight: 15
    },
    littleName: {
        color: '#666666',
        fontSize: 14,
        marginRight: 8
    },
    littleJob: {
        color: '#666666',
        fontSize: 14
    },
    icon: {
        height: 20,
        width: 20
    },
    comment: {
        color: '#666666',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 5
    },
    sendIcon: {
        height: 22,
        width: 22,
        marginRight: 5,
        marginLeft: 5,
        marginTop: 8
    },
    rowPaddingInput: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        backgroundColor: 'rgba(246,180,86,1)',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    columnTabBar: {
        flexDirection: 'column',
        flex: 1,
        padding: 5
    },
    inputViewTabBar: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
        marginBottom: 7,
        paddingLeft: 10,
        paddingRight: 10,
        flex:1
    },
    textInputTabBar: {
        alignSelf: 'stretch',
        color: '#666666',
        flex:1
    },
    sbColumn: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 5,
    },
    iconClose: {
        height: 13,
        width: 13,
        marginTop: 8
    }
})