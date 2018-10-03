import { StyleSheet } from 'react-native'

export default StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        
    },
    main: {
        flex: 1,
        justifyContent: 'space-between',
        margin:20,
        padding:20,
    },
    headView: {
        height: 45,
        backgroundColor: '#f6b456',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    
    arrow: {
        height: 30,
        width: 30,
        marginLeft: 10,
    },
    headText: {
        color: '#666666',
        fontSize: 20,
        justifyContent: 'center',
    },
    fake: {
        width: 30,
        marginRight: 10,
    },
    containView: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        // borderWidth: 1,
    },

    passwordView: {
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 40,
        // borderWidth: 1,
    },
    passwordText: {
        fontSize: 18,
        padding: 10,
        color: '#666666'
    },
    passwordInput: {
        backgroundColor: 'rgba(246, 179, 85 ,0.2)',
        width: 250,
        height: 40,
        borderRadius: 10,

    },
    newPasswordView: {
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding: 40,
        // borderWidth: 1,
    },
    
    newPasswordText: {
        fontSize: 18,
        padding: 10,
        color: '#666666'
    },
    newPasswordInput: {
        backgroundColor: 'rgba(246, 179, 85 ,0.2)',
        width: 250,
        height: 40,
        borderRadius: 10,
    },
    newPasswordAgainView:{
        justifyContent: 'space-between',
        alignItems: 'center',
        // padding: 40,
        // borderWidth: 1,
    },
    newPasswordAgainText: {
        fontSize: 18,
        padding: 10,
        color: '#666666'
    },
    newPasswordAgainInput: {
        backgroundColor: 'rgba(246, 179, 85 ,0.2)',
        width: 250,
        height: 40,
        borderRadius: 10,
    },

    buttonView: {
        width: 160,
        height: 45,
        backgroundColor: '#fbdaa7',
        justifyContent: 'center',
        alignItems:'center',
        borderRadius:22,
        // marginBottom: 8,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#000000',
        shadowRadius: 10,
        shadowOpacity: 0.2,
        elevation: 5,
        // borderWidth: 1,

    },
    button: {
        color: '#666666',
        fontSize: 18,
        borderRadius: 10,
    },


    //tabBar: {
    //  height: 50,
    //   backgroundColor: '#f6b456'
    //},
})