import { StyleSheet } from 'react-native'
export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    empty: {
        width: 40
    },
    person: {
        marginTop: 50,
        marginBottom: 50,
        width: 130,
        height: 130,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    personImage: {
        borderRadius: 65
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
        width: 295,
        height: 50,
        borderBottomWidth: 2,
        borderWidth: 0,
        borderColor: 'rgba(246,180,86,0.4)',
        marginBottom: 10
    },
    nameInput: {
        width: 225,
        height: 50,
        // color: '#666666',
        backgroundColor: 'rgba(246,180,86,0)',
        textAlign: 'center',
        fontSize: 30
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    hotPoint: {
        height: 28,
        width: 28,
        marginRight: 5
    },
    number: {
        color: '#666666',
        fontSize: 25
    },
    aboutMeView: {
        flexDirection: 'row',
        marginBottom: 20,
        padding: 10,
        width: 295,
        justifyContent: 'center',
        height: 170,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 2,
        borderRadius: 20,
        borderColor: 'rgba(246,180,86,0.4)',
        marginTop: 10
    },
    aboutMeInput: {
        width: 225,
        height: 150,
        color: '#666666',
        backgroundColor: 'rgba(246,180,86,0)',
        textAlign: 'center'
    },
    save: {
        marginBottom: 35,
        width: 80,
        height: 30,
        borderRadius: 12,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 2,
        borderColor: 'rgba(246,180,86,0.6)',
        justifyContent: 'center'
    },
    saveText: {
        color: '#666666',
        fontSize: 16,
        alignSelf: 'center'
    }
})