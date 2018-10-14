import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "white"
  },
  title: {
    color: "rgba(102,102,102,1)",
    fontSize: 20,
    alignSelf: "center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  botton: {
    height: 90,
    width: 130,
    backgroundColor: "rgba(246,180,86,0.3)",
    borderRadius: 15,
    margin: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginBottom: 100,
    marginTop: 75
  },
  bottonText: {
    color: "rgba(102,102,102,1)",
    fontSize: 17,
    paddingTop: 6
  },
  lockIcon: {
    height: 28,
    width: 28,
    margin: 6
  },
  unlockIcon: {
    height: 28,
    width: 28,
    margin: 6
  },
  okBotton: {
    height: 35,
    width: 95,
    backgroundColor: "rgba(0,205,205,1)",
    borderRadius: 20,
    justifyContent: "center"
  },
  okText: {
    color: "rgba(255,255,255,1)",
    fontSize: 17,
    alignSelf: "center"
  }
});
