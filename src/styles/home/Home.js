import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1
  },
  headView: {
    height: 45,
    backgroundColor: "#f6b456",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  headText: {
    color: "#666666",
    fontSize: 25
  },
  fake: {
    width: 50
  },
  controlImage: {
    height: 30,
    width: 30,
    marginRight: 13
  },
  containView: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ffffff"
  },
  newsView: {
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(102,102,102,0.25)",
    height: 130,
    flexDirection: "row",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5
  },
  shadow: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "rgba(102,102,102,1)",
    shadowRadius: 10,
    height: 50,
    width: 50,
    borderRadius: 30,
    elevation: 10,
    marginTop:30
  },

  managerImageView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    flex: 1,
  },

  newsTextView: {
    marginLeft: 8,
    marginRight: 8,
    flexDirection: "column",
    flex: 8
  },
  clubAndManagerNameView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 3,
    //borderWidth:1
  },
  schoolNameView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 3
    //borderWidth:1
  },
  newsClubText: {
    color: "#666666",
    paddingRight: 5,
    fontSize: 15
  },
  newsManagerText: {
    color: "#666666",
    fontSize: 10
  },
  actNameAndDateView: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 3,
    //borderWidth:1
  },
  newsNameText: {
    color: "#666666",
    fontSize: 23
  },
  newsDateText: {
    color: "#666666",
    fontSize: 10
  },

  newsContentView: {
    flex: 1.3
  },
  newsContentText: {
    color: "#666666",
    fontSize: 15,
    height: "100%",
    lineHeight: 25
  },
  moreText: {
    fontSize: 15,
    color: "#123456"
  },
  iconView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  aIcon: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 10
  },
  icon: {
    height: 18,
    width: 18,
    marginRight: 3
  },
  iconNumber: {
    color: "#666666",
    fontSize: 15
  },

  star: {
    position: "absolute",
    top: 450, //與最上端的距離
    right: 25 //與右邊的距離
  },
  starButtonView: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 100,
    backgroundColor: "#f6b456",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#000000",
    shadowRadius: 10,
    shadowOpacity: 0.7,
    elevation: 10
  },

  starImage: {
    width: 40,
    height: 40
  },
  tabBar: {
    height: 50,
    backgroundColor: "#f6b456"
  }
});
