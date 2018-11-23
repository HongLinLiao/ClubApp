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
}()); //進入貼文內頁

exports.getPostInside = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(function* (data, context) {
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
            commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]]);
            temp = {};
            temp[keyList[i]] = commentData[keyList[i]];
            comment.push(temp);
          }

          comment.sort(function (a, b) {
            let aDate = a[Object.keys(a)[0]].date;
            let bDate = b[Object.keys(b)[0]].date;
            return new Date(bDate) < new Date(aDate) ? -1 : 1;
          });
        }

        obj.comment = comment;
        return obj;
      }
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}()); //新增貼文
// exports.createPost = functions.https.onCall(async(data, context)=>{
//     try{
//         const { clubKey, postKey } = data;
//         const { uid } = context.auth;
//         const club = await getClubData(clubKey);
//     }
//     catch(error){
//         console.log(context.auth.uid + ' : ' + error.toString());
//     }
// });
//刪除貼文

exports.deletePost = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey,
        postList
      } = data;
      const {
        uid
      } = context.auth;
      const club = yield getClubData(clubKey);
      let obj = {};
      let newPostList = postList.slice();
      let result = newPostList.some(function (value, index, array) {
        if (Object.keys(value)[0] == postKey) {
          newPostList.splice(index, 1);
          return true;
        } else {
          return false;
        }
      });
      obj.postList = newPostList;

      if (club) {
        if (club.open == false) {
          if (!club.member[uid]) {
            obj.status = false;
            return obj;
          }
        }

        yield deletePostData(clubKey, postKey);
        obj.status = true;
      } else {
        obj.status = false;
      }

      return obj;
    } catch (error) {
      console.log(context.auth.uid + ' : ' + error.toString());
    }
  });

  return function (_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}()); //按貼文讚

exports.setPostFavorite = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(function* (data, context) {
    try {
      const {
        clubKey,
        postKey,
        commentStatus
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
          obj.post = post;

          if (commentStatus) {
            let commentData = yield getPostCommentData(post.clubKey, post.postKey);
            let comment = [];

            if (commentData) {
              let keyList = Object.keys(commentData);
              let temp;

              for (let i = 0; i < keyList.length; i++) {
                commentData[keyList[i]] = yield setCommentFoundations(post.clubKey, post.postKey, keyList[i], uid, commentData[keyList[i]]);
                temp = {};
                temp[keyList[i]] = commentData[keyList[i]];
                comment.push(temp);
              }

              comment.sort(function (a, b) {
                let aDate = a[Object.keys(a)[0]].date;
                let bDate = b[Object.keys(b)[0]].date;
                return new Date(bDate) < new Date(aDate) ? -1 : 1;
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

  return function (_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}()); //新增留言

exports.createComment = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(function* (data, context) {
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
          let obj = {};
          yield createCommentData(clubKey, postKey, content, uid);
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
              commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]]);
              temp = {};
              temp[keyList[i]] = commentData[keyList[i]];
              comment.push(temp);
            }

            comment.sort(function (a, b) {
              let aDate = a[Object.keys(a)[0]].date;
              let bDate = b[Object.keys(b)[0]].date;
              return new Date(bDate) < new Date(aDate) ? -1 : 1;
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

  return function (_x16, _x17) {
    return _ref9.apply(this, arguments);
  };
}()); //刪除留言

exports.deleteComment = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(function* (data, context) {
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
              commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]]);
              temp = {};
              temp[keyList[i]] = commentData[keyList[i]];
              comment.push(temp);
            }

            comment.sort(function (a, b) {
              let aDate = a[Object.keys(a)[0]].date;
              let bDate = b[Object.keys(b)[0]].date;
              return new Date(bDate) < new Date(aDate) ? -1 : 1;
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

  return function (_x18, _x19) {
    return _ref10.apply(this, arguments);
  };
}()); //編輯留言

exports.editComment = functions.https.onCall(
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(function* (data, context) {
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
              commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]]);
              temp = {};
              temp[keyList[i]] = commentData[keyList[i]];
              comment.push(temp);
            }

            comment.sort(function (a, b) {
              let aDate = a[Object.keys(a)[0]].date;
              let bDate = b[Object.keys(b)[0]].date;
              return new Date(bDate) < new Date(aDate) ? -1 : 1;
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
}()); //按留言讚

exports.setCommentFavorite = functions.https.onCall(
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
          post = yield setPostFoundations(clubKey, postKey, uid, post, club);
          post = yield setPostView(post, uid);
          obj.post = post;
          let commentData = yield getPostCommentData(clubKey, postKey);
          let comment = [];

          if (commentData) {
            let keyList = Object.keys(commentData);
            let temp;

            for (let i = 0; i < keyList.length; i++) {
              commentData[keyList[i]] = yield setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]]); //按讚處理

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
              }

              temp = {};
              temp[keyList[i]] = commentData[keyList[i]];
              comment.push(temp);
            }

            comment.sort(function (a, b) {
              let aDate = a[Object.keys(a)[0]].date;
              let bDate = b[Object.keys(b)[0]].date;
              return new Date(bDate) < new Date(aDate) ? -1 : 1;
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
}()); //取得該社團下所有貼文

const getPostFromClub =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(function* (clubKey, uid, club, obj) {
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

  return function getPostFromClub(_x24, _x25, _x26, _x27) {
    return _ref13.apply(this, arguments);
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
  var _ref14 = _asyncToGenerator(function* (post, uid) {
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

  return function setPostView(_x28, _x29) {
    return _ref14.apply(this, arguments);
  };
}(); //處理貼文基本屬性(學校與社團名稱、key值、nickName、職位、views、favorites、編輯狀態、照片)


const setPostFoundations =
/*#__PURE__*/
function () {
  var _ref15 = _asyncToGenerator(function* (clubKey, postKey, uid, post, club) {
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
      } //判斷是否可編輯或刪除貼文(社長與幹部有此權限)


      let editStatus = false;

      if (club.member[uid]) {
        if (club.member[uid].status == "master" || club.member[uid].status == "supervisor") {
          editStatus = true;
        }
      }

      if (post.poster === uid) {
        post.statusEnable = true;
      }

      if (editStatus) {
        post.statusEnable = true;
      } else {
        post.statusEnable = false;
      } //處理照片


      if (!post.images) {
        post.images = {};
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

  return function setPostFoundations(_x30, _x31, _x32, _x33, _x34) {
    return _ref15.apply(this, arguments);
  };
}(); //處理留言基本屬性


const setCommentFoundations =
/*#__PURE__*/
function () {
  var _ref16 = _asyncToGenerator(function* (clubKey, postKey, commentKey, uid, comment) {
    try {
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

      if (comment.commenter === uid) {
        comment.statusEnable = true;
      } else {
        comment.statusEnable = false;
      }

      comment.statusEdit = false;
      return comment;
    } catch (error) {
      throw error;
    }
  });

  return function setCommentFoundations(_x35, _x36, _x37, _x38, _x39) {
    return _ref16.apply(this, arguments);
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
  var _ref17 = _asyncToGenerator(function* (clubKey) {
    try {
      let clubRef = yield admin.database().ref('clubs').child(clubKey).once('value');
      let club = clubRef.val();
      return club;
    } catch (error) {
      throw error;
    }
  });

  return function getClubData(_x40) {
    return _ref17.apply(this, arguments);
  };
}(); //取得特定社團下所有貼文資訊


const getPostData =
/*#__PURE__*/
function () {
  var _ref18 = _asyncToGenerator(function* (clubKey) {
    try {
      let postRef = yield admin.database().ref('posts').child(clubKey).once('value');
      let post = postRef.val();
      return post;
    } catch (error) {
      throw error;
    }
  });

  return function getPostData(_x41) {
    return _ref18.apply(this, arguments);
  };
}(); //取得特定貼文資訊


const getPostInsideData =
/*#__PURE__*/
function () {
  var _ref19 = _asyncToGenerator(function* (clubKey, postKey) {
    try {
      let postRef = yield admin.database().ref('posts').child(clubKey).child(postKey).once('value');
      let post = postRef.val();
      return post;
    } catch (error) {
      throw error;
    }
  });

  return function getPostInsideData(_x42, _x43) {
    return _ref19.apply(this, arguments);
  };
}(); //取得貼文下的留言資訊


const getPostCommentData =
/*#__PURE__*/
function () {
  var _ref20 = _asyncToGenerator(function* (clubKey, postKey) {
    try {
      let commentRef = yield admin.database().ref('comments').child(clubKey).child(postKey).once('value');
      let data = commentRef.val();
      return data;
    } catch (error) {
      throw error;
    }
  });

  return function getPostCommentData(_x44, _x45) {
    return _ref20.apply(this, arguments);
  };
}(); //取得特定使用者資訊


const getUserData =
/*#__PURE__*/
function () {
  var _ref21 = _asyncToGenerator(function* (uid) {
    try {
      let userRef = yield admin.database().ref('users').child(uid).once('value');
      let user = userRef.val();
      return user;
    } catch (error) {
      throw error;
    }
  });

  return function getUserData(_x46) {
    return _ref21.apply(this, arguments);
  };
}(); //更新Post的Favorites


const updatePostFavorites =
/*#__PURE__*/
function () {
  var _ref22 = _asyncToGenerator(function* (clubKey, postKey, updateFavorites) {
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

  return function updatePostFavorites(_x47, _x48, _x49) {
    return _ref22.apply(this, arguments);
  };
}(); //更新Post的Views


const updatePostViews =
/*#__PURE__*/
function () {
  var _ref23 = _asyncToGenerator(function* (clubKey, postKey, updateViews) {
    try {
      const uid = Object.keys(updateViews)[0];
      const value = updateViews[uid];
      const viewsRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/views/' + uid);
      yield viewsRef.set(value);
    } catch (error) {
      throw error;
    }
  });

  return function updatePostViews(_x50, _x51, _x52) {
    return _ref23.apply(this, arguments);
  };
}(); //新增留言


const createCommentData =
/*#__PURE__*/
function () {
  var _ref24 = _asyncToGenerator(function* (clubKey, postKey, content, uid) {
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

  return function createCommentData(_x53, _x54, _x55, _x56) {
    return _ref24.apply(this, arguments);
  };
}(); //刪除留言


const deleteCommentData =
/*#__PURE__*/
function () {
  var _ref25 = _asyncToGenerator(function* (clubKey, postKey, commentKey) {
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

  return function deleteCommentData(_x57, _x58, _x59) {
    return _ref25.apply(this, arguments);
  };
}(); //編輯留言


const editCommentData =
/*#__PURE__*/
function () {
  var _ref26 = _asyncToGenerator(function* (clubKey, postKey, commentKey, content) {
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

  return function editCommentData(_x60, _x61, _x62, _x63) {
    return _ref26.apply(this, arguments);
  };
}(); //更新Comment的Favorites


const updateCommentFavorites =
/*#__PURE__*/
function () {
  var _ref27 = _asyncToGenerator(function* (clubKey, postKey, commentKey, updateFavorites) {
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

  return function updateCommentFavorites(_x64, _x65, _x66, _x67) {
    return _ref27.apply(this, arguments);
  };
}(); //刪除貼文


const deletePostData =
/*#__PURE__*/
function () {
  var _ref28 = _asyncToGenerator(function* (clubKey, postKey) {
    try {
      const postRef = admin.database().ref('posts/' + clubKey + '/' + postKey);
      yield postRef.remove();
      const commentRef = admin.database().ref('comments/' + clubKey + '/' + postKey);
      yield commentRef.remove();
    } catch (error) {
      throw error;
    }
  });

  return function deletePostData(_x68, _x69) {
    return _ref28.apply(this, arguments);
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
