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

//從firebase取得指定club下指定post之所有留言
export const getPostComments = async (clubKey, postKey) => {
    const commentRef = firebase.database().ref('comments/' + clubKey + '/' + postKey);
    const snapShot = await commentRef.once('value');
    const CommentData = snapShot.val();
    return CommentData;
}

/*
|-----------------------------------------------
|   database更新資料
|-----------------------------------------------
*/

//更新Post.Views
export const updatePostViews = async (clubKey, postKey, updateViews) => {
    const uid = Object.keys(updateViews)[0];
    const value = Object.values(updateViews)[0];
    const viewsRef = firebase.database().ref('posts/' + clubKey + '/' + postKey + '/views/' + uid);
    await viewsRef.set(value)
}

//更新Post.Favorites
export const updatePostFavorites = async (clubKey, postKey, updateFavorites) => {
    const uid = Object.keys(updateFavorites)[0];
    const value = Object.values(updateFavorites)[0];
    let favoritesRef;
    if (value == false) {
        favoritesRef = firebase.database().ref('posts/' + clubKey + '/' + postKey + '/favorites');
    }
    else {
        favoritesRef = firebase.database().ref('posts/' + clubKey + '/' + postKey + '/favorites/' + uid);
    }
    await favoritesRef.set(value);
}

export const updateUser = async (uid) => {

}

export const updateUserSetting = async (uid) => {

}

export const updateClub = async (cid) => {

}

/*
|-----------------------------------------------
|   database建立資料
|-----------------------------------------------
*/

//新增comment貼文、post下numComment+1
export const createComment = async (clubKey, postKey, content) => {
    const user = firebase.auth().currentUser;
    const commentRef = firebase.database().ref('comments/' + clubKey + '/' + postKey).push();
    const commentData = {
        commenter: user.uid,
        date: new Date().toLocaleString(),
        content: content
    }
    await commentRef.set(commentData);
    
    const getNumRef = firebase.database().ref('posts/' + clubKey + '/' + postKey + '/numComments');
    let snapShot = await getNumRef.once('value');
    let numComments = snapShot.val();
    numComments = numComments + 1;
    await getNumRef.set(numComments);
}