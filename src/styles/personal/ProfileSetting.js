import { StyleSheet } from 'react-native'
export default StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    person: {
        width: 100,
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    personImage: {
        borderRadius: 50
    },
    cameraIcon: {
        height: 30,
        width: 30,
        margin: 5
    },
    nameView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(246,180,86,0)',
        borderBottomWidth: 2,
        borderColor: 'rgba(246,180,86,0.4)',
        flex: 1,
        paddingRight: 8,
        paddingLeft: 8,
        paddingBottom: 3
    },
    empty: {
        height: 28,
        width: 28,
    },
    nameInput: {
        backgroundColor: 'rgba(246,180,86,0)',
        textAlign: 'center',
        fontSize: 20,
        flex: 1
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        flex: 1,
        margin:5
    },
    hotPoint: {
        height: 18,
        width: 18,
        marginRight: 5
    },
    number: {
        color: '#666666',
        fontSize: 20
    },
    aboutMeView: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 20,
        borderColor: 'rgba(246,180,86,0.4)',
        flex: 4.5,
        marginLeft: 50,
        marginRight: 50
    },
    aboutMeInput: {
        margin: 5,
        color: '#666666',
        backgroundColor: 'rgba(246,180,86,0)',
        alignSelf: 'center',
        textAlign:'center',
        flex: 1
    },
    save: {
        borderRadius: 12,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 2,
        borderColor: 'rgba(246,180,86,0.6)',
        justifyContent: 'center',
        width:95,
        height:35
        //flex: 1,
        //marginTop:22,
        //marginBottom:22
    },
    saveText: {
        color: '#666666',
        fontSize: 15,
        alignSelf: 'center'
    },
    one: {
        flex: 6.3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    two: {
        flex: 2.5,
        marginLeft: 50,
        marginRight: 50,
    },
    four: {
        flex: 2.3,
        //marginLeft: 160,
        //marginRight: 160
        justifyContent:'center',
        alignItems:'center'
    },
})