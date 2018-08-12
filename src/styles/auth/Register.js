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
    paddingBottom:50
  },
  Q:{
    color:'white',
    fontSize:15,
    alignSelf: 'center',
    margin:6
  },
  textInput:{
    marginBottom:17,
    width:230,
    height:37,
    color:'white',
    backgroundColor:'rgba(255,255,255,0.4)',
    borderRadius:7,
    textAlign:'center'    
  },
  okBotton:{
    backgroundColor:'rgba(255,255,255,0)',
    margin:38,
    borderWidth:1,
    borderColor:'white',
    width:140,
    height:35,
    borderRadius: 50,
    justifyContent:'center'
  },
  okText:{
    color:'white',
    fontSize:15,
    alignSelf: 'center'
  },
  backText:{
    color:'white',
    fontSize:15,
    alignSelf: 'center',
    paddingTop:10
  }
})