const functions = require('firebase-functions')
const fetch = require('node-fetch')
const admin = require('firebase-admin')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {
    const body = ""
    response.send("Hello from Firebase!");
});

exports.sendPushNotificationToAll = functions.https.onCall(async (data, context) => {

    const messages = []

    const usersSnapshot = await admin.database().ref('users').orderByKey().once('value')
    usersSnapshot.forEach((childSnapshot) => {
        const { expoToken } = childSnapshot.val()
        if(expoToken) {
            messages.push({
                "to": expoToken,
                "body": data
            })
        }
    })

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(messages)
    })

})

exports.notifyToClubMember = functions.https.onCall(async (data, context) => {

    const uids = {}
    const messages = []
    const { cid, title, body } = data

    const memberSnapshot = await admin.database().ref('clubs').child(cid).child('member').once('value')
    memberSnapshot.forEach((childSnapshot) => {
        const uid = childSnapshot.key
        uids[uid] = true
    })

    const promises = Object.keys(uids).map(async (uid) => {
        const userRef = admin.database().ref('users').child(uid)
        const settingRef = admin.database().ref('userSettings').child(uid)

        const userSnapshot = await userRef.once('value')
        const settingSnapshot = await settingRef.once('value')

        const { expoToken } = userSnapshot.val()
        const { globalNotification, clubNotificationList, nightModeNotification } = settingSnapshot.val()
        const hours = new Date().getHours()
        const nightMode = nightModeNotification ? (hours >= 21) : false

        if(expoToken && (globalNotification || clubNotificationList[cid].on) && !nightMode) {
            messages.push({
                "to": expoToken,
                title,
                body
            })
        }
    })

    await Promise.all(promises)

    await fetch('https://exp.host/--/api/v2/push/send', {

        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(messages)
    })

})

exports.getUser = functions.https.onRequest(async (request, response) => {

    const { uid } = request.query
    if(uid) {
        const userRecord = await admin.auth().getUser(uid)
        response.send(userRecord.toJSON());
    } else {
        response.send('你不要給我亂用!')
    }
});