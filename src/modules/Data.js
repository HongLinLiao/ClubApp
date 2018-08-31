import * as firebase from "firebase"
// import  from "./Post"

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