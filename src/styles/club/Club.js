import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1
  },
  modal: {
    position: "absolute",
    top: 25, //與最上端的距離
    right: 150, //與右邊的距離
    width: 180,
    height: 20,
    backgroundColor: "rgba(255, 157, 0, 0.5)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  modalText: {
    fontSize: 12,
    color: "#092D4E"
  },
  modalDown: {
    width: 230,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.95)"
  },
  modalDownText: {
    fontSize: 20,
    color: "#0d4273",
    backgroundColor: "rgba(255,255,255,0.1)",
    margin: 4
  },
  clubBackground: {
    height: 400,
    justifyContent: "flex-end"
  },
  clubInfoView: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 20,
    marginBottom: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.45)"
  },
  clubTextView: {
    flexDirection: "row"
  },
  schoolText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold"
    //paddingBottom: 10,
  },
  clubTopNameText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    paddingTop: 8
  },
  numberext: {
    fontSize: 14,
    color: "#ffffff",
    paddingTop: 10,
    paddingLeft: 15
  },
  clubLeftTextView: {
    flexDirection: "column",
    justifyContent: "center"
  },
  clubRightTextView: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingLeft: 40,
    paddingRight: 8
  },
  calanderButton: {
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: "#f6b456",
    alignItems: "center",
    justifyContent: "center"
  },
  iconCalendar: {
    height: 35,
    width: 35
  },
  adminButtonView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5
  },
  adminButton: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 5
  },
  adminText: {
    fontSize: 12,
    padding: 5,
    color: "#666666"
  },
  adminIcon: {
    width: 35,
    height: 35
    //backgroundColor: '#d0d0d0',
    //borderRadius: 100,
  },
  clubSummaryView: {
    paddingLeft: 30,
    paddingRight: 30
  },
  clubSummaryText: {
    fontSize: 19,
    color: "rgba(102,102,102,0.5)",
    lineHeight: 32
  },
  clubActivity: {
    width: 150,
    height: 100,
    borderRadius: 30,
    margin: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  borderRadius30: {
    borderRadius: 30
  },
  titleTextView: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(102,102,102,0.25)"
  },
  titleText: {
    fontSize: 18,
    color: "#666666"
  },
  heartView: {
    margin: 10,
    flexDirection: "row"
  },
  heartText: {
    fontSize: 20,
    color: "#ffffff"
  },
  likeIcon: {
    height: 25,
    width: 25
  },
  moreView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  moreText: {
    fontSize: 15,
    color: "rgba(102,102,102,0.5)"
  },
  newsView: {
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(102,102,102,0.25)",
    //height: 160,
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5
  },
  shadow: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "rgba(102,102,102,1)",
    shadowRadius: 10,
    height: 50,
    width: 50,
    borderRadius: 30
  },

  managerImageView: {
    height: 50,
    width: 50,
    borderRadius: 25,
    flex: 1
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
    marginBottom: 5
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5
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
    flex: 3
  },
  newsContentText: {
    color: "#666666",
    fontSize: 15,
    height: "100%",
    lineHeight: 25
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
    height: 15,
    width: 15,
    marginRight: 3
  },
  iconNumber: {
    color: "#666666",
    fontSize: 11
  },
  arrow: {
    height: 20,
    width: 20
  },

  tabBar: {
    height: 50,
    backgroundColor: "#f6b456"
  },
  joinAndLikeView: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  joinAndLikeTouch: {
    height: 35,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: 6
  },
  joinAndLikeText: {
    fontSize: 16
  }
});
