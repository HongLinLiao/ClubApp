import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  bf:{
    flex:1,
    height:null,
    width:null
},
container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
    backgroundColor:'rgba(0,0,0,0.5)'
},
title:{
    color:'white',
    fontSize:35,
    alignSelf: 'center',
    marginBottom:90
},
send:{
    color:'white',
    fontSize:18,
    alignSelf: 'center',
    margin:5
},
mail:{
  flexDirection:'row',
  marginTop:25,
  width:230,
  height:35,
  backgroundColor:'rgba(255,255,255,0.4)',
  borderRadius: 50,
  alignItems:'center',
  justifyContent:'center'
},
mailIcon:{
  height:25,
  width:25,
  marginRight:10
},
textInput:{
  width:160,
  height:35,
  color:'white',
  backgroundColor:'rgba(255,255,255,0)'
},
againBotton:{
    backgroundColor:'rgba(255,255,255,0.4)',
    margin:35,
    borderWidth:1,
    borderColor:'white',
    width:230,
    height:37,
    borderRadius:7,
    justifyContent:'center'
},
againText:{
    color:'white',
    fontSize:15,
    alignSelf: 'center'
},
loginBotton:{
    backgroundColor:'rgba(255,255,255,0)',
    margin:43,
    borderWidth:1,
    borderColor:'white',
    width:140,
    height:35,
    borderRadius: 50,
    justifyContent:'center'
},
loginText:{
    color:'white',
    fontSize:15,
    alignSelf: 'center'
},
backText:{
    color:'white',
    fontSize:15,
    alignSelf: 'center',
    paddingTop:5
}

})