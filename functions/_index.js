const functions = require('firebase-functions')
const fetch = require('node-fetch')
const admin = require('firebase-admin')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {
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

    const uids = []
    const messages = []
    const { cid, message } = data

    const memberSnapshot = await admin.database().ref('clubs').child(cid).child('member').once('value')
    memberSnapshot.forEach((childSnapshot) => {
        const uid = childSnapshot.key
        uids.push(uid)
    })

    const promises = uids.map(async (uid) => {
        const userRef = admin.database().ref('users').child(uid)
        const userSnapshot = await userRef.once('value')
        const { expoToken } = userSnapshot.val()
        if(expoToken) {
            messages.push({
                "to": expoToken,
                "body": message
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