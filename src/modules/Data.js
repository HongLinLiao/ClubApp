import * as firebase from "firebase"
// import  from "./Post"

/*
|-----------------------------------------------
|   database取得資料
|-----------------------------------------------
*/

//從firebase取得指定uid之nickName
export const getUserData = async (uid) => {
    const uidRef = firebase.database().ref('users/' + uid);
    const snapshot = await uidRef.once('value');
    return snapshot.val();
}

//從firebase取得指定club資料
export const getClubData = async (clubKey) => {
    const clubRef = firebase.database().ref('clubs/' + clubKey);
    const snapshot = await clubRef.once('value');
    return snapshot.val();
};

//從firebase取得指定club下之所有post
export const getPostData = async (clubKey) => {
    const postRef = firebase.database().ref('posts/' + clubKey);
    const snapShot = await postRef.once('value');
    const postData = snapShot.val();
    return postData;
}

//從firebase取得指定club下指定post
export const getInsidePostData = async (clubKey, postKey) => {
    const postRef = firebase.database().ref('posts/' + clubKey + '/' + postKey);
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
export const updatePostViews = async (clubKey,postKey,updateViews) =>{
    const update = {};
    update['posts/'+clubKey+'/'+postKey+'/views'] = updateViews
    firebase.database().ref().update(update);
}

//更改Post.Favorites
export const updatePostFavorites = async (clubKey,postKey,updateFavorites) =>{
    const update = {};
    update['posts/'+clubKey+'/'+postKey+'/favorites'] = updateFavorites
    firebase.database().ref().update(update);
}

export const updateUser = async (uid) => {

}

export const updateUserSetting = async (uid) => {

}

export const updateClub = async (cid) => {

}

