import * as firebase from 'firebase'
import { setAllClubData, setCurrentClub, removeTheClub, addTheClub } from '../actions/ClubAction'
import { updateUserState } from '../actions/UserAction'
import { setAllSetting } from '../actions/SettingAction'
import { setClubListen } from '../actions/CommonAction'
import { getUserData, getClubData, getUserSetting } from './Data'
import { randomCid, getAllClubData, filterOpenClub } from './Club'
import { getUserSettingToRedux } from './User'
import { joinOrLikeClub } from './Common'
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
                // const a = await memberRef.once('value')
                // a.child('aaa').exists
                // dispatch(listenToClub(clubRef))
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
        //監聽社團基本資料改變
        clubRef.on('child_changed', (childSnapshot) => {

            if(childSnapshot.key != 'member') {
                const cid = childSnapshot.ref.parent.key
                const { joinClubs, likeClubs, currentCid } = getState().clubReducer
                const { joinClub, likeClub } = getState().userReducer
                const newJoinClubs = JSON.parse(JSON.stringify(joinClubs))
                const newLikeClubs = JSON.parse(JSON.stringify(likeClubs))
                const type = joinOrLikeClub(cid)

                if(type == 'JOIN') {
                    newJoinClubs[cid][childSnapshot.key] = childSnapshot.val()
                }
                else if (type == 'LIKE') {
                    newLikeClubs[cid][childSnapshot.key] = childSnapshot.val()
                    if(childSnapshot.key == 'open') {
                        const open = childSnapshot.val()
                        if(!open && currentCid == cid) { //蒐藏社團被關閉的時候剛好也在這個社團
                            const _cid = randomCid(Object.keys(newJoinClubs))
                            dispatch(setCurrentClub(_cid))
                        }
                    }
                }

                dispatch(setAllClubData({newJoinClubs, newLikeClubs}))
            }
        })

        // clubRef.child('member').on('child_added',(childSnapshot) => {
        //     const { uid } = firebase.auth().currentUser
        //     console.log(childSnapshot.key)
        //     if(dataSnapshot.key != uid) {
        //         console.log()
        //     }
        // })

        // clubRef.child('member').on('child_removed', (oldChildSnapshot) => {
        //     const { uid } = firebase.auth().currentUser
        //     console.log(oldChildSnapshot.key)
        //     if(dataSnapshot.key != uid) {
        //         console.log()
        //     }

        // })

        clubRef.child('member').on('value', async (dataSnapshot) => {
            const { uid } = firebase.auth().currentUser
            const cid = dataSnapshot.ref.parent.key
            const type = joinOrLikeClub(cid)
            console.log(dataSnapshot.ref.parent.key)
            console.log(type)
            const isInClub = dataSnapshot.child(uid).exists() //使用者有沒有存在這個社團
            if(isInClub || type == 'LIKE') { //自己還在社團內代表別人加入/退出社團
                const { joinClubs, likeClubs } = getState().clubReducer
                const { joinClub, likeClub } = getState().userReducer
                const newJoinClubs = JSON.parse(JSON.stringify(joinClubs))
                const newLikeClubs = JSON.parse(JSON.stringify(likeClubs)) 

                if(type == 'JOIN') {
                    newJoinClubs[cid][dataSnapshot.key] = dataSnapshot.val()
                }
                else if (type == 'LIKE') {
                    newLikeClubs[cid][dataSnapshot.key] = dataSnapshot.val()
                }

                dispatch(setAllClubData({newJoinClubs, newLikeClubs}))
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

    } catch(e) {
        console.log(e)
        throw e
    }

}

export const listenToUserClubsAdd = (joinClubRef, likeClubRef) => async (dispatch, getState) => {

    try {
        //監聽加入社團
        joinClubRef.on('child_added',(childSnapshot) => {
            dispatch(clubAdd(childSnapshot, 'JOIN'))
        })
        
        //監聽蒐藏社團
        likeClubRef.on('child_added', (childSnapshot) => {
            dispatch(clubAdd(childSnapshot, 'LIKE'))
        })

        console.log('listenToUserClubsAdd OK!')

    } catch(e) {
        console.log(e)
        throw e
    }
}

export const listenToUserClubsRemove = (joinClubRef, likeClubRef) => async (dispatch, getState) => {
    
    try {
        //監聽加入社團刪除
        joinClubRef.on('child_removed', (oldChildSnapshot) => {
            dispatch(clubRemove(oldChildSnapshot, 'JOIN'))
        })

        //監聽收藏社團刪除
        likeClubRef.on('child_removed', (oldChildSnapshot) => {
            dispatch(clubRemove(oldChildSnapshot, 'LIKE'))
        })

        console.log('listenToUserClubsRemove OK!')

    } catch(e) {
        console.log(e)
        throw e
    }
}

const clubAdd = (childSnapshot, clubType) => async (dispatch, getState) => {

    try {
        if(childSnapshot.val()) {
            const cid = childSnapshot.key
            const { uid } = firebase.auth().currentUser
            const newClub = await getClubData(cid)
            const newUserSetting = await getUserSetting(uid)
            const clubRef = firebase.database().ref('clubs').child(cid)

            const { joinClubs, likeClubs } = getState().clubReducer
            const { joinClub, likeClub } = getState().userReducer
            const { clubNotificationList } = getState().settingReducer

            const newJoinClubs = JSON.parse(JSON.stringify(joinClubs))
            const newLikeClubs = JSON.parse(JSON.stringify(likeClubs))
            const newJoinClub = JSON.parse(JSON.stringify(joinClub))
            const newLikeClub = JSON.parse(JSON.stringify(likeClub))
            const newClubNotificationList = JSON.parse(JSON.stringify(clubNotificationList))
            
            const joinClubNumber = Object.keys(newJoinClub).length
            const likeClubNumber = Object.keys(newLikeClub).length

            //redux修改
            if(clubType == 'JOIN') {
                newJoinClubs[cid] = newClub
                newJoinClub[cid] = true
            }
            else if (clubType == 'LIKE') {
                newLikeClubs[cid] = newClub
                newLikeClub[cid] = true
            }

            newClubNotificationList[cid] = newUserSetting.clubNotificationList[cid]

            //redux更新
            dispatch(addTheClub({newJoinClubs, newLikeClubs}, {newJoinClub, newLikeClub}, newClubNotificationList))
            if((joinClubNumber + likeClubNumber) == 0) dispatch(setCurrentClub(cid)) //原本沒有社團

            //監聽新增的club
            dispatch(listenToClub(clubRef))
        }

    } catch(e) {
        console.log(e)
        throw e
    }
}

const clubRemove = (oldChildSnapshot, clubType) => async (dispatch, getState) => {
    try {
        const { key } = oldChildSnapshot
        const clubRef = firebase.database().ref('clubs').child(key)
        const { joinClubs, likeClubs } = getState().clubReducer
        const { joinClub, likeClub } = getState().userReducer
        const { clubNotificationList } = getState().settingReducer

        let newJoinClubs = JSON.parse(JSON.stringify(joinClubs))
        let newLikeClubs = JSON.parse(JSON.stringify(likeClubs))
        let newJoinClub = JSON.parse(JSON.stringify(joinClub))
        let newLikeClub = JSON.parse(JSON.stringify(likeClub))
        let newClubNotificationList = JSON.parse(JSON.stringify(clubNotificationList))

        if(clubType == 'JOIN') {
            delete newJoinClub[key]
            delete newJoinClubs[key]
        } 
        else if (clubType == 'LIKE') {
            delete newLikeClub[key]
            delete newLikeClubs[key]
        }

        delete newClubNotificationList[key]

        const _newLikeClubs = filterOpenClub(newLikeClubs)
        const allClubCids = Object.keys(newJoinClubs).concat(Object.keys(_newLikeClubs))
        const cid = randomCid(allClubCids)
        
        dispatch(removeTheClub({newJoinClubs, newLikeClubs}, {newJoinClub, newLikeClub}, newClubNotificationList, cid))

        //取消監聽此社團
        clubRef.off('child_changed')

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
        //初始化不會執行
        settingRef.on('child_changed', (dataSnapshot) => {
            
            if(dataSnapshot.key != 'clubNotificationList') {
                const { settingReducer } = getState()
                const settingData = JSON.parse(JSON.stringify(settingReducer))
                settingData[dataSnapshot.key] = dataSnapshot.val()
                dispatch(setAllSetting(settingData))
            }
            
        })

        console.log('listenToUserSetting OK!')

    } catch(e) {
        console.log(e)
        throw e
    }
}