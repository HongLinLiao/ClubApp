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
        color: 'rgba(102,102,102,0.5)'

    },
    buttonText:{
        marginRight:12,
        marginLeft:12,
        //marginTop: 6,
        fontSize: 14,
        fontWeight: 'bold',
        //aligenContent: 'center',
        color: 'rgba(102,102,102,1)',
        
    },
    button: {
        //backgroundColor: '#666666',
        //marginBottom: 8,
        borderWidth: 0.8,
        borderColor: 'rgba(102,102,102,0.3)',
        marginLeft:20,
        
        width: 80,
        height: 28,
        borderRadius: 3,
        justifyContent: 'center'
        
    },

})