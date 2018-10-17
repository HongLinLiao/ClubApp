import { StyleSheet } from 'react-native'

export default StyleSheet.create({

    container:{
        flex:1,     
    },
    arrow:{
        height:30,
        width:30,
    },
    headView:{
        height:45,
        backgroundColor:'#f6b456',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection:'row'
    },
    headText:{
        color:'#666666',
        fontSize:20,
    },
    fake:{
        width:50,
    },
    containView:{
        flex:1,
        padding:15
    },
    boxView:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'rgba(102,102,102,0.15)',
        height:40,
        width: '100%',
    },
    boxBottomBorderView:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'rgba(102,102,102,0.5)',
        height:40
    },
    boxText:{
        fontSize:18,
        color:'#666666',
        padding:10,
    },
    boxFirstText:{
        fontSize:18,
        color:'#666666',
        fontWeight:'bold',
        padding:10,
    },
    arrowRight:{
        height:20,
        width:20,
        paddingRight: 20,
    },
    redText:{
        fontSize:10,
        color:'#ff0000'
    },
    mailText:{
        fontSize:12,
        color:'rgba(102,102,102,0.25)',
    },
    //tabBar:{
    //   height:50,
    // backgroundColor:'#f6b456'
    //}
})