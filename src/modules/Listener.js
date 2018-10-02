import * as firebase from 'firebase'
import { setAllClubData, setCurrentClub, removeTheClub, addTheClub } from '../actions/ClubAction'
import { updateUserState } from '../actions/UserAction'
import { setAllSetting } from '../actions/SettingAction'
import { getUserData, getClubData } from './Data'
import { randomCid, getAllClubData } from './Club'
import { getUserSettingToRedux } from './User'
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
                // dispatch(listenToClubsMemberRemove(memberRef))
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
        clubRef.on('child_changed', (dataSnapshot) => {

            if(dataSnapshot.key != 'member') {
                const { clubs } = getState().clubReducer
                const newClubs = JSON.parse(JSON.stringify(clubs))
                const cid = dataSnapshot.ref.parent.key
                newClubs[cid][dataSnapshot.key] = dataSnapshot.val()
                dispatch(setAllClubData(newClubs))
            }

        })

    } catch(e) {
        console.log(e)
        throw e
    }
}

export const listenToClubMemberAdd = (memberRef) => async (dispatch, getState) => {
    try {
        memberRef.on('child_added', (childSnapshot) => {
            
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
export const listenToUser = () => async (dispatch, getState) => {

    try {
        const { uid } = firebase.auth().currentUser
        const userRef = firebase.database().ref('users').child(uid)
        const joinClubRef = firebase.database().ref('users').child(uid).child('joinClub')
        const likeClubRef = firebase.database().ref('users').child(uid).child('likeClub')
        
        // dispatch(listenToUserProfile(userRef))
        dispatch(listenToUserClubsAdd(joinClubRef, likeClubRef))
        dispatch(listenToUserClubsRemove(joinClubRef, likeClubRef))

        console.log('listenToUser OK!')

    } catch(e) {
        console.log(e)
        throw e
    }

}

export const listenToUserProfile = (userRef) => async (dispatch, getState) => {

    try {
        userRef.on('child_changed', (dataSnapshot) => {
            const { key, val } = dataSnapshot

            if(key != 'joinClub' || key != 'likeClub') {
                const user = firebase.auth().currentUser
                const { } = getState().userReducer
                const newUserData = JSON.parse(JSON.stringify(userData)) 

                if(key == 'nickName') {
                    newUserData.firstLogin = val() ? false : true
                    newUserData.user = user
                } else if (key == 'eamil' || key == 'photoUrl') {
                    newUserData.user = user
                } else {
                    newUserData[key] = val()
                }

                dispatch(updateUserState(newUserData))
            }

        })

    } catch(e) {
        console.log(e)
        throw e 
    }
}

export const listenToUserClubsAdd = (joinClubRef, likeClubRef) => async (dispatch, getState) => {

    try {
        joinClubRef.on('child_added', async (childSnapshot) => {

            const cid = childSnapshot.key
            const { uid } = firebase.auth().currentUser
            const clubs = await getAllClubData()
            const newClub = await getClubData(cid)
            const { joinClub } = await getUserData(uid)
            const { clubNotificationList } = await getUserSettingToRedux()

            //資料庫修改
            newClub.member = newClub.member ? newClub.member : {}
            newClub.member[uid] = { status: 'member' }
            

            //redux修改
            clubs[cid] = newClub
            joinClub[cid] = true
            clubNotificationList[cid] = { on: true }

            console.log(clubs)
            //redux更新
            dispatch(addTheClub(clubs, joinClub, clubNotificationList))
            // // dispatch(ClubAction.setCurrentClub(cid))
        })

    } catch(e) {
        console.log(e)
        throw e
    }
}

export const listenToUserClubsRemove = (joinClubRef, likeClubRef) => async (dispatch, getState) => {
    
    try {

        joinClubRef.on('child_removed', (oldChildSnapshot) => {

            const { key } = oldChildSnapshot
            const clubRef = firebase.database().ref('clubs').child(key)
            const memberRef = firebase.database().ref('clubs').child(key).child('member')
            const { currentCid, clubs } = getState().clubReducer
            const { joinClub } = getState().userReducer
            const { clubNotificationList } = getState().settingReducer

            let newClubs = JSON.parse(JSON.stringify(clubs))
            let newJoinClub = JSON.parse(JSON.stringify(joinClub))
            let newClubNotificationList = JSON.parse(JSON.stringify(clubNotificationList))


            delete newJoinClub[key]
            delete newClubNotificationList[key]
            delete newClubs[key]
            
            clubRef.off('child_changed')

            const cid = randomCid(newClubs)
            
            dispatch(removeTheClub(newClubs, newJoinClub, newClubNotificationList, cid))

            Alert.alert('已退出 ' + clubs[key].schoolName + ' ' + clubs[key].clubName)
        })

        console.log('listenToUserClubs OK!')

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