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
  const body = "";
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
}()); //發通知給社團成員

exports.notifyToClubMember = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (data, context) {
    const uids = {};
    const messages = [];
    const {
      cid,
      title,
      body
    } = data;
    const memberSnapshot = yield admin.database().ref('clubs').child(cid).child('member').once('value');
    memberSnapshot.forEach(childSnapshot => {
      const uid = childSnapshot.key;
      uids[uid] = true;
    });
    const promises = Object.keys(uids).map(
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(function* (uid) {
        const userRef = admin.database().ref('users').child(uid);
        const settingRef = admin.database().ref('userSettings').child(uid);
        const userSnapshot = yield userRef.once('value');
        const settingSnapshot = yield settingRef.once('value');
        const {
          expoToken
        } = userSnapshot.val();
        const {
          globalNotification,
          clubNotificationList,
          nightModeNotification
        } = settingSnapshot.val();
        const hours = new Date().getHours();
        const nightMode = nightModeNotification ? hours >= 21 : false;

        if (expoToken && (globalNotification || clubNotificationList[cid].on) && !nightMode) {
          messages.push({
            "to": expoToken,
            title,
            body
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
exports.getUser = functions.https.onRequest(
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(function* (request, response) {
    const {
      uid
    } = request.query;

    if (uid) {
      const userRecord = yield admin.auth().getUser(uid);
      response.send(userRecord.toJSON());
    } else {
      response.send('你不要給我亂用!');
    }
  });

  return function (_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}()); ////////////////////////////////////////////////////////////////////////////////////
// 貼文
////////////////////////////////////////////////////////////////////////////////////
//依傳入的clubList取得社團下貼文

exports.getHomePost = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(function* (data, context) {
    try {
      const uid = context.auth.uid;
      const clubList = data;
      const clubKeyList = Object.keys(clubList); //回傳物件

      let objPost = [];

      if (clubKeyList.length > 0) {
        for (let i = 0; i < clubKeyList.length; i++) {
          if (clubList[clubKeyList[i]].selectStatus) {
            let club = yield getClubData(clubKeyList[i]);

            if (club) {
              //社團沒開放
              if (club.open == false) {
                //是否為社員
                if (!club.member[uid]) {
                  continue;
                }
              }

              objPost = yield getPostFromClub(clubKeyList[i], uid, club, objPost);
            }
          }
        }
      }

      return objPost;
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}()); //按貼文讚

exports.setPostFavorite = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey
      } = data;
      const uid = context.auth.uid;
      const club = yield getClubData(clubKey);

      if (club) {
        if (club.open == false) {
          if (!club.member[uid]) {
            return null;
          }
        }

        let post = yield getPostInsideData(clubKey, postKey);

        if (post) {
          //先取得貼文基本屬性
          post = yield setPostFoundations(clubKey, postKey, uid, post, club);
          let updateFavorites = {}; //按讚處理
          //按讚

          if (post.statusFavorite == false) {
            post.statusFavorite = !post.statusFavorite; //牽扯到物件形狀
            //沒其他使用者按過讚

            if (post.numFavorites == 0) {
              post.favorites = {};
            }

            post.numFavorites = post.numFavorites + 1;
            post.favorites[uid] = true;
            updateFavorites[uid] = true;
          } //取消讚
          else if (post.statusFavorite == true) {
              post.statusFavorite = !post.statusFavorite; //牽扯到物件形狀
              //沒其他使用者按過讚

              if (post.numFavorites == 1) {
                post.favorites = false;
                updateFavorites[uid] = false;
              } //有其他使用者按過讚
              //設為null寫進firebase會自動消失
              else {
                  delete post.favorites[uid];
                  updateFavorites[uid] = null;
                }

              post.numFavorites = post.numFavorites - 1;
            } //更改firebasePostFavorites


          yield updatePostFavorites(post.clubKey, post.postKey, updateFavorites);
          console.log(post);
          return post;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.toString);
    }
  });

  return function (_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}()); //取得該社團下所有貼文

const getPostFromClub =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(function* (clubKey, uid, club, objPost) {
    try {
      let post = yield getPostData(clubKey);

      if (post) {
        let postKeyList = Object.keys(post);

        for (let j = 0; j < postKeyList.length; j++) {
          let postKey = postKeyList[j];
          let nextPost = yield setPostFoundations(clubKey, postKey, uid, post[postKey], club);
          objPost = handlePostDataToObject(objPost, clubKey, postKey, nextPost);
        }
      }

      return objPost;
    } catch (error) {
      throw error;
    }
  });

  return function getPostFromClub(_x12, _x13, _x14, _x15) {
    return _ref7.apply(this, arguments);
  };
}(); //傳入參數貼文列Array，將貼文加入貼文列


const handlePostDataToObject = (objPost, clubKey, postKey, postData) => {
  try {
    //拷貝陣列
    let newObjPost = objPost.slice();
    let newPostData = {};
    newPostData[postKey] = postData;
    newObjPost.push(newPostData); // //重複
    // for (var i = 0; i < newObjPost.length; i++) {
    //     for (var j = i + 1; j < newObjPost.length; j++) {
    //         let preKey = Object.keys(newObjPost[i])[0];
    //         let nextKey = Object.keys(newObjPost[j])[0];
    //         if (preKey == nextKey)
    //             newObjPost.splice(i, 1);
    //     }
    // }
    //排序

    newObjPost.sort(function (a, b) {
      let aDate = a[Object.keys(a)[0]].date;
      let bDate = b[Object.keys(b)[0]].date;
      return new Date(bDate) < new Date(aDate) ? -1 : 1;
    });
    return newObjPost;
  } catch (error) {
    throw error;
  }
}; //處理貼文基本屬性(學校與社團名稱、key值、nickName、職位、views、favorites)


const setPostFoundations =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(function* (clubKey, postKey, uid, post, club) {
    try {
      //該貼文社團與學校名稱
      post.clubName = club.clubName;
      post.schoolName = club.schoolName; //處理poster職位名稱

      if (club.member[post.poster]) {
        post.posterStatus = club.member[post.poster].status;
        post.posterStatusChinese = changeMemberStatusToChinese(post.posterStatus);
      } else {
        post.posterStatus = '';
        post.posterStatusChinese = '';
      } //判斷是否可編輯或刪除貼文


      if (post.poster === uid) {
        post.statusEnable = true;
      } else {
        post.statusEnable = false;
      } //將clubKey放進attribute，否則找不到該貼文社團


      post.clubKey = clubKey;
      post.postKey = postKey; //處理User

      const userData = yield getUserData(post.poster);
      post.posterNickName = userData.nickName;
      post.posterPhotoUrl = userData.photoUrl; //處理view和favorite

      post = setPostViewFavoriteData(post, uid);
      return post;
    } catch (error) {
      throw error;
    }
  });

  return function setPostFoundations(_x16, _x17, _x18, _x19, _x20) {
    return _ref8.apply(this, arguments);
  };
}(); //產生statusView和statusFavorite


const setPostViewFavoriteData = (post, uid) => {
  try {
    //views與favorite數量
    post.numViews = Object.keys(post.views).length;
    post.numFavorites = Object.keys(post.favorites).length; //該使用者是否有按讚與觀看

    if (post.views[uid] == true) post.statusView = true;else post.statusView = false;
    if (post.favorites[uid] == true) post.statusFavorite = true;else post.statusFavorite = false;
    return post;
  } catch (error) {
    throw error;
  }
}; ////////////////////////////////////////////////////////////////////////////////////
// Realtime Database
////////////////////////////////////////////////////////////////////////////////////
//取得特定社團資訊


const getClubData =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(function* (clubKey) {
    try {
      let clubRef = yield admin.database().ref('clubs').child(clubKey).once('value');
      let club = clubRef.val();
      return club;
    } catch (error) {
      throw error;
    }
  });

  return function getClubData(_x21) {
    return _ref9.apply(this, arguments);
  };
}(); //取得特定社團下所有貼文資訊


const getPostData =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(function* (clubKey) {
    try {
      let postRef = yield admin.database().ref('posts').child(clubKey).once('value');
      let post = postRef.val();
      return post;
    } catch (error) {
      throw error;
    }
  });

  return function getPostData(_x22) {
    return _ref10.apply(this, arguments);
  };
}(); //取得特定貼文資訊


const getPostInsideData =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(function* (clubKey, postKey) {
    try {
      let postRef = yield admin.database().ref('posts').child(clubKey).child(postKey).once('value');
      let post = postRef.val();
      return post;
    } catch (error) {
      throw error;
    }
  });

  return function getPostInsideData(_x23, _x24) {
    return _ref11.apply(this, arguments);
  };
}(); //取得特定使用者資訊


const getUserData =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(function* (uid) {
    try {
      let userRef = yield admin.database().ref('users').child(uid).once('value');
      let user = userRef.val();
      return user;
    } catch (error) {
      throw error;
    }
  });

  return function getUserData(_x25) {
    return _ref12.apply(this, arguments);
  };
}(); //更新Post的Favorites


const updatePostFavorites =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(function* (clubKey, postKey, updateFavorites) {
    const uid = Object.keys(updateFavorites)[0];
    let favoritesRef;

    if (updateFavorites[uid] == false) {
      favoritesRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/favorites');
    } else {
      favoritesRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/favorites/' + uid);
    }

    yield favoritesRef.set(updateFavorites[uid]);
  });

  return function updatePostFavorites(_x26, _x27, _x28) {
    return _ref13.apply(this, arguments);
  };
}(); ////////////////////////////////////////////////////////////////////////////////////
// Common
////////////////////////////////////////////////////////////////////////////////////
//轉換職位status轉換成中文


const changeMemberStatusToChinese = status => {
  switch (status) {
    case 'master':
      return '社長';

    case 'supervisor':
      return '幹部';

    case 'member':
      return '成員';

    default:
      return '未設定';
  }
};
