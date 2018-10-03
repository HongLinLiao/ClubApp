import * as firebase from 'firebase'
import { setAllClubData, setCurrentClub, removeTheClub } from '../actions/ClubAction'
import { updateUserState } from '../actions/UserAction'
import { setAllSetting } from '../actions/SettingAction'
import { getUserData } from './Data'
import { randomCid } from './Club'
import { Alert } from 'react-native'

/*
|-----------------------------------------------
|   clubs樹相關相關
|-----------------------------------------------
*/
export const listenToAllClubs = () => async (dispatch, getState) => {

    try {
        const { uid } = firebase.auth().currentUser
        const { joinClub, likeClub } = await getUserData(uid)

        if(joinClub) {
            Object.keys(joinClub).map((cid) => {
                const clubRef = firebase.database().ref('clubs').child(cid)
                const memberRef = firebase.database().ref('clubs').child(cid).child('member')
                dispatch(listenToClub(clubRef))
                dispatch(listenToClubsMemberRemove(memberRef))
            })

        }

        if(likeClub) {
            Object.keys(likeClub).map((cid) => {
                const clubRef = firebase.database().ref('clubs').child(cid)
                dispatch(listenToClub(clubRef))
            })
        }

        console.log('listenToClubs OK!')

    } catch(e) {
        console.log(e)
        throw e
    }
}

export const listenToClub = (clubRef) => async (dispatch, getState) => {
    try {
        clubRef.on('value', (dataSnapshot) => {
            const { clubs } = getState().clubReducer
            const newClubs = JSON.parse(JSON.stringify(clubs))
            newClubs[dataSnapshot.key] = dataSnapshot.val()
            dispatch(setAllClubData(newClubs))
        })

    } catch(e) {
        console.log(e)
        throw e
    }
}

export const listenToClubsMemberRemove = (memberRef) => async (dispatch, getState) => {

    try {
        memberRef.on('child_removed', (oldChildSnapshot) => {
            
        })

    } catch(e) {
        console.log(e)
        throw e
    }
}


/*
|-----------------------------------------------
|   users樹相關
|-----------------------------------------------
*/
export const listenToUserClubsRemove = (joinClubRef, likeClubRef) => async (dispatch, getState) => {
    
    try {

        joinClubRef.on('child_removed', (oldChildSnapshot) => {

            const clubRef = firebase.database().ref('clubs').child(oldChildSnapshot.key)
            const { currentCid, clubs } = getState().clubReducer
            const newClubs = JSON.parse(JSON.stringify(clubs))
            let newJoinClub = JSON.parse(JSON.stringify(getState().userReducer.joinClub))
            let newClubNotificationList = JSON.parse(JSON.stringify(getState().settingReducer.clubNotificationList))


            delete newJoinClub[oldChildSnapshot.key]
            delete newClubNotificationList[oldChildSnapshot.key]
            delete newClubs[oldChildSnapshot.key]
            clubRef.off('value')

            const cid = randomCid(newClubs)
            // dispatch(setCurrentClub(cid))
            // dispatch(setAllClubData(newClubs))
            
            dispatch(removeTheClub(newClubs, newJoinClub, newClubNotificationList, cid))

            Alert.alert('已被退出社團！')
        })

        console.log('listenToUserClubs OK!')

    } catch(e) {
        console.log(e)
        throw e
    }
}


export const listenToUser = () => async (dispatch, getState) => {

    try {
        const { uid } = firebase.auth().currentUser
        const userRef = firebase.database().ref('users').child(uid)
        const joinClubRef = firebase.database().ref('users').child(uid).child('joinClub')
        const likeClubRef = firebase.database().ref('users').child(uid).child('likeClub')

        userRef.on('value', (dataSnapshot) => {
            const user = firebase.auth().currentUser
            const { password, loginType, aboutMe, joinClub, likeClub, nickName } = dataSnapshot.val()
            let userData = {
                user,
                password,
                loginType,
                aboutMe: aboutMe ? aboutMe : '', 
                joinClub: joinClub ? joinClub : {},
                likeClub: likeClub ? likeClub : {},
                firstLogin: nickName ? false : true, 
            }

            dispatch(updateUserState(userData))
        })

        dispatch(listenToUserClubsRemove(joinClubRef, likeClubRef))

        console.log('listenToUser OK!')

    } catch(e) {
        console.log(e)
        throw e
    }

}



/*
|-----------------------------------------------
|   userSettings樹相關
|-----------------------------------------------
*/
export const listenToUserSetting = () => async (dispatch, getState) => {

    try {
        const { uid } = firebase.auth().currentUser
        const settingRef = firebase.database().ref('userSettings').child(uid)

        settingRef.on('value', (dataSnapshot) => {
            const { globalNotification, nightModeNotification, clubNotificationList } = dataSnapshot.val()

            let settingData = {
                globalNotification,
                nightModeNotification,
                clubNotificationList: clubNotificationList ? clubNotificationList : {},
            }

            dispatch(setAllSetting(settingData))
        })

        console.log('listenToUserSetting OK!')

    } catch(e) {
        console.log(e)
        throw e
    }
}