import { StyleSheet } from 'react-native'


export default StyleSheet.create({
    container: {
        flex: 1
    },   
    leftIcon: {
        height: 30,
        width: 30,
        justifyContent:'center',
        marginRight:3
    },
    empty: {
        width: 40
    },
    textArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    alarm: {
        width: 22,
        height: 22,
        marginRight: 12,
        marginLeft: 15
    },
    school: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 15,
        color: 'rgba(102,102,102,1)'
    },
    club: {
        fontSize: 18,
        color: 'rgba(102,102,102,1)'
    },
    boxView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(102,102,102,0.5)',
        marginLeft:10,
        marginRight:10
    },
    boxBottomBorderView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(102,102,102,0.5)',
        marginLeft:10,
        marginRight:10
    },
}
)