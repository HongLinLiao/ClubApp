"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const functions = require('firebase-functions');

const fetch = require('node-fetch');

const admin = require('firebase-admin'); // // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


admin.initializeApp(functions.config().firebase);
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
exports.sendPushNotificationToAll = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (data, context) {
    const messages = [];
    const usersSnapshot = yield admin.database().ref('users').orderByKey().once('value');
    usersSnapshot.forEach(childSnapshot => {
      const {
        expoToken
      } = childSnapshot.val();

      if (expoToken) {
        messages.push({
          "to": expoToken,
          "body": data
        });
      }
    });
    yield fetch('https://exp.host/--/api/v2/push/send', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messages)
    });
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
exports.notifyToClubMember = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (data, context) {
    const uids = [];
    const messages = [];
    const {
      cid,
      message
    } = data;
    const memberSnapshot = yield admin.database().ref('clubs').child(cid).child('member').once('value');
    memberSnapshot.forEach(childSnapshot => {
      const uid = childSnapshot.key;
      uids.push(uid);
    });
    const promises = uids.map(
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(function* (uid) {
        const userRef = admin.database().ref('users').child(uid);
        const userSnapshot = yield userRef.once('value');
        const {
          expoToken
        } = userSnapshot.val();

        if (expoToken) {
          messages.push({
            "to": expoToken,
            "body": message
          });
        }
      });

      return function (_x5) {
        return _ref3.apply(this, arguments);
      };
    }());
    yield Promise.all(promises);
    yield fetch('https://exp.host/--/api/v2/push/send', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messages)
    });
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
