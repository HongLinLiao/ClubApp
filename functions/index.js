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
    try {
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

      if (messages.length > 0) {
        yield expoSend(messages);
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); //發通知給社團成員

exports.notifyToClubMember = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (data, context) {
    try {
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

          if (expoToken && globalNotification && clubNotificationList[cid].on && !nightMode) {
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

      if (messages.length > 0) {
        yield expoSend(messages);
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
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

      let obj = {
        postListArr: []
      };

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

              obj = yield getPostFromClub(clubKeyList[i], uid, club, obj);
            }
          }
        }
      }

      return obj;
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}()); //取得社團文章

exports.getClubPost = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(function* (data, context) {
    try {
      const uid = context.auth.uid;
      const clubKey = data; //回傳物件

      let obj = {
        postListArr: []
      };
      let status = false;
      let club = yield getClubData(clubKey);

      if (club) {
        //社團有無開放
        if (club.open == true) {
          status = true;
        } else if (club.open == false) {
          //是否為社員
          if (club.member[uid]) {
            status = true;
          }
        }

        if (status) {
          obj = yield getPostFromClub(clubKey, uid, club, obj);
        }

        return obj;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}()); //進入貼文內頁

exports.getPostInside = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey
      } = data;
      const {
        uid
      } = context.auth;
      const club = yield getClubData(clubKey);

      if (club) {
        if (club.open == false) {
          if (!club.member[uid]) {
            return null;
          }
        }

        let obj = {};
        let post = yield getPostInsideData(clubKey, postKey);

        if (post) {
          //先取得貼文基本屬性
          post = yield setPostFoundations(clubKey, postKey, uid, post, club);
          post = yield setPostView(post, uid);
          obj.post = post;
        } else {
          return null;
        }

        let commentData = yield getPostCommentData(clubKey, postKey);
        let comment = [];

        if (commentData) {
          let keyList = Object.keys(commentData);
          let temp;

          for (let i = 0; i < keyList.length; i++) {
            commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]], club);
            temp = {};
            temp[keyList[i]] = commentData[keyList[i]];
            comment.push(temp);
          }

          comment.sort(function (a, b) {
            let aDate = a[Object.keys(a)[0]].date;
            let bDate = b[Object.keys(b)[0]].date;
            return new Date(bDate) > new Date(aDate) ? -1 : 1;
          });
        }

        obj.comment = comment;
        return obj;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}()); //編輯貼文

exports.editPost = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey,
        editData
      } = data;
      const {
        uid
      } = context.auth;
      const club = yield getClubData(clubKey);

      if (club) {
        if (club.open == false) {
          if (!club.member[uid]) {
            return null;
          }
        }

        let obj = {};
        let post = yield getPostInsideData(clubKey, postKey);

        if (post) {
          yield editPostData(clubKey, postKey, editData);

          for (let i = 0; i < Object.keys(editData).length; i++) {
            post[Object.keys(editData)[i]] = editData[Object.keys(editData)[i]];
          } //先取得貼文基本屬性


          post = yield setPostFoundations(clubKey, postKey, uid, post, club);
          post = yield setPostView(post, uid);
          obj.post = post;
        } else {
          return null;
        }

        let commentData = yield getPostCommentData(clubKey, postKey);
        let comment = [];

        if (commentData) {
          let keyList = Object.keys(commentData);
          let temp;

          for (let i = 0; i < keyList.length; i++) {
            commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]], club);
            temp = {};
            temp[keyList[i]] = commentData[keyList[i]];
            comment.push(temp);
          }

          comment.sort(function (a, b) {
            let aDate = a[Object.keys(a)[0]].date;
            let bDate = b[Object.keys(b)[0]].date;
            return new Date(bDate) > new Date(aDate) ? -1 : 1;
          });
        }

        obj.comment = comment;
        return obj;
      } else {
        return null;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}()); //刪除貼文

exports.deletePost = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey
      } = data;
      const {
        uid
      } = context.auth;
      const club = yield getClubData(clubKey);
      let obj = {};

      if (club) {
        if (!club.member[uid]) {
          obj.status = false;
        } else {
          if (club.member[uid].status == "master" || club.member[uid].status == "supervisor") {
            obj.status = true;
          } else {
            let post = yield getPostInsideData(clubKey, postKey);

            if (post.poster == uid) {
              obj.status = true;
            }
          }
        }
      } else {
        obj.status = false;
      }

      if (obj.status) {
        yield deletePostData(clubKey, postKey);
      }

      return obj;
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}()); //按貼文讚

exports.setPostFavorite = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey,
        commentStatus
      } = data;
      const uid = context.auth.uid;
      const club = yield getClubData(clubKey);
      let notifyStatus = false;

      if (club) {
        if (club.open == false) {
          if (!club.member[uid]) {
            return null;
          }
        }

        let post = yield getPostInsideData(clubKey, postKey);

        if (post) {
          let obj = {}; //先取得貼文基本屬性

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
            notifyStatus = true;
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

          if (notifyStatus) {
            const userData = yield getUserData(uid);

            if (userData) {
              let title = `${userData.nickName} 說你在 ${post.schoolName}${post.clubName} 的貼文讚！`;
              let userList = {};
              userList[post.poster] = true;
              yield notifyToUser(userList, title, null);
            }
          }

          obj.post = post;

          if (commentStatus) {
            let commentData = yield getPostCommentData(post.clubKey, post.postKey);
            let comment = [];

            if (commentData) {
              let keyList = Object.keys(commentData);
              let temp;

              for (let i = 0; i < keyList.length; i++) {
                commentData[keyList[i]] = yield setCommentFoundations(post.clubKey, post.postKey, keyList[i], uid, commentData[keyList[i]], club);
                temp = {};
                temp[keyList[i]] = commentData[keyList[i]];
                comment.push(temp);
              }

              comment.sort(function (a, b) {
                let aDate = a[Object.keys(a)[0]].date;
                let bDate = b[Object.keys(b)[0]].date;
                return new Date(bDate) > new Date(aDate) ? -1 : 1;
              });
            }

            obj.comment = comment;
          }

          return obj;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x18, _x19) {
    return _ref10.apply(this, arguments);
  };
}()); //新增留言

exports.createComment = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey,
        content
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
          let obj = {}; //寫進資料庫

          yield createCommentData(clubKey, postKey, content, uid); //發通知給參與者

          const userData = yield getUserData(uid);

          if (userData) {
            let title = `${userData.nickName} 回應了你在 ${club.schoolName}${club.clubName} 的貼文！`;
            let body = `${content.length > 15 ? content.substring(1, 15) : content}`;
            yield notifyToPostParticipants(clubKey, postKey, post, title, body);
          }

          post.numComments = post.numComments + 1;
          post = yield setPostFoundations(clubKey, postKey, uid, post, club);
          post = yield setPostView(post, uid);
          obj.post = post;
          let commentData = yield getPostCommentData(clubKey, postKey);
          let comment = [];

          if (commentData) {
            let keyList = Object.keys(commentData);
            let temp;

            for (let i = 0; i < keyList.length; i++) {
              commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]], club);
              temp = {};
              temp[keyList[i]] = commentData[keyList[i]];
              comment.push(temp);
            }

            comment.sort(function (a, b) {
              let aDate = a[Object.keys(a)[0]].date;
              let bDate = b[Object.keys(b)[0]].date;
              return new Date(bDate) > new Date(aDate) ? -1 : 1;
            });
          }

          obj.comment = comment;
          return obj;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x20, _x21) {
    return _ref11.apply(this, arguments);
  };
}()); //刪除留言

exports.deleteComment = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey,
        commentKey
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
          let obj = {};
          yield deleteCommentData(clubKey, postKey, commentKey);
          post.numComments = post.numComments - 1;
          post = yield setPostFoundations(clubKey, postKey, uid, post, club);
          post = yield setPostView(post, uid);
          obj.post = post;
          let commentData = yield getPostCommentData(clubKey, postKey);
          let comment = [];

          if (commentData) {
            let keyList = Object.keys(commentData);
            let temp;

            for (let i = 0; i < keyList.length; i++) {
              commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]], club);
              temp = {};
              temp[keyList[i]] = commentData[keyList[i]];
              comment.push(temp);
            }

            comment.sort(function (a, b) {
              let aDate = a[Object.keys(a)[0]].date;
              let bDate = b[Object.keys(b)[0]].date;
              return new Date(bDate) > new Date(aDate) ? -1 : 1;
            });
          }

          obj.comment = comment;
          return obj;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x22, _x23) {
    return _ref12.apply(this, arguments);
  };
}()); //編輯留言

exports.editComment = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey,
        commentKey,
        content
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
          let obj = {};
          yield editCommentData(clubKey, postKey, commentKey, content);
          post = yield setPostFoundations(clubKey, postKey, uid, post, club);
          post = yield setPostView(post, uid);
          obj.post = post;
          let commentData = yield getPostCommentData(clubKey, postKey);
          let comment = [];

          if (commentData) {
            let keyList = Object.keys(commentData);
            let temp;

            for (let i = 0; i < keyList.length; i++) {
              commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]], club);
              temp = {};
              temp[keyList[i]] = commentData[keyList[i]];
              comment.push(temp);
            }

            comment.sort(function (a, b) {
              let aDate = a[Object.keys(a)[0]].date;
              let bDate = b[Object.keys(b)[0]].date;
              return new Date(bDate) > new Date(aDate) ? -1 : 1;
            });
          }

          obj.comment = comment;
          return obj;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x24, _x25) {
    return _ref13.apply(this, arguments);
  };
}()); //按留言讚

exports.setCommentFavorite = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey,
        commentKey
      } = data;
      const uid = context.auth.uid;
      let notifyStatus = false;
      const club = yield getClubData(clubKey);

      if (club) {
        if (club.open == false) {
          if (!club.member[uid]) {
            return null;
          }
        }

        let post = yield getPostInsideData(clubKey, postKey);

        if (post) {
          let obj = {};
          post = yield setPostFoundations(clubKey, postKey, uid, post, club);
          post = yield setPostView(post, uid);
          obj.post = post;
          let commentData = yield getPostCommentData(clubKey, postKey);
          let comment = [];

          if (commentData) {
            let keyList = Object.keys(commentData);
            let temp;

            for (let i = 0; i < keyList.length; i++) {
              commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]], club); //按讚處理

              if (keyList[i] == commentKey) {
                let updateFavorites = {}; //按讚

                if (commentData[commentKey].statusFavorite == false) {
                  commentData[commentKey].statusFavorite = !commentData[commentKey].statusFavorite; //牽扯到物件形狀
                  //沒其他使用者按過讚

                  if (commentData[commentKey].numFavorites == 0) {
                    commentData[commentKey].numFavorites = commentData[commentKey].numFavorites + 1;
                    commentData[commentKey].favorites = {};
                    commentData[commentKey].favorites[uid] = true;
                    updateFavorites[uid] = true;
                  } //有其他使用者按過讚
                  else {
                      commentData[commentKey].numFavorites = commentData[commentKey].numFavorites + 1;
                      commentData[commentKey].favorites[uid] = true;
                      updateFavorites[uid] = true;
                    }
                } //取消讚
                else {
                    commentData[commentKey].statusFavorite = !commentData[commentKey].statusFavorite; //牽扯到物件形狀
                    //沒其他使用者按過讚

                    if (commentData[commentKey].numFavorites == 1) {
                      commentData[commentKey].numFavorites = commentData[commentKey].numFavorites - 1;
                      delete commentData[commentKey].favorites[uid];
                      updateFavorites[uid] = false;
                    } //有其他使用者按過讚
                    //設為null寫進firebase會自動消失
                    else {
                        commentData[commentKey].numFavorites = commentData[commentKey].numFavorites - 1;
                        delete commentData[commentKey].favorites[uid];
                        updateFavorites[uid] = null;
                      }
                  }

                yield updateCommentFavorites(clubKey, postKey, commentKey, updateFavorites);

                if (notifyStatus) {
                  const userData = yield getUserData(commentData[commentKey].commenter);

                  if (userData) {
                    let title = `${userData.nickName} 說你在 ${post.schoolName}${post.clubName} 留言讚！`;
                    let userList = {};
                    userList[commentData[commentKey].commenter] = true;
                    yield notifyToUser(userList, title, null);
                  }
                }
              }

              temp = {};
              temp[keyList[i]] = commentData[keyList[i]];
              comment.push(temp);
            }

            comment.sort(function (a, b) {
              let aDate = a[Object.keys(a)[0]].date;
              let bDate = b[Object.keys(b)[0]].date;
              return new Date(bDate) > new Date(aDate) ? -1 : 1;
            });
          }

          obj.comment = comment;
          return obj;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x26, _x27) {
    return _ref14.apply(this, arguments);
  };
}()); //取得該社團下所有貼文

const getPostFromClub =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(function* (clubKey, uid, club, obj) {
    try {
      let post = yield getPostData(clubKey);

      if (post) {
        let postKeyList = Object.keys(post);

        for (let j = 0; j < postKeyList.length; j++) {
          let postKey = postKeyList[j];
          let nextPost = yield setPostFoundations(clubKey, postKey, uid, post[postKey], club);
          obj.postListArr = handlePostDataToArray(obj.postListArr, clubKey, postKey, nextPost);
        }
      }

      return obj;
    } catch (error) {
      throw error;
    }
  });

  return function getPostFromClub(_x28, _x29, _x30, _x31) {
    return _ref15.apply(this, arguments);
  };
}(); //傳入參數貼文列Array，將貼文加入貼文列


const handlePostDataToArray = (arrPost, clubKey, postKey, postData) => {
  try {
    //拷貝陣列
    let newObjPost = arrPost.slice();
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
}; //貼文觀看


const setPostView =
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(function* (post, uid) {
    try {
      //檢查使用者是否是第一次查看
      //不是第一次看
      if (post.views[uid] == true) {} //是第一次看
      else {
          let updateViews = {}; //沒有其他使用者看過

          if (Object.keys(post.views).length == 0) {
            post.numViews = post.numViews + 1;
            post.views = {};
            post.views[uid] = true;
            post.statusView = true;
            updateViews[uid] = true;
          } //有其他使用者看過
          else {
              post.numViews = post.numViews + 1;
              post.views[uid] = true;
              post.statusView = true;
              updateViews[uid] = true;
            } //寫進資料庫


          yield updatePostViews(post.clubKey, post.postKey, updateViews);
        }

      return post;
    } catch (error) {
      throw error;
    }
  });

  return function setPostView(_x32, _x33) {
    return _ref16.apply(this, arguments);
  };
}(); //處理貼文基本屬性(學校與社團名稱、key值、nickName、職位、views、favorites、編輯狀態、照片)


const setPostFoundations =
/*#__PURE__*/
function () {
  var _ref17 = _asyncToGenerator(function* (clubKey, postKey, uid, post, club) {
    try {
      //轉時間
      post.date = new Date(post.date).toLocaleString(); //該貼文社團與學校名稱

      post.clubName = club.clubName;
      post.schoolName = club.schoolName; //處理poster職位名稱

      if (club.member[post.poster]) {
        post.posterStatus = club.member[post.poster].status;
        post.posterStatusChinese = changeMemberStatusToChinese(post.posterStatus);
      } else {
        post.posterStatus = '';
        post.posterStatusChinese = '';
      } //判斷是否可編輯或刪除貼文(社長與幹部有此權限)


      post.deleteStatus = false;
      post.editStatus = false;

      if (club.member[uid]) {
        if (post.poster === uid) {
          post.deleteStatus = true;
          post.editStatus = true;
        } else if (club.member[uid].status == "master" || club.member[uid].status == "supervisor") {
          post.deleteStatus = true;
        }
      } //處理照片


      if (!post.images) {
        post.images = [];
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

  return function setPostFoundations(_x34, _x35, _x36, _x37, _x38) {
    return _ref17.apply(this, arguments);
  };
}(); //處理留言基本屬性


const setCommentFoundations =
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(function* (clubKey, postKey, commentKey, uid, comment, club) {
    try {
      //轉時間
      comment.date = new Date(comment.date).toLocaleString();
      comment.clubKey = clubKey;
      comment.postKey = postKey;
      comment.commentKey = commentKey;
      comment.numFavorites = Object.keys(comment.favorites).length;
      if (comment.favorites[uid] == true) comment.statusFavorite = true;else comment.statusFavorite = false; //處理User

      const userData = yield getUserData(comment.commenter);

      if (userData) {
        comment.commenterNickName = userData.nickName;
        comment.commenterPhotoUrl = userData.photoUrl;
      }

      comment.editStatus = false;
      comment.deleteStatus = false;

      if (club.member[uid]) {
        if (club.member[uid].status == "master" || club.member[uid].status == "supervisor") {
          comment.deleteStatus = true;
        }
      }

      if (comment.commenter === uid) {
        comment.editStatus = true;
        comment.deleteStatus = true;
      } //編輯狀態用


      comment.statusEdit = false;
      return comment;
    } catch (error) {
      throw error;
    }
  });

  return function setCommentFoundations(_x39, _x40, _x41, _x42, _x43, _x44) {
    return _ref18.apply(this, arguments);
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
// 活動 只要活動open=false，就要去篩選是否是社團會員
////////////////////////////////////////////////////////////////////////////////////
//取得使用者收藏的活動


exports.getUserActivity = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref19 = _asyncToGenerator(function* (data, context) {
    try {
      const uid = context.auth.uid;
      let activity = []; //取得使用者活動列表

      let allActivity = yield getUserActivityData(uid);

      if (allActivity) {
        let clubList = Object.keys(allActivity);

        for (let i = 0; i < clubList.length; i++) {
          let clubKey = clubList[i];
          const club = yield getClubData(clubKey); //查看社團是否開放

          if (club) {
            let activityList = Object.keys(allActivity[clubList[i]]);

            for (let j = 0; j < activityList.length; j++) {
              let activityKey = activityList[j];
              let activityData = yield getActivityInsideData(clubKey, activityKey);

              if (activityData) {
                if (!activityData.open) {
                  if (!club.member[uid]) {
                    continue;
                  }
                } //取得基本屬性


                activityData = yield setActivityFoundations(clubKey, activityKey, uid, activityData, club); //設定觀看
                // activityData = await setActivityView(activityData, uid);

                activity = handleActivityDataToArray(activity, clubKey, activityKey, activityData);
              }
            }
          } else {
            continue;
          }
        }
      }

      return activity;
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x45, _x46) {
    return _ref19.apply(this, arguments);
  };
}()); //取得社團下的活動（不管活動有沒有open都會顯示）

exports.getClubActivity = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(function* (data, context) {
    try {
      const clubKey = data;
      const uid = context.auth.uid;
      let activity = [];
      const club = yield getClubData(clubKey);

      if (club) {
        //取得社團下的活動
        let allActivity = yield getClubActivityData(clubKey);

        if (allActivity) {
          let activityList = Object.keys(allActivity);

          for (let i = 0; i < activityList.length; i++) {
            let activityKey = activityList[i];
            let nextActivity = yield setActivityFoundations(clubKey, activityKey, uid, allActivity[activityKey], club);
            activity = handleActivityDataToArray(activity, clubKey, activityKey, nextActivity);
          }
        }
      }

      return activity;
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x47, _x48) {
    return _ref20.apply(this, arguments);
  };
}()); //進入活動內頁

exports.getActivityInside = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        activityKey
      } = data;
      const {
        uid
      } = context.auth;
      const club = yield getClubData(clubKey);
      let obj = {};

      if (club) {
        let activityData = yield getActivityInsideData(clubKey, activityKey);

        if (activityData) {
          if (!activityData.open) {
            if (!club.member[uid]) {
              return null;
            }
          } //取得基本屬性


          activityData = yield setActivityFoundations(clubKey, activityKey, uid, activityData, club); //設定觀看

          activityData = yield setActivityView(activityData, uid);
          obj.activity = activityData;
          return obj;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x49, _x50) {
    return _ref21.apply(this, arguments);
  };
}()); //收藏活動

exports.setActivityKeep = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref22 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        activityKey
      } = data;
      const uid = context.auth.uid;
      const club = yield getClubData(clubKey);

      if (club) {
        let activity = yield getActivityInsideData(clubKey, activityKey);

        if (!activity) {
          return null;
        } else {
          if (activity.open == false) {
            if (!club.open) {
              if (!club.member[user.uid]) {
                return null;
              }
            }
          } //回傳物件


          let obj = {}; //先取得貼文基本屬性

          activity = yield setActivityFoundations(clubKey, activityKey, uid, activity, club);
          let updateKeeps = {}; //收藏

          if (activity.statusKeep == false) {
            activity.statusKeep = !activity.statusKeep; //牽扯到物件形狀
            //沒其他使用者收藏

            if (activity.numKeeps == 0) {
              activity.numKeeps = activity.numKeeps + 1;
              activity.keeps = {};
              activity.keeps[uid] = true;
              updateKeeps[uid] = true;
            } //有其他使用者收藏
            else {
                activity.numKeeps = activity.numKeeps + 1;
                activity.keeps[uid] = true;
                updateKeeps[uid] = true;
              }
          } //取消收藏
          else {
              activity.statusKeep = !activity.statusKeep; //牽扯到物件形狀
              //沒其他使用者收藏

              if (activity.numKeeps == 1) {
                activity.numKeeps = activity.numKeeps - 1;
                delete activity.keeps[uid];
                updateKeeps[uid] = false;
              } //有其他使用者按過讚
              //設為null寫進firebase會自動消失
              else {
                  activity.numKeeps = activity.numKeeps - 1;
                  delete activity.keeps[uid];
                  updateKeeps[uid] = null;
                }
            } //更改firebasePostFavorites


          yield updateActivityKeeps(activity.clubKey, activity.activityKey, updateKeeps);
          yield setUserKeep(activity.clubKey, activity.activityKey, uid);
          obj.activity = activity;
          return obj;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x51, _x52) {
    return _ref22.apply(this, arguments);
  };
}()); //按活動讚

exports.setActivityFavorite = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref23 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        activityKey
      } = data;
      const uid = context.auth.uid;
      const club = yield getClubData(clubKey);
      let notifyStatus = false;

      if (club) {
        let activity = yield getActivityInsideData(clubKey, activityKey);

        if (!activity) {
          return null;
        } else {
          if (activity.open == false) {
            if (!club.open) {
              if (!club.member[user.uid]) {
                return null;
              }
            }
          } //回傳物件


          let obj = {}; //先取得貼文基本屬性

          activity = yield setActivityFoundations(clubKey, activityKey, uid, activity, club);
          let updateFavorites = {}; //按讚處理
          //按讚

          if (activity.statusFavorite == false) {
            activity.statusFavorite = !activity.statusFavorite; //牽扯到物件形狀
            //沒其他使用者按過讚

            if (activity.numFavorites == 0) {
              activity.numFavorites = activity.numFavorites + 1;
              activity.favorites = {};
              activity.favorites[uid] = true;
              updateFavorites[uid] = true;
            } //有其他使用者按過讚
            else {
                activity.numFavorites = activity.numFavorites + 1;
                activity.favorites[uid] = true;
                updateFavorites[uid] = true;
              }

            notifyStatus = true;
          } //取消讚
          else {
              activity.statusFavorite = !activity.statusFavorite; //牽扯到物件形狀
              //沒其他使用者按過讚

              if (activity.numFavorites == 1) {
                activity.numFavorites = activity.numFavorites - 1;
                delete activity.favorites[uid];
                updateFavorites[uid] = false;
              } //有其他使用者按過讚
              //設為null寫進firebase會自動消失
              else {
                  activity.numFavorites = activity.numFavorites - 1;
                  delete activity.favorites[uid];
                  updateFavorites[uid] = null;
                }
            } //更改firebasePostFavorites


          yield updateActivityFavorites(activity.clubKey, activity.activityKey, updateFavorites);

          if (notifyStatus) {
            const userData = yield getUserData(uid);

            if (userData) {
              let title = `${userData.nickName} 說你在 ${activity.schoolName}${activity.clubName} 的活動讚！`;
              let userList = {};
              userList[activity.poster] = true;
              yield notifyToUser(userList, title, null);
            }
          }

          obj.activity = activity;
          return obj;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x53, _x54) {
    return _ref23.apply(this, arguments);
  };
}()); //傳入參數貼文列Array，將活動加入活動列

const handleActivityDataToArray = (arrActivity, clubKey, activityKey, activityData) => {
  try {
    //拷貝陣列
    let newObjActivity = arrActivity.slice();
    let newActivityData = {};
    newActivityData[activityKey] = activityData;
    newObjActivity.push(newActivityData); // //重複
    // for (var i = 0; i < newObjPost.length; i++) {
    //     for (var j = i + 1; j < newObjPost.length; j++) {
    //         let preKey = Object.keys(newObjPost[i])[0];
    //         let nextKey = Object.keys(newObjPost[j])[0];
    //         if (preKey == nextKey)
    //             newObjPost.splice(i, 1);
    //     }
    // }
    //排序

    newObjActivity.sort(function (a, b) {
      let aDate = a[Object.keys(a)[0]].startDateTime;
      let bDate = b[Object.keys(b)[0]].startDateTime;
      return new Date(bDate) < new Date(aDate) ? -1 : 1;
    });
    return newObjActivity;
  } catch (error) {
    throw error;
  }
}; //處理活動基本屬性


const setActivityFoundations =
/*#__PURE__*/
function () {
  var _ref24 = _asyncToGenerator(function* (clubKey, activityKey, uid, activity, club) {
    try {
      //處理活動是否有收藏
      if (activity.keeps) {
        if (activity.keeps[uid]) {
          activity.statusKeep = true;
        } else {
          activity.statusKeep = false;
        }
      } else {
        activity.statusKeep = false;
      } //該活動社團與學校名稱


      activity.clubName = club.clubName;
      activity.schoolName = club.schoolName; //處理poster職位名稱

      if (club.member[activity.poster]) {
        activity.posterStatus = club.member[activity.poster].status;
        activity.posterStatusChinese = changeMemberStatusToChinese(activity.posterStatus);
      } else {
        activity.posterStatusChinese = '';
        activity.posterStatus = '';
      } //將activityKey放進attribute，否則找不到該活動社團


      activity.clubKey = clubKey;
      activity.activityKey = activityKey; //處理User

      let userData = yield getUserData(activity.poster);
      activity.posterNickName = userData.nickName;
      activity.posterPhotoUrl = userData.photoUrl; //轉時間

      activity.editDate = new Date(activity.editDate).toLocaleString();
      activity.startDateTime = new Date(activity.startDateTime).toLocaleString();
      activity.endDateTime = new Date(activity.endDateTime).toLocaleString(); //判斷是否可編輯或刪除貼文(社長與幹部有此權限)

      activity.deleteStatus = false;
      activity.editStatus = false;

      if (club.member[uid]) {
        if (activity.poster === uid) {
          activity.deleteStatus = true;
          activity.editStatus = true;
        } else if (club.member[uid].status == "master" || club.member[uid].status == "supervisor") {
          activity.deleteStatus = true;
        }
      }

      activity = setActivityViewFavoriteData(activity, uid);
      return activity;
    } catch (error) {
      throw error;
    }
  });

  return function setActivityFoundations(_x55, _x56, _x57, _x58, _x59) {
    return _ref24.apply(this, arguments);
  };
}(); //產生statusView和statusFavorite和statusKeep


const setActivityViewFavoriteData = (activity, uid) => {
  try {
    //views與favorite數量
    activity.numViews = Object.keys(activity.views).length;
    activity.numFavorites = Object.keys(activity.favorites).length;
    activity.numKeeps = Object.keys(activity.keeps).length; //該使用者是否有按讚與觀看與收藏

    if (activity.views[uid] == true) activity.statusView = true;else activity.statusView = false;
    if (activity.favorites[uid] == true) activity.statusFavorite = true;else activity.statusFavorite = false;
    if (activity.keeps[uid] == true) activity.statusKeep = true;else activity.statusKeep = false;
    return activity;
  } catch (error) {
    throw error;
  }
}; //更改使用者活動收藏


const setUserKeep =
/*#__PURE__*/
function () {
  var _ref25 = _asyncToGenerator(function* (clubKey, activityKey, uid) {
    try {
      let userData = yield getUserData(uid);
      let updateActivity = {};

      if (userData) {
        //有收藏活動
        if (userData.activities) {
          //有此社團的活動
          if (userData.activities[clubKey]) {
            //有這個活動 (取消收藏)
            if (userData.activities[clubKey][activityKey]) {
              updateActivity[uid] = null;
              yield updateUserKeeps(clubKey, activityKey, updateActivity);
            } //沒有這個活動
            else {
                updateActivity[uid] = true;
                yield updateUserKeeps(clubKey, activityKey, updateActivity);
              }
          } //沒有此社團的活動
          else {
              updateActivity[uid] = true;
              yield updateUserKeeps(clubKey, activityKey, updateActivity);
            }
        } //沒收藏活動
        else {
            updateActivity[uid] = true;
            yield updateUserKeeps(clubKey, activityKey, updateActivity);
          }
      }
    } catch (error) {
      throw error;
    }
  });

  return function setUserKeep(_x60, _x61, _x62) {
    return _ref25.apply(this, arguments);
  };
}(); //活動觀看


const setActivityView =
/*#__PURE__*/
function () {
  var _ref26 = _asyncToGenerator(function* (activity, uid) {
    try {
      //檢查使用者是否是第一次查看
      //不是第一次看
      if (activity.views[uid] == true) {} //是第一次看
      else {
          let updateViews = {}; //沒有其他使用者看過

          if (Object.keys(activity.views).length == 0) {
            activity.numViews = activity.numViews + 1;
            activity.views = {};
            activity.views[uid] = true;
            activity.statusView = true;
            updateViews[uid] = true;
          } //有其他使用者看過
          else {
              activity.numViews = activity.numViews + 1;
              activity.views[uid] = true;
              activity.statusView = true;
              updateViews[uid] = true;
            } //寫進資料庫


          yield updateActivityViews(activity.clubKey, activity.activityKey, updateViews);
        }

      return activity;
    } catch (error) {
      throw error;
    }
  });

  return function setActivityView(_x63, _x64) {
    return _ref26.apply(this, arguments);
  };
}(); ////////////////////////////////////////////////////////////////////////////////////
// 通知
////////////////////////////////////////////////////////////////////////////////////
//發通知給貼文參與者(發文者與留言參與者)（不採用社團提醒）


const notifyToPostParticipants =
/*#__PURE__*/
function () {
  var _ref27 = _asyncToGenerator(function* (clubKey, postKey, post, title, body) {
    try {
      let userList = {};
      let tempUser;
      let messages = []; //取得已留言者

      const commentSnapshot = yield admin.database().ref('comments').child(clubKey).child(postKey).once('value');
      commentSnapshot.forEach(childSnapshot => {
        Object.keys(childSnapshot).map(value => {
          if (childSnapshot[value].commenter) {
            tempUser = childSnapshot[value].commenter;
            userList[tempUser] = true;
          }
        });
      }); //取得貼文者

      userList[post.poster] = true;
      const promises = Object.keys(userList).map(
      /*#__PURE__*/
      function () {
        var _ref28 = _asyncToGenerator(function* (uid) {
          const userRef = admin.database().ref('users').child(uid);
          const userSnapshot = yield userRef.once('value');
          const {
            expoToken
          } = userSnapshot.val();
          const settingRef = admin.database().ref('userSettings').child(uid);
          const settingSnapshot = yield settingRef.once('value');
          const {
            globalNotification,
            clubNotificationList,
            nightModeNotification
          } = settingSnapshot.val();
          const hours = new Date().getHours();
          const nightMode = nightModeNotification ? hours >= 21 : false;

          if (expoToken && globalNotification && !nightMode) {
            messages.push({
              "to": expoToken,
              title,
              body
            });
          }
        });

        return function (_x70) {
          return _ref28.apply(this, arguments);
        };
      }());
      yield Promise.all(promises);

      if (messages.length > 0) {
        yield expoSend(messages);
      }
    } catch (error) {
      throw error;
    }
  });

  return function notifyToPostParticipants(_x65, _x66, _x67, _x68, _x69) {
    return _ref27.apply(this, arguments);
  };
}(); //發通知給使用者（可多人，物件傳入）(不採用社團提醒)


const notifyToUser =
/*#__PURE__*/
function () {
  var _ref29 = _asyncToGenerator(function* (userList, title, body) {
    try {
      let messages = [];
      const promises = Object.keys(userList).map(
      /*#__PURE__*/
      function () {
        var _ref30 = _asyncToGenerator(function* (uid) {
          const userRef = admin.database().ref('users').child(uid);
          const userSnapshot = yield userRef.once('value');
          const {
            expoToken
          } = userSnapshot.val();
          const settingRef = admin.database().ref('userSettings').child(uid);
          const settingSnapshot = yield settingRef.once('value');
          const {
            globalNotification,
            clubNotificationList,
            nightModeNotification
          } = settingSnapshot.val();
          const hours = new Date().getHours();
          const nightMode = nightModeNotification ? hours >= 21 : false;

          if (expoToken && globalNotification && !nightMode) {
            if (body) {
              messages.push({
                "to": expoToken,
                title,
                body
              });
            } else {
              messages.push({
                "to": expoToken,
                title
              });
            }
          }
        });

        return function (_x74) {
          return _ref30.apply(this, arguments);
        };
      }());
      yield Promise.all(promises);

      if (messages.length > 0) {
        yield expoSend(messages);
      }
    } catch (error) {
      throw error;
    }
  });

  return function notifyToUser(_x71, _x72, _x73) {
    return _ref29.apply(this, arguments);
  };
}(); //expoSendApi


const expoSend =
/*#__PURE__*/
function () {
  var _ref31 = _asyncToGenerator(function* (messages) {
    try {
      yield fetch('https://exp.host/--/api/v2/push/send', {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(messages)
      });
    } catch (error) {
      throw error;
    }
  });

  return function expoSend(_x75) {
    return _ref31.apply(this, arguments);
  };
}(); ////////////////////////////////////////////////////////////////////////////////////
// Realtime Database
////////////////////////////////////////////////////////////////////////////////////
//取得特定社團資訊


const getClubData =
/*#__PURE__*/
function () {
  var _ref32 = _asyncToGenerator(function* (clubKey) {
    try {
      let clubRef = yield admin.database().ref('clubs').child(clubKey).once('value');
      let club = clubRef.val();
      return club;
    } catch (error) {
      throw error;
    }
  });

  return function getClubData(_x76) {
    return _ref32.apply(this, arguments);
  };
}(); //取得特定社團下所有貼文資訊


const getPostData =
/*#__PURE__*/
function () {
  var _ref33 = _asyncToGenerator(function* (clubKey) {
    try {
      let postRef = yield admin.database().ref('posts').child(clubKey).once('value');
      let post = postRef.val();
      return post;
    } catch (error) {
      throw error;
    }
  });

  return function getPostData(_x77) {
    return _ref33.apply(this, arguments);
  };
}(); //取得特定貼文資訊


const getPostInsideData =
/*#__PURE__*/
function () {
  var _ref34 = _asyncToGenerator(function* (clubKey, postKey) {
    try {
      let postRef = yield admin.database().ref('posts').child(clubKey).child(postKey).once('value');
      let post = postRef.val();
      return post;
    } catch (error) {
      throw error;
    }
  });

  return function getPostInsideData(_x78, _x79) {
    return _ref34.apply(this, arguments);
  };
}(); //取得貼文下的留言資訊


const getPostCommentData =
/*#__PURE__*/
function () {
  var _ref35 = _asyncToGenerator(function* (clubKey, postKey) {
    try {
      let commentRef = yield admin.database().ref('comments').child(clubKey).child(postKey).once('value');
      let data = commentRef.val();
      return data;
    } catch (error) {
      throw error;
    }
  });

  return function getPostCommentData(_x80, _x81) {
    return _ref35.apply(this, arguments);
  };
}(); //取得特定使用者資訊


const getUserData =
/*#__PURE__*/
function () {
  var _ref36 = _asyncToGenerator(function* (uid) {
    try {
      let userRef = yield admin.database().ref('users').child(uid).once('value');
      let user = userRef.val();
      return user;
    } catch (error) {
      throw error;
    }
  });

  return function getUserData(_x82) {
    return _ref36.apply(this, arguments);
  };
}(); //更新Post的Favorites


const updatePostFavorites =
/*#__PURE__*/
function () {
  var _ref37 = _asyncToGenerator(function* (clubKey, postKey, updateFavorites) {
    try {
      const uid = Object.keys(updateFavorites)[0];
      let favoritesRef;

      if (updateFavorites[uid] == false) {
        favoritesRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/favorites');
      } else {
        favoritesRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/favorites/' + uid);
      }

      yield favoritesRef.set(updateFavorites[uid]);
    } catch (error) {
      throw error;
    }
  });

  return function updatePostFavorites(_x83, _x84, _x85) {
    return _ref37.apply(this, arguments);
  };
}(); //更新Post的Views


const updatePostViews =
/*#__PURE__*/
function () {
  var _ref38 = _asyncToGenerator(function* (clubKey, postKey, updateViews) {
    try {
      const uid = Object.keys(updateViews)[0];
      const value = updateViews[uid];
      const viewsRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/views/' + uid);
      yield viewsRef.set(value);
    } catch (error) {
      throw error;
    }
  });

  return function updatePostViews(_x86, _x87, _x88) {
    return _ref38.apply(this, arguments);
  };
}(); //新增留言


const createCommentData =
/*#__PURE__*/
function () {
  var _ref39 = _asyncToGenerator(function* (clubKey, postKey, content, uid) {
    try {
      const getNumRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/numComments');
      let snapShot = yield getNumRef.once('value');
      let numComments = snapShot.val();
      numComments = numComments + 1;
      yield getNumRef.set(numComments);
      const commentRef = admin.database().ref('comments/' + clubKey + '/' + postKey).push();
      const commentData = {
        commenter: uid,
        date: new Date().toUTCString(),
        content: content,
        favorites: false
      };
      yield commentRef.set(commentData);
    } catch (error) {
      throw error;
    }
  });

  return function createCommentData(_x89, _x90, _x91, _x92) {
    return _ref39.apply(this, arguments);
  };
}(); //刪除留言


const deleteCommentData =
/*#__PURE__*/
function () {
  var _ref40 = _asyncToGenerator(function* (clubKey, postKey, commentKey) {
    try {
      let getNumRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/numComments');
      let snapShot = yield getNumRef.once('value');
      let numComments = snapShot.val();
      numComments = numComments - 1;
      yield getNumRef.set(numComments);
      let commentRef;
      commentRef = admin.database().ref('comments/' + clubKey + '/' + postKey + '/' + commentKey);
      yield commentRef.set(null);
    } catch (error) {
      throw error;
    }
  });

  return function deleteCommentData(_x93, _x94, _x95) {
    return _ref40.apply(this, arguments);
  };
}(); //編輯留言


const editCommentData =
/*#__PURE__*/
function () {
  var _ref41 = _asyncToGenerator(function* (clubKey, postKey, commentKey, content) {
    try {
      if (content == '') {} else {
        let update = {};
        update['/comments/' + clubKey + '/' + postKey + '/' + commentKey + '/content'] = content;
        admin.database().ref().update(update);
      }
    } catch (error) {
      throw error;
    }
  });

  return function editCommentData(_x96, _x97, _x98, _x99) {
    return _ref41.apply(this, arguments);
  };
}(); //更新Comment的Favorites


const updateCommentFavorites =
/*#__PURE__*/
function () {
  var _ref42 = _asyncToGenerator(function* (clubKey, postKey, commentKey, updateFavorites) {
    try {
      const uid = Object.keys(updateFavorites)[0];
      let favoritesRef;

      if (updateFavorites[uid] == false) {
        favoritesRef = admin.database().ref('comments/' + clubKey + '/' + postKey + '/' + commentKey + '/favorites');
      } else {
        favoritesRef = admin.database().ref('comments/' + clubKey + '/' + postKey + '/' + commentKey + '/favorites/' + uid);
      }

      yield favoritesRef.set(updateFavorites[uid]);
    } catch (error) {
      throw error;
    }
  });

  return function updateCommentFavorites(_x100, _x101, _x102, _x103) {
    return _ref42.apply(this, arguments);
  };
}(); //編輯貼文


const editPostData =
/*#__PURE__*/
function () {
  var _ref43 = _asyncToGenerator(function* (clubKey, postKey, obj) {
    try {
      let keyList = Object.keys(obj);
      let ref;

      for (let i = 0; i < keyList.length; i++) {
        let key = keyList[i];
        let value = obj[key];
        ref = admin.database().ref('posts/' + clubKey + '/' + postKey + '/' + key);
        yield ref.set(value);
      }
    } catch (error) {
      console.log(error.toString());
    }
  });

  return function editPostData(_x104, _x105, _x106) {
    return _ref43.apply(this, arguments);
  };
}(); //刪除貼文


const deletePostData =
/*#__PURE__*/
function () {
  var _ref44 = _asyncToGenerator(function* (clubKey, postKey) {
    try {
      const postRef = admin.database().ref('posts/' + clubKey + '/' + postKey);
      yield postRef.remove();
      const commentRef = admin.database().ref('comments/' + clubKey + '/' + postKey);
      yield commentRef.remove();
    } catch (error) {
      throw error;
    }
  });

  return function deletePostData(_x107, _x108) {
    return _ref44.apply(this, arguments);
  };
}(); //取得使用者收藏的活動


const getUserActivityData =
/*#__PURE__*/
function () {
  var _ref45 = _asyncToGenerator(function* (uid) {
    try {
      let userRef = yield admin.database().ref('users').child(uid).child('activities').once('value');
      let activityList = userRef.val();
      return activityList;
    } catch (error) {
      throw error;
    }
  });

  return function getUserActivityData(_x109) {
    return _ref45.apply(this, arguments);
  };
}(); //取得社團活動


const getClubActivityData =
/*#__PURE__*/
function () {
  var _ref46 = _asyncToGenerator(function* (clubKey) {
    try {
      let activityRef = yield admin.database().ref('activities').child(clubKey).once('value');
      let activity = activityRef.val();
      return activity;
    } catch (error) {
      throw error;
    }
  });

  return function getClubActivityData(_x110) {
    return _ref46.apply(this, arguments);
  };
}(); //取得特定活動資訊


const getActivityInsideData =
/*#__PURE__*/
function () {
  var _ref47 = _asyncToGenerator(function* (clubKey, activityKey) {
    try {
      let activityRef = yield admin.database().ref('activities').child(clubKey).child(activityKey).once('value');
      let activity = activityRef.val();
      return activity;
    } catch (error) {
      throw error;
    }
  });

  return function getActivityInsideData(_x111, _x112) {
    return _ref47.apply(this, arguments);
  };
}(); //設定活動觀看


const updateActivityViews =
/*#__PURE__*/
function () {
  var _ref48 = _asyncToGenerator(function* (clubKey, activityKey, updateViews) {
    const uid = Object.keys(updateViews)[0];
    const viewsRef = admin.database().ref('activities/' + clubKey + '/' + activityKey + '/views/' + uid);
    yield viewsRef.set(updateViews[uid]);
  });

  return function updateActivityViews(_x113, _x114, _x115) {
    return _ref48.apply(this, arguments);
  };
}(); //更新Activity的Favorites


const updateActivityFavorites =
/*#__PURE__*/
function () {
  var _ref49 = _asyncToGenerator(function* (clubKey, activityKey, updateFavorites) {
    try {
      const uid = Object.keys(updateFavorites)[0];
      let favoritesRef;

      if (updateFavorites[uid] == false) {
        favoritesRef = admin.database().ref('activities/' + clubKey + '/' + activityKey + '/favorites');
      } else {
        favoritesRef = admin.database().ref('activities/' + clubKey + '/' + activityKey + '/favorites/' + uid);
      }

      yield favoritesRef.set(updateFavorites[uid]);
    } catch (error) {
      throw error;
    }
  });

  return function updateActivityFavorites(_x116, _x117, _x118) {
    return _ref49.apply(this, arguments);
  };
}(); //更新Activity的Keeps


const updateActivityKeeps =
/*#__PURE__*/
function () {
  var _ref50 = _asyncToGenerator(function* (clubKey, activityKey, updateKeeps) {
    try {
      const uid = Object.keys(updateKeeps)[0];
      let keepRef;

      if (updateKeeps[uid] == false) {
        keepRef = admin.database().ref('activities/' + clubKey + '/' + activityKey + '/keeps');
      } else {
        keepRef = admin.database().ref('activities/' + clubKey + '/' + activityKey + '/keeps/' + uid);
      }

      yield keepRef.set(updateKeeps[uid]);
    } catch (error) {
      throw error;
    }
  });

  return function updateActivityKeeps(_x119, _x120, _x121) {
    return _ref50.apply(this, arguments);
  };
}(); //更新user的activities


const updateUserKeeps =
/*#__PURE__*/
function () {
  var _ref51 = _asyncToGenerator(function* (clubKey, activityKey, updateKeeps) {
    try {
      const uid = Object.keys(updateKeeps)[0];
      console.log('hah');
      console.log(updateKeeps);
      let keepRef;

      if (updateKeeps[uid] == false) {
        keepRef = admin.database().ref('users/' + uid + '/activities/');
      } else {
        keepRef = admin.database().ref('users/' + uid + '/activities/' + clubKey + '/' + activityKey);
      }

      yield keepRef.set(updateKeeps[uid]);
    } catch (error) {
      throw error;
    }
  });

  return function updateUserKeeps(_x122, _x123, _x124) {
    return _ref51.apply(this, arguments);
  };
}(); ////////////////////////////////////////////////////////////////////////////////////
// Common
////////////////////////////////////////////////////////////////////////////////////
//轉換職位status轉換成中文


const changeMemberStatusToChinese = status => {
  try {
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
  } catch (error) {
    throw error;
  }
};
