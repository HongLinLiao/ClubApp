import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    main: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    headView: {
        alignSelf: 'stretch',
        height: 45,
        backgroundColor: '#f6b456',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    image: {
        flex: 1,
        alignItems:'center',
        width: '100%',
        height:300,
        flexDirection: "column",
        justifyContent: 'center',
    },
    
    leftIcon: {
        height: 30,
        width: 30,
        marginLeft: 10
    },
    headText: {
        color: '#666666',
        fontSize: 20,
        alignSelf: 'center'
    },
    empty: {
        width: 40
    },
    scroll: {
        flex: 1
    },
    title: {
        color: '#666666',
        fontSize: 20,
        
    },
    graycamera: {
        height: 50,
        width: 50,
        
    },
    bigText: {
        color: '#666666',
        fontSize: 18
    },
    toText: {
        color: '#666666',
        fontSize: 22,
        marginRight: 15
    },
    line: {
        alignSelf: 'stretch',
        height: 0.5,
        backgroundColor: '#666666'
    },
    nameView: {
        width: 300,
        height: 35,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        // flexDirection: 'row'
    },
    nameInput: {
        height: 35,
        fontSize: 15,
        color: '#0d4273',
        marginLeft: 15
    },
    row: {

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5

    },
    calendarIcon: {
        height: 25,
        width: 25,
        marginRight: 5
    },
    searchIcon: {
        height: 15,
        width: 15,
    },

    littleText: {
        width: 250,
        fontSize: 15,
        color: 'rgba(102,102,102,0.5)',

    },
    littleTextView: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(102,102,102,0.5)',
        margin: 5
    },
    searchTextView: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(102,102,102,0.5)',
        padding: 2
    },
    calenderText: {
        color: 'rgba(102,102,102,0.5)',
        fontSize: 15,
        width: 250,

    },


    inputView: {
        borderColor: 'rgba(102,102,102,0.5)',
        borderWidth: 0.5,
        marginBottom: 15,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },

    inputText: {
        alignItems: 'stretch',
        fontSize: 15,
        color: 'rgba(102,102,102,1)'
    },
    save: {
        marginBottom: 15,
        width: 90,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(246,180,86,0)',
        borderWidth: 2,
        borderColor: 'rgba(246,180,86,0.6)',
        justifyContent: 'center'
    },
    saveText: {
        color: '#666666',
        fontSize: 16,
        alignSelf: 'center'
    },

})