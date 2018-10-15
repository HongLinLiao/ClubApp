import { StyleSheet } from 'react-native'

export default StyleSheet.create({


    bigText: {
        flex: 1,
        flexDirection: 'row',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 15,
        color: 'rgba(102,102,102,1)'


    },
    smallText: {
        flex: 1,
        flexDirection: 'row',
        fontSize: 15,
        marginLeft: 10,
        marginRight: 15,
        color: 'rgba(102,102,102,1)'

    },
    botton: {
        backgroundColor: 'rgba(255,255,255,1.5)',
        marginBottom: 8,
        marginTop:8,
        borderWidth: 0.5,
        borderColor: 'rgba(102,102,102,1)',
        width: 230,
        height: 35,
        borderRadius: 50,
        justifyContent: 'center'
    },

})