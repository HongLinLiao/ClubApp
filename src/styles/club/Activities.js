import { StyleSheet } from 'react-native'

export default StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor:'#ffffff',

  },
  main: {
    flex: 1,

  },
  headView: {
    height: 45,
    backgroundColor: '#f6b456',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  headText: {
    fontSize: 20,
    color: '#666666'
  },
  arrow: {
    height: 30,
    width: 30,
    marginLeft: 10,
  },
  fake: {
    width: 30,
    marginRight: 10,
  },
  clubBackground: {
    height: 300,
    width: '100%',
    marginRight: 10,
    // justifyContent: 'flex-end',
  },
  clubTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  collect: {
    //backgroundColor:'#666666',
    height:25,
    width: 25,
    marginTop: 20,
    marginRight: 20,

  },
  titleLikesView: {
    height: 18,
    width: 18,
    marginRight: 3,


  },
  clubText: {
    fontSize: 15,
    //fontWeight:'bold',
    color: '#666666',
    marginLeft: 2,
    marginTop: 20,
  },
  schoolText: {
    fontSize: 15,
    color: '#666666',
    marginLeft: 20,
    marginTop: 20,
  },

  actText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 7,
    marginBottom: 7,
    color: '#666666'
  },

  titleText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 6,
    marginTop: 20,
  },
  summaryTextView: {
    marginLeft: 20,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {

    height: 18,
    width: 18,
    marginLeft: 5,
  },
  summaryText: {
    fontSize: 14,
    color: '#666666',
    margin: 7,
  },
  toText: {
    fontSize: 14,
    color: '#666666',

  },

  mapView: {
    flex: 1,
    //borderWidth:1,
    height: 200,
    marginLeft: 30,
    marginRight: 30,
  },
  map: {
    flex: 1,
  },
  titleContentText: {
    fontSize: 17,
    color: 'rgb(102, 102, 102)',

    lineHeight: 25,
  },
  divide: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 102, 102, 0.25)',
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 6,
  },
  divideN: {
    marginLeft: 20,
    marginRight: 20,
  },
  more: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 20,
    color: 'rgba(102, 102, 102, 0.5)',
    fontSize: 16,
    paddingTop: 5,
  },

  intrestView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendView: {
    height: 120,
    width: 160,
    backgroundColor: '#666666',
    borderRadius: 30,
    margin: 10,
  },
  number: {
    color: "#666666",
    fontSize: 10,
    marginRight: 15,
    marginTop: 10,



  },
  like: {
    flexDirection: 'row',
    marginTop: 12,




  },
});
