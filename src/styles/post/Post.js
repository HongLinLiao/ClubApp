import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        //alignItems: 'center',
        paddingLeft: 20,
        paddingTop: 20
    },
    bigHead: {
        height: 60,
        width: 60,
        borderRadius: 30,
        //marginRight: 15
    },
    circle: {
        width: 60,
        height: 60,
        //borderRadius: 80, 
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    column: {
        flexDirection: 'column',
        //justifyContent: 'center',
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
    postView: {
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 10
    },
    postTitle: {
        color: '#666666',
        fontSize: 28,
        fontWeight: 'bold'
    },
    postDate: {
        color: '#666666',
        fontSize: 13
    },
    postTextView: {
        marginTop: 10
    },
    postText: {
        color: '#666666',
        fontSize: 15,
        lineHeight: 25
    },
    postPictureView: {
        flexDirection: 'row',
        marginTop: 30,
    },
    postPicture: {
        width: 300,
        height: 250
    },
    sbRowLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: 'rgba(102,102,102,0.5)',
        paddingLeft: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    icon: {
        height: 20,
        width: 20
    },
    number: {
        color: '#666666',
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10
    },
    advancedPostBtn: {
        backgroundColor: 'rgba(246,180,86,1)',
        width: 250,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30
    },
    textInput: {//好像可以用%喔
        flex: 1,
        flexDirection: 'row',
        position: "absolute",
        bottom: 0,
        alignItems: 'stretch'
    },
    editPostTitleInput: {
        color: '#666666',
        fontSize: 28,
        fontWeight: 'bold',
    },
    editPostContentInput: {
        color: '#666666',
        fontSize: 20,
        marginTop: 5,
        height: 200,
    },
    editPostbtn: {
        backgroundColor: 'rgba(246,180,86,1)',
        width: 100,
        height: 30,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
    },
    editPostbtnTxt: {
        fontSize: 15,
    },

})
