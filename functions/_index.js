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
        if (expoToken) {
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

//發通知給社團成員
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

        if (expoToken && (globalNotification || clubNotificationList[cid].on) && !nightMode) {
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
    if (uid) {
        const userRecord = await admin.auth().getUser(uid)
        response.send(userRecord.toJSON());
    } else {
        response.send('你不要給我亂用!')
    }
});



////////////////////////////////////////////////////////////////////////////////////
// 貼文
////////////////////////////////////////////////////////////////////////////////////

//依傳入的clubList取得社團下貼文
exports.getHomePost = functions.https.onCall(async (data, context) => {
    try {
        const uid = context.auth.uid;
        const clubList = data;
        const clubKeyList = Object.keys(clubList);
        //回傳物件
        let objPost = [];
        if (clubKeyList.length > 0) {
            for (let i = 0; i < clubKeyList.length; i++) {
                if (clubList[clubKeyList[i]].selectStatus) {
                    let club = await getClubData(clubKeyList[i]);
                    if (club) {
                        //社團沒開放
                        if (club.open == false) {
                            //是否為社員
                            if (!club.member[uid]) {
                                continue;
                            }
                        }
                        objPost = await getPostFromClub(clubKeyList[i], uid, club, objPost);
                    }
                }
            }
        }
        return objPost;
    }
    catch (error) {
        console.log(context.auth.uid + ' : ' + error.toString());
    }
});

//進入貼文內頁
exports.getPostInside = functions.https.onCall(async (data, context) => {
    try {
        const { clubKey, postKey } = data;
        const { uid } = context.auth;
        const club = await getClubData(clubKey);
        if (club) {
            if (club.open == false) {
                if (!club.member[uid]) {
                    return null;
                }
            }
            let obj = {};
            let post = await getPostInsideData(clubKey, postKey);
            if (post) {
                //先取得貼文基本屬性
                post = await setPostFoundations(clubKey, postKey, uid, post, club);
                post = await setPostView(post, uid);
                obj.post = post;
            }
            else {
                return null;
            }
            let commentData = await getPostCommentData(clubKey, postKey);
            let comment = [];
            if (commentData) {
                let keyList = Object.keys(commentData);
                let temp;
                for (let i = 0; i < keyList.length; i++) {
                    commentData[keyList[i]] = await setCommentFoundations(clubKey, postKey, keyList[i], uid, commentData[keyList[i]]);
                    temp = {}
                    temp[keyList[i]] = commentData[keyList[i]]
                    comment.push(temp);
                }
                comment.sort(function (a, b) {
                    let aDate = a[Object.keys(a)[0]].date;
                    let bDate = b[Object.keys(b)[0]].date;
                    return new Date(bDate) < new Date(aDate) ? -1 : 1
                })
            }
            obj.comment = comment;
            return obj;
        }
    }
    catch (error) {
        console.log(context.auth.uid + ' : ' + error.toString());
    }
});

//按貼文讚
exports.setPostFavorite = functions.https.onCall(async (data, context) => {
    try {
        const { clubKey, postKey, commentStatus } = data;
        const uid = context.auth.uid;
        const club = await getClubData(clubKey);
        if (club) {
            if (club.open == false) {
                if (!club.member[uid]) {
                    return null;
                }
            }
            let post = await getPostInsideData(clubKey, postKey);
            if (post) {
                let obj = {};
                //先取得貼文基本屬性
                post = await setPostFoundations(clubKey, postKey, uid, post, club);

                let updateFavorites = {};
                //按讚處理
                //按讚
                if (post.statusFavorite == false) {
                    post.statusFavorite = !post.statusFavorite;
                    //牽扯到物件形狀
                    //沒其他使用者按過讚
                    if (post.numFavorites == 0) {
                        post.favorites = {};
                    }
                    post.numFavorites = post.numFavorites + 1;
                    post.favorites[uid] = true;
                    updateFavorites[uid] = true;
                }
                //取消讚
                else if (post.statusFavorite == true) {
                    post.statusFavorite = !post.statusFavorite;
                    //牽扯到物件形狀
                    //沒其他使用者按過讚
                    if (post.numFavorites == 1) {
                        post.favorites = false;
                        updateFavorites[uid] = false;
                    }
                    //有其他使用者按過讚
                    //設為null寫進firebase會自動消失
                    else {
                        delete post.favorites[uid];
                        updateFavorites[uid] = null;
                    }
                    post.numFavorites = post.numFavorites - 1;
                }
                //更改firebasePostFavorites
                await updatePostFavorites(post.clubKey, post.postKey, updateFavorites);
                obj.post = post;
                if (commentStatus) {
                    let commentData = await getPostCommentData(post.clubKey, post.postKey);
                    let comment = [];
                    if (commentData) {
                        let keyList = Object.keys(commentData);
                        let temp;
                        for (let i = 0; i < keyList.length; i++) {
                            commentData[keyList[i]] = await setCommentFoundations(post.clubKey, post.postKey, keyList[i], uid, commentData[keyList[i]]);
                            temp = {}
                            temp[keyList[i]] = commentData[keyList[i]]
                            comment.push(temp);
                        }
                        comment.sort(function (a, b) {
                            let aDate = a[Object.keys(a)[0]].date;
                            let bDate = b[Object.keys(b)[0]].date;
                            return new Date(bDate) < new Date(aDate) ? -1 : 1
                        })
                    }
                    obj.comment = comment;
                }
                return obj;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log(context.auth.uid + ' : ' + error.toString());
    }
});

//取得該社團下所有貼文
const getPostFromClub = async (clubKey, uid, club, objPost) => {
    try {
        let post = await getPostData(clubKey);
        if (post) {
            let postKeyList = Object.keys(post);
            for (let j = 0; j < postKeyList.length; j++) {
                let postKey = postKeyList[j];
                let nextPost = await setPostFoundations(clubKey, postKey, uid, post[postKey], club);
                objPost = handlePostDataToObject(objPost, clubKey, postKey, nextPost);
            }
        }
        return objPost;
    }
    catch (error) {
        throw error;
    }
}

//傳入參數貼文列Array，將貼文加入貼文列
const handlePostDataToObject = (objPost, clubKey, postKey, postData) => {
    try {
        //拷貝陣列
        let newObjPost = objPost.slice();
        let newPostData = {}
        newPostData[postKey] = postData;
        newObjPost.push(newPostData);
        // //重複
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
            return new Date(bDate) < new Date(aDate) ? -1 : 1
        })
        return newObjPost;
    }
    catch (error) {
        throw error;
    }
}

//貼文觀看
const setPostView = async (post, uid) => {
    try {
        //檢查使用者是否是第一次查看
        //不是第一次看
        if (post.views[uid] == true) {
        }
        //是第一次看
        else {
            let updateViews = {};
            //沒有其他使用者看過
            if (Object.keys(post.views).length == 0) {
                post.numViews = post.numViews + 1;
                post.views = {};
                post.views[uid] = true;
                post.statusView = true;
                updateViews[uid] = true;
            }
            //有其他使用者看過
            else {
                post.numViews = post.numViews + 1;
                post.views[uid] = true;
                post.statusView = true;
                updateViews[uid] = true;
            }
            //寫進資料庫
            await updatePostViews(post.clubKey, post.postKey, updateViews);
        }
        return post;
    }
    catch (error) {
        throw error;
    }
}

//處理貼文基本屬性(學校與社團名稱、key值、nickName、職位、views、favorites)
const setPostFoundations = async (clubKey, postKey, uid, post, club) => {
    try {
        //該貼文社團與學校名稱
        post.clubName = club.clubName;
        post.schoolName = club.schoolName;
        //處理poster職位名稱
        if (club.member[post.poster]) {
            post.posterStatus = club.member[post.poster].status;
            post.posterStatusChinese = changeMemberStatusToChinese(post.posterStatus);
        }
        else {
            post.posterStatus = ''
            post.posterStatusChinese = ''
        }
        //判斷是否可編輯或刪除貼文
        if (post.poster === uid) {
            post.statusEnable = true;
        }
        else {
            post.statusEnable = false;
        }
        //將clubKey放進attribute，否則找不到該貼文社團
        post.clubKey = clubKey;
        post.postKey = postKey;
        //處理User
        const userData = await getUserData(post.poster);
        post.posterNickName = userData.nickName;
        post.posterPhotoUrl = userData.photoUrl;
        //處理view和favorite
        post = setPostViewFavoriteData(post, uid);
        return post;
    }
    catch (error) {
        throw error;
    }
}

const setCommentFoundations = async (clubKey, postKey, commentKey, uid, comment) => {
    comment.clubKey = clubKey;
    comment.postKey = postKey;
    comment.commentKey = commentKey;
    comment.numFavorites = Object.keys(comment.favorites).length;
    if (comment.favorites[uid] == true)
        comment.statusFavorite = true;
    else
        comment.statusFavorite = false;
    //處理User
    const userData = await getUserData(comment.commenter);
    if (userData) {
        comment.commenterNickName = userData.nickName;
        comment.commenterPhotoUrl = userData.photoUrl;
    }
    if (comment.commenter === uid) {
        comment.statusEnable = true;
    }
    else {
        comment.statusEnable = false;
    }
    comment.statusEdit = false;
    return comment;
}

//產生statusView和statusFavorite
const setPostViewFavoriteData = (post, uid) => {
    try {
        //views與favorite數量
        post.numViews = Object.keys(post.views).length;
        post.numFavorites = Object.keys(post.favorites).length;
        //該使用者是否有按讚與觀看
        if (post.views[uid] == true)
            post.statusView = true;
        else
            post.statusView = false;
        if (post.favorites[uid] == true)
            post.statusFavorite = true;
        else
            post.statusFavorite = false;
        return post;
    }
    catch (error) {
        throw error;
    }
}

////////////////////////////////////////////////////////////////////////////////////
// Realtime Database
////////////////////////////////////////////////////////////////////////////////////

//取得特定社團資訊
const getClubData = async (clubKey) => {
    try {
        let clubRef = await admin.database().ref('clubs').child(clubKey).once('value');
        let club = clubRef.val();
        return club;
    }
    catch (error) {
        throw error;
    }
}

//取得特定社團下所有貼文資訊
const getPostData = async (clubKey) => {
    try {
        let postRef = await admin.database().ref('posts').child(clubKey).once('value');
        let post = postRef.val();
        return post;
    }
    catch (error) {
        throw error;
    }
}

//取得特定貼文資訊
const getPostInsideData = async (clubKey, postKey) => {
    try {
        let postRef = await admin.database().ref('posts').child(clubKey).child(postKey).once('value');
        let post = postRef.val();
        return post;
    }
    catch (error) {
        throw error;
    }
}

//取得貼文下的留言資訊
const getPostCommentData = async (clubKey, postKey) => {
    try {
        let commentRef = await admin.database().ref('comments').child(clubKey).child(postKey).once('value');
        let data = commentRef.val();
        return data;
    }
    catch (error) {
        throw error;
    }
}

//取得特定使用者資訊
const getUserData = async (uid) => {
    try {
        let userRef = await admin.database().ref('users').child(uid).once('value');
        let user = userRef.val();
        return user;
    }
    catch (error) {
        throw error;
    }
}

//更新Post的Favorites
const updatePostFavorites = async (clubKey, postKey, updateFavorites) => {
    const uid = Object.keys(updateFavorites)[0];
    let favoritesRef;
    if (updateFavorites[uid] == false) {
        favoritesRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/favorites');
    }
    else {
        favoritesRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/favorites/' + uid);
    }
    await favoritesRef.set(updateFavorites[uid]);
}

//更新Post的Views
const updatePostViews = async (clubKey, postKey, updateViews) => {
    const uid = Object.keys(updateViews)[0];
    const value = updateViews[uid];
    const viewsRef = admin.database().ref('posts/' + clubKey + '/' + postKey + '/views/' + uid);
    await viewsRef.set(value)
}

////////////////////////////////////////////////////////////////////////////////////
// Common
////////////////////////////////////////////////////////////////////////////////////

//轉換職位status轉換成中文
const changeMemberStatusToChinese = (status) => {
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
}