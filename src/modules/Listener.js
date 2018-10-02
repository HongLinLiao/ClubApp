import * as firebase from 'firebase'
import * as ClubAction from '../actions/ClubAction'
import * as UserAction from '../actions/UserAction'
import { getUserData } from './Data'


export const listenToClubs = () => async (dispatch, getState) => {

    try {
        const { uid } = firebase.auth().currentUser
        const { joinClub, likeClub } = await getUserData(uid)

        
        if(joinClub) {
            Object.keys(joinClub).map((cid) => {
                const clubRef = firebase.database().ref('clubs').child(cid)
                clubRef.on('value', (dataSnapshot) => {
                    const { clubs } = getState().clubReducer
                    const newClubs = JSON.parse(JSON.stringify(clubs))
                    newClubs[dataSnapshot.key] = dataSnapshot.val()
                    dispatch(ClubAction.setAllClubData(newClubs))
                })
            })
        }

        if(likeClub) {
            Object.keys(likeClub).map((cid) => {
                const clubRef = firebase.database().ref('clubs').child(cid)
                clubRef.on('value', (dataSnapshot) => {
                    const { clubs } = getState().clubReducer
                    const newClubs = JSON.parse(JSON.stringify(clubs))
                    newClubs[dataSnapshot.key] = dataSnapshot.val()
                    dispatch(ClubAction.setAllClubData(newClubs))
                })
            })
        }

        console.log('listenToClubs OK!')

    } catch(e) {
        console.log(e)
        throw e
    }
}


export const listenToUserClubs = () => async (dispatch, getState) => {

    try {
        const { uid } = firebase.auth().currentUser
        const joinClubRef = firebase.database().ref('users').child(cid).child('joinClub')
        const likeClubRef = firebase.database().ref('users').child(cid).child('likeClub')

        joinClubRef.on('value', (dataSnapshot) => {

            const { joinClub } = getState().userReducer
            let newJoinClub = JSON.parse(JSON.stringify(joinClub))

            // dispatch(UserAction.update)
        })

        likeClubRef.on('value', (dataSnapshot) => {

        })

        console.log('listenToUser OK!')

    } catch(e) {
        console.log(e)
        throw e
    }

}