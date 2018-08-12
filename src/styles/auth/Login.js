import { StyleSheet } from 'react-native'


export default StyleSheet.create({
  bf:{
    flex:1,
    height:null,
    width:null
  },
  container:{
    flex: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'column',
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  logo:{
    margin:15,
    width:80,
    height:80,
    backgroundColor:'rgba(255,255,255,0.4)',
    borderRadius: 100
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
  psw:{
    flexDirection:'row',
    marginTop:25,
    width:230,
    height:35,
    backgroundColor:'rgba(255,255,255,0.4)',
    borderRadius: 50,
    alignItems:'center',
    justifyContent:'center'
  },
  pswIcon:{
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
  checkContainer:{
    backgroundColor:'rgba(255,255,255,0)',
    borderColor:'rgba(255,255,255,0)',
    margin:15
  },
  checkText:{
    color:'white'
  },
  checkIcon:{
    height:14,
    width:14
  },
  boxIcon:{
    height:14,
    width:14
  },
  row:{
    flexDirection:'row',
    justifyContent:'center',
    alignSelf: 'center'
  },
  gobotton:{
    backgroundColor:'rgba(255,255,255,0)',
    marginBottom:10,
    borderWidth:0.5,
    borderColor:'white',
    width:230,
    height:35,
    borderRadius: 50,
    justifyContent:'center'
  },
  gotext:{
    color:'white',
    fontSize:15,
    alignSelf: 'center'
  },
  or:{
    color:'white',
    fontSize:13,
    margin:20
  },
  signinwith:{
    color:'white',
    fontSize:15,
    margin:8
  }, 
  fbBotton:{
    backgroundColor:'rgba(255,255,255,0.4)',
    margin:15,
    width:100,
    height:35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems:'center',
    flexDirection:'row'
  },
  fbIcon:{
    height:17,
    width:17
  },
  fbText:{
    color:'white',
    fontSize:15
  },
  gmailBotton:{
    backgroundColor:'rgba(255,255,255,0.4)',
    margin:15,
    width:100,
    height:35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems:'center',
    flexDirection:'row'
  },
  gmailIcon:{
    height:17,
    width:17,
    marginRight:5
  },
  gmailText:{
    color:'white',
    fontSize:16
  },
  forgot:{
    color:'white',
    fontSize:15,
    margin:10
  },
  signupBottom:{
    flex:1,
    alignSelf:'stretch',
    alignItems:'center',
    justifyContent: 'center',
    flexDirection:'row',
    backgroundColor:'rgba(153,153,153,0.4)'
  },
  noAccount:{
    color:'white',
    fontSize:15
  },
  signup:{
    color:'white',
    fontSize:15
  }
})