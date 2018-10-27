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

exports.sendPushNotificationToAll = functions.https.onCall((data, context) => {

    const messages = []

    admin.database().ref('users').orderByKey().once('value')
        .then((usersSnapshot) => {
            usersSnapshot.forEach((childSnapshot) => {
                const { expoToken } = childSnapshot.val()
                if(expoToken) {
                    messages.push({
                        "to": expoToken,
                        "body": data
                    })
                }
            })

            return Promise.all(messages)

        }).then((messages) => {
            fetch('https://exp.host/--/api/v2/push/send', {

                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(messages)
            })
        })

    
})

exports.notifyToClubMember = functions.https.onCall((data, context) => {

    const uids = []
    const messages = []
    const { cid, message } = data

    admin.database().ref('clubs').child(cid).child('member').once('value')
        .then((memberSnapshot) => {
            memberSnapshot.forEach((childSnapshot) => {
                const uid = childSnapshot.key
                uids.push(uid)
            })

            return Promise.all(uids)

        }).then((uids) => {
            uids.map((uid) => {
                const userRef = admin.database().ref('users').child(uid)
                userRef.once('value')
                    .then((userSnapshot) => {
                        const { expoToken } = userSnapshot.val()
                        if(expoToken) {
                            messages.push({
                                "to": expoToken,
                                "body": message
                            })
                        }
                    })

                return Promise.all(messages)
            })

        }).then((messages) => {
            fetch('https://exp.host/--/api/v2/push/send', {

                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(messages)
            })
        })
})