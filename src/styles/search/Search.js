import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  search: {
    height: 18,
    width: 18,
    marginRight: 10
  },
  searchView: {
    height: 35,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(102,102,102,0.2)",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  searchText: {
    fontSize: 18,
    color: "rgba(102,102,102,0.5)",
    paddingLeft: 10
  },
  card: {
    //flex: 1,
    height: 300,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderColor: "rgba(102,102,102,0.4)"
  },
  clubBackground: {
    flex: 5,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  placeView: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  placeText: {
    color: "#f0f0f0",
    fontSize: 12
  },
  place: {
    height: 12,
    width: 12,
    marginRight: 10
  },
  clubNameView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(102,102,102,0.5)",
    marginHorizontal: 10
  },
  clubNameText: {
    fontSize: 21,
    fontWeight: "bold",
    marginLeft: 10
  },
  clubIntroView: {
    flex: 2,
    // paddingVertical: 10,
    // paddingLeft: 150,
    // paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubIntroText: {
    fontSize: 18,
    color: "rgba(102,102,102,0.8)"
  },
  clubStatusText: {
    fontSize: 18,
    color: "red",
    marginRight: 5,
  },
  tabBar: {
    height: 50,
    backgroundColor: "#f6b456"
  }
});
