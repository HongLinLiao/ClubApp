import * as firebase from 'firebase'
require("firebase/functions")
const GOOGLE_MAP_API = 'AIzaSyBAqWCGCH2u8pZrJ9fkC7slorc9tosInk0'


export const autocompletePlace = async (text) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&language=ZH-TW&components=country:TW&key=${GOOGLE_MAP_API}`)
        const result = await response.json()

        console.log(result)

        return result

    } catch(e) {
        console.log(e.toString())
        throw e
    }
}

export const geocodingPlaceId = async (place_id) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&language=ZH-TW&key=${GOOGLE_MAP_API}`)
        const result = await response.json()

        console.log(result)
        return result

    } catch(e) {
        console.log(e.toString())
        throw e
    }
}


export const sendPostNotification = async (cid, postData, club) => {
    try {
        const user = firebase.auth().currentUser
        const { schoolName, clubName } = club
        const notifyToClubMember = firebase.functions().httpsCallable('notifyToClubMember')
        const data = {
            cid,
            title: `${schoolName} ${clubName} 發布了一篇貼文`,
            body: `${postData.title}--${user.displayName}`,
        }
        await notifyToClubMember(data)

    } catch(e) {
        console.log(e.toString())
        throw e
    }
}

export const sendActivityNotification = async (cid, activityData, club) => {
    try {
        const user = firebase.auth().currentUser
        const { schoolName, clubName } = club
        const notifyToClubMember = firebase.functions().httpsCallable('notifyToClubMember')
        const data = {
            cid,
            title: `${schoolName} ${clubName} 新增了一項新的活動!`,
            body: `${activityData.title}--${user.displayName}`,
        }
        await notifyToClubMember(data)

    } catch(e) {
        console.log(e.toString())
        throw e
    }
}


export const getUserRecord = async (uid) => {
    try {
        if(uid) {
            const userRecord = await fetch(`https://us-central1-clubapp-f9473.cloudfunctions.net/getUser?uid=${uid}`)
            return userRecord
        } else return null

    } catch(e) {
        console.log(e)
        throw e
    }
}