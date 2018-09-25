import * as firebase from "firebase"
// import  from "./Post"

/*
|-----------------------------------------------
|   database取得資料
|-----------------------------------------------
*/

//取得user
export const getUserData = async (uid) => {
    const userRef = firebase.database().ref('users').child(uid)
    const snapshot = await userRef.once('value');
    return snapshot.val();
}

//取得club
export const getClubData = async (cid) => {
    const clubRef = firebase.database().ref('clubs').child(cid)
    const snapshot = await clubRef.once('value');
    return snapshot.val();
};

//取得所有文章資料
export const getPostData = async (cid) => {
    const postRef = firebase.database().ref('posts').child(cid)
    const snapShot = await postRef.once('value');
    const postData = snapShot.val();
    return postData;
}

//取得某一篇文章資料
export const getInsidePostData = async (cid, pid) => {
    const postRef = firebase.database().ref('posts').child(cid).child(pid)
    const snapShot = await postRef.once('value');
    const postData = snapShot.val();
    return postData;
}

/*
|-----------------------------------------------
|   database更新資料
|-----------------------------------------------
*/

//更改Post.Views
export const updatePostViews = async (cid, pid, viewsNumber) =>{
    const viewsRef = firebase.database().ref('posts').child(cid).child(pid).child('views')
    await viewsRef.update(viewsNumber)
}

//更改Post.Favorites
export const updatePostFavorites = async (cid, pid, favoritesNumber) =>{
    const favoritesRef = firebase.database().ref('posts').child(cid).child(pid).child('favorites')
    await favoritesRef.update(favoritesNumber)
}

//更新使用者基本資料
export const updateUser = async (uid, userData) => {
    const userRef = firebase.database().ref('users').child(uid)
    await userRef.update(userData)
}

//更新使用者設定
export const updateUserSetting = async (uid, settingData) => {
    const settingRef = firebase.database().ref('userSettings').child(uid)
    await settingRef.update(settingData)
}

//更新社團基本資料
export const updateClub = async (cid, clubData) => {
    const clubRef = firebase.database().ref('clubs').child(cid)
    await clubRef.update(clubData)
}


/*
|-----------------------------------------------
|   database刪除資料
|-----------------------------------------------
*/

//移除一個使用者
// export const removeUser = async (uid) => {
//     const userRef = firebase.database().ref('users').child(uid)
//     const settingRef = firebase.database().ref('userSettings').child(uid)
//     await userRef.remove()
//     await settingRef.remove()
// }


