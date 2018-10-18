import { StyleSheet } from 'react-native'
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#ffffff'
    },
    headView: {
        height: 45,
        backgroundColor: '#f6b456',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    arrow: {
        height: 30,
        width: 30,
        marginLeft:10,
    },
    headText: {
        color: '#666666',
        fontSize: 20,
    },
    fake: {
        width: 30,
        marginRight: 10,
    },
    containView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completeImage: {
        height: 130,
        width: 130,
        marginLeft: 10,
    },

    mailView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    userMail: {
        width: 200,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(102,102,102,0.25)',
        padding: 10,
    },
    mailText: {
        fontSize: 18,

        color: '#666666'
    },
    userMailText: {

        color: '#666666'
    },
    buttonView: {
        padding: 20,
    },
    button: {
        width: 150,
        height: 45,
        shadowOffset: { width: 0.5, height: 0.5, },
        shadowColor: '#000000',
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 10,

    },

})