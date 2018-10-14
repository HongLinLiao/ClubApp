import { StyleSheet } from 'react-native'

export default StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white'
},
headView: {
    alignSelf: 'stretch',
    height: 45,
    backgroundColor: '#f6b456',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
},
leftIcon: {
    height: 22,
    width: 22,
    marginLeft: 15,
},
rightIcon: {
    height: 25,
    width: 25,
    marginLeft: 10,
    marginRight: 10
},
headText: {
    color: '#666666',
    fontSize: 20,
    alignSelf: 'center'
},
row: {
    flexDirection: 'row',
    alignItems: 'center',
},
rowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingTop: 20
},
bigHead: {
    height: 60,
    width: 60,
    borderRadius: 50,
    marginRight: 15
},
column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
},
school: {
    color: '#666666',
    fontSize: 15,
    marginRight: 5
},
club: {
    color: '#666666',
    fontSize: 20,
    margin: 5,
    fontWeight: 'bold'
},
name: {
    color: '#666666',
    fontSize: 15,
    marginRight: 5
},
job: {
    color: '#666666',
    fontSize: 15,
    margin: 5
},
date: {
    color: '#666666',
    fontSize: 13,
    marginLeft: 20
},
bigTextInput: {
    fontSize: 28,
    alignSelf: 'stretch',
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 5,
    marginTop:10,
    color: 'rgba(102,102,102,1)'
},
littleTextInput: {
    fontSize: 15,
    alignSelf: 'stretch',
    marginLeft: 20,
    marginTop: 10,
    color: 'rgba(102,102,102,0.7)'
},
tabBar: {
    height: 50,
    backgroundColor: 'rgba(246,180,86,1)',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
},
barIcon: {
    height: 27,
    width: 27,
    marginRight: 15,
    marginLeft: 15
},

})