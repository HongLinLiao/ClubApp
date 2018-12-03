import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: 'row',
        //flexWrap: 'nowrap',
    },
    //aRowView: {
    // height: 250,
    //flex: 1,
    //alignItems:'center',
    // justifyContent: 'space-around',
    //flexDirection: 'row',
    //flexWrap: 'nowrap',



    // },
    posterView: {
        //flex: 0.3333,
        flex: 1,
        borderWidth: 2,
        borderColor: 'white',
        height: 220,
        width: '33.3333%',

    },
    poster: {

        flex: 1,
        opacity: 0.8,
    },
    black: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //height: 246,
        //width: 120,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    actTextView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 10,
    },
    actText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    clubTextView: {
        marginTop: 20,
        marginBottom: 10,
    },
    clubText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    clubImageView: {
        marginTop: 10,

        height: 60,
        width: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',

    },
    clubImage: {
        height: 55,
        width: 55,
        borderRadius: 28,
        borderWidth: 3,
        borderColor: '#ffffff'
    },
    heartView: {
        // marginLeft: 60,
        marginTop: 20,
        // marginRight: 60,
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    heartText: {
        fontSize: 17,
        color: '#ffffff',
    },
    likeIcon: {
        height: 20,
        width: 20,
        marginLeft: 2,
    },
    titleLikesView: {
        height: 18,
        width: 18,
        marginRight: 3,

    }
}



)