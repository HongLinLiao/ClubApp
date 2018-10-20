import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: "white"
  },
  headView: {
    alignSelf: "stretch",
    height: 45,
    backgroundColor: "#f6b456",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  leftIcon: {
    height: 30,
    width: 30,
    marginLeft: 10
  },
  rightIcon: {
    height: 20,
    width: 20,
    marginLeft: 10,
    marginRight: 10
  },
  headText: {
    color: "#666666",
    fontSize: 20,
    alignSelf: "center"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  rowLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 20,
    paddingTop: 20
  },
  bigHead: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 15
  },
  column: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  school: {
    color: "#666666",
    fontSize: 15,
    marginRight: 5
  },
  club: {
    color: "#666666",
    fontSize: 20,
    margin: 5,
    fontWeight: "bold"
  },
  name: {
    color: "#666666",
    fontSize: 15,
    marginRight: 5
  },
  job: {
    color: "#666666",
    fontSize: 15,
    margin: 5
  },
  postView: {
    flexDirection: "column",
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10
  },
  postTitle: {
    color: "#666666",
    fontSize: 28,
    fontWeight: "bold"
  },
  postDate: {
    color: "#666666",
    fontSize: 13
  },
  postTextView: {
    marginTop: 10
  },
  postText: {
    color: "#666666",
    fontSize: 15,
    lineHeight: 25
  },
  postPictureView: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10
  },
  postPicture: {
    width: "100%",
    height: 250
  },
  sbRowLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "rgba(102,102,102,0.5)",
    paddingLeft: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  sbRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  icon: {
    height: 20,
    width: 20
  },
  number: {
    color: "#666666",
    fontSize: 10,
    marginLeft: 10,
    marginRight: 10
  },
  rowPadding: {
    flexDirection: "row",
    margin: 5
  },
  littleHead: {
    height: 40,
    width: 40,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 10,
    borderRadius: 20
  },
  columnLine: {
    flexDirection: "column",
    borderBottomWidth: 0.5,
    borderColor: "rgba(102,102,102,0.2)",
    flex: 1,
    padding: 5
  },
  littleSchool: {
    color: "#666666",
    fontSize: 14,
    marginRight: 8
  },
  littleClub: {
    color: "#666666",
    fontSize: 18
  },
  numberLittle: {
    color: "#666666",
    fontSize: 12,
    margin: 5,
    marginRight: 15
  },
  littleName: {
    color: "#666666",
    fontSize: 14,
    marginRight: 8
  },
  littleJob: {
    color: "#666666",
    fontSize: 14
  },
  comment: {
    color: "#666666",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  tabBar: {
    height: 50,
    backgroundColor: "rgba(246,180,86,1)",
    alignSelf: "stretch"
  },
  tabBarView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 10,
    flex: 1
  },
  inputView: {
    height: 35,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8
  },
  textInput: {
    height: 35,
    alignSelf: "stretch"
  },
  sendIcon: {
    height: 22,
    width: 22,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 8
  },
  rowPaddingInput: {
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: "rgba(246,180,86,1)",
    justifyContent: "space-between"
  },
  columnTabBar: {
    flexDirection: "column",
    flex: 1,
    padding: 5
  },
  inputViewTabBar: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
    marginBottom: 7,
    paddingLeft: 10,
    paddingRight: 10
  },
  textInputTabBar: {
    alignSelf: "stretch",
    color: "#666666"
  },
  sbColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 5
  },
  iconClose: {
    height: 13,
    width: 13,
    marginTop: 8
  }
});
