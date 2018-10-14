import { StyleSheet } from 'react-native'


export default StyleSheet.create({
    container: {
        flex: 1,
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
    },
    containView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },


    mailView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        // borderWidth:1,
    },
    userMail: {
        padding: 10,
    },
    mailText: {
        fontSize: 18,

        color: '#666666'
    },
    userMailText: {

        color: 'rgba(102,102,102,0.5)'
    },
    passwordView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80,
        //borderWidth:1,
    },
    passwordText: {
        fontSize: 20,
        padding: 10,
        color: '#666666'
    },
    passwordInput: {
        backgroundColor: 'rgba(102, 102, 102, 0.2)',
        width: 200,
        height: 40,
        borderRadius: 10,
        color: '#666666',
        justifyContent:'center'
    },
    send: {
        height: 20,
        width: 20,
        marginRight: 5,
    },
    buttonView: {

        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 170,
        height: 45,
        borderRadius: 20,
        backgroundColor: '#fbdaa7',
        shadowOffset: { width: 0.5, height: 0.5, },
        shadowColor: '#000000',
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#666666'


    },
    redText: {
        fontSize: 13,
        color: '#f30a0a'
    },
    //tabBar: {
    //    height: 50,
    //    backgroundColor: '#f6b456'
    //},
})