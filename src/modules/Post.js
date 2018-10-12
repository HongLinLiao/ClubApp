import * as firebase from "firebase"
import {
    getPostData,
    getClubData,
    getInsidePostData,
    updatePostViews,
    updatePostFavorites,
    getPostComments,
    createComment,
    deleteComment,
    editComment,
    getUserData,
    deletePost,
    deleteCommentInPost,
} from "./Data"
import { changeMemberStatusToChinese } from './Common';
import * as PostAction from '../actions/PostAction'

//********************************************************************************
// Get Data
//********************************************************************************

//傳入clubKey，取得社團下postKeyArray
export const getPostKeyListFromClubKey = async (clubKey) => {
    try {
        const postData = await getPostData(clubKey);
        let postKeyList = {};
        if (postData != null) {
            postKeyList[clubKey] = Object.keys(postData);
        }
        return postKeyList;
    }
    catch (error) {
        console.log(error.toString());
        throw error;
    }

}

//用postKeyArray進firebase抓新資料
export const getPostDataComplete = (postKeyList) => async (dispatch, getState) => {
    try {
        let postData;

        const postReducer = getState().postReducer.allPost;
        //新物件: postReducer資料
        const newPostReducer = JSON.parse(JSON.stringify(postReducer));
        //回傳物件
        const objPost = {};
        var i, j;
        for (i = 0; i < Object.keys(postKeyList).length; i++) {
            const clubKey = Object.keys(postKeyList)[i];

            //取得社團資料
            let club;
            const joinClubs = getState().clubReducer.joinClubs;
            const likeClubs = getState().clubReducer.likeClubs;
            const clubData = { ...joinClubs, ...likeClubs };
            if (clubData[clubKey]) {
                club = clubData[clubKey]
            }
            else {
                club = await getClubData(clubKey);
            }
            for (j = 0; j < postKeyList[clubKey].length; j++) {
                const postKey = postKeyList[clubKey][j];
                postData = await getInsidePostData(clubKey, postKey);
                if (postData != null) {
                    postData = await setPostFoundations(clubKey, postKey, postData, club);
                    newPostReducer = handlePostDataToReducer(newPostReducer, clubKey, postKey, postData);
                    objPost = handlePostDataToObject(objPost, clubKey, postKey, postData);
                }
            }
        }
        dispatch(PostAction.getPostData(newPostReducer));
        return objPost;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//進入內頁
export const getInsidePost = (clubKey, postKey) => async (dispatch, getState) => {
    try {
        const postData = await getInsidePostData(clubKey, postKey);
        if (postData == null) {
            alert('Post is not exist!');
            console.log('Post is not exist!');
            return null;
        }
        else {
            //取得社團資料
            let club;
            const joinClubs = getState().clubReducer.joinClubs;
            const likeClubs = getState().clubReducer.likeClubs;
            const clubData = { ...joinClubs, ...likeClubs };
            if (clubData[clubKey]) {
                club = clubData[clubKey]
            }
            else {
                club = await getClubData(clubKey);
            }
            //先取得貼文基本屬性
            postData = await setPostFoundations(clubKey, postKey, postData, club);
            //觀看
            postData = await setPostView(postData);
            //寫進postReducer
            const prePostReducer = getState().postReducer.allPost;
            const newPrePostReducer = JSON.parse(JSON.stringify(prePostReducer));
            const nextPostReducer = handlePostDataToReducer(newPrePostReducer, clubKey, postKey, postData);
            dispatch(PostAction.getPostData(nextPostReducer));
            return postData;
        }
    }
    catch (error) {
        console.log(error.toString);
    }
}

//********************************************************************************
// handle
//********************************************************************************

//傳入參數貼文列物件，將貼文加入貼文列物件
export const handlePostDataToObject = (objPost, clubKey, postKey, postData) => {
    try {
        //新物件
        const newObjPost = JSON.parse(JSON.stringify(objPost));
        const newPostData = {}
        newPostData[postKey] = postData;
        let nextPostData = {};
        nextPostData = { ...objPost[clubKey], ...newPostData };
        newObjPost[clubKey] = nextPostData;
        return newObjPost;
    }
    catch (error) {
        throw error;
    }
}

//產生新的object混合新貼文
export const handlePostDataToReducer = (postReducer, clubKey, postKey, postData) => {
    try {
        //新物件: postReducer資料
        const newPrePostReducer = JSON.parse(JSON.stringify(postReducer));
        const newPostData = {}
        newPostData[postKey] = postData;
        const nextPostData = {};
        nextPostData = { ...newPrePostReducer[clubKey], ...newPostData };
        newPrePostReducer[clubKey] = nextPostData;
        return newPrePostReducer;
    }
    catch (error) {
        throw error;
    }
}

//********************************************************************************
// 貼文
//********************************************************************************

//新增貼文
export const createPost = (cid, postData) => async (dispatch) => {

    try {
        dispatch(PostAction.createPostRequest())

        console.log(cid)
        const user = firebase.auth().currentUser
        const postRef = firebase.database().ref('posts').child(cid).push()

        const postDB = {
            title: postData.title,
            content: postData.content,
            images: postData.images,
            poster: user.uid,
            date: new Date().toLocaleString(),
            favorites: false,
            views: false,
            numComments: 0
        }

        await postRef.set(postDB)


        //更新reducer還沒做

    } catch (e) {

        console.log(e)

        throw e
    }
}

//刪除貼文
export const deletePostData = (clubKey, postKey, postList) => async (dispatch, getState) => {

    try {
        await deletePost(clubKey, postKey);
        await deleteCommentInPost(clubKey, postKey);
        //寫進postReducer
        const prePostReducer = getState().postReducer.allPost;
        const nextPostReducer = JSON.parse(JSON.stringify(prePostReducer));
        //delete不可直接刪除物件中的物件，必須先轉型
        nextPostReducer[clubKey][postKey] = null;
        delete nextPostReducer[clubKey][postKey];
        dispatch(PostAction.getPostData(nextPostReducer));
        //更改回傳postList
        const nextPostList = JSON.parse(JSON.stringify(postList));
        delete nextPostList[clubKey][postKey];
        return nextPostList
    } catch (e) {
        console.log(e)
    }
}

//********************************************************************************
//處理貼文屬性
//********************************************************************************

//處理貼文基本屬性(學校與社團名稱、key值、nickName、職位、views、favorites)
export const setPostFoundations = async (clubKey, postKey, post, club) => {
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
        //將clubKey放進attribute，否則找不到該貼文社團
        post.clubKey = clubKey;
        post.postKey = postKey;
        //處理User
        userData = await getUserData(post.poster);
        post.posterNickName = userData.nickName;
        post.posterPhotoUrl = userData.photoUrl;
        //處理view和favorite
        const user = firebase.auth().currentUser;
        post = setViewFavoriteData(post, user.uid);
        return post;
    }
    catch (error) {
        throw error;
    }
}

//產生statusView和statusFavorite
export const setViewFavoriteData = (post, userUid) => {
    try {
        //views與favorite數量
        post.numViews = Object.keys(post.views).length;
        post.numFavorites = Object.keys(post.favorites).length;
        //該使用者是否有按讚與觀看
        if (post.views[userUid] == true)
            post.statusView = true;
        else
            post.statusView = false;
        if (post.favorites[userUid] == true)
            post.statusFavorite = true;
        else
            post.statusFavorite = false;
        return post;
    }
    catch (error) {
        throw error;
    }
}

//********************************************************************************
//按讚與觀看
//********************************************************************************

//觀看
export const setPostView = async (post) => {
    try {
        const user = firebase.auth().currentUser;
        //檢查使用者是否是第一次查看
        //不是第一次看
        if (post.views[user.uid] == true) {
            console.log('已看過');
        }
        //是第一次看
        else {
            let updateViews = {};
            //沒有其他使用者看過
            if (Object.keys(post.views).length == 0) {
                post.numViews = post.numViews + 1;
                post.views = {};
                post.views[user.uid] = true;
                post.statusView = true;
                updateViews[user.uid] = true;
            }
            //有其他使用者看過
            else {
                post.numViews = post.numViews + 1;
                post.views[user.uid] = true;
                post.statusView = true;
                updateViews[user.uid] = true;
            }
            //寫進資料庫
            await updatePostViews(post.clubKey, post.postKey, updateViews);
            console.log('已設定觀看');
        }
        return post;
    }
    catch (error) {
        console.log(error.toString());
        throw error;
    }
}

//按讚
export const setPostFavorite = (clubKey, postKey) => async (dispatch, getState) => {
    try {
        const post = await getInsidePostData(clubKey, postKey);
        if (post != null) {
            //取得使用者id
            const user = firebase.auth().currentUser;
            //取得社團資料
            let club;
            const joinClubs = getState().clubReducer.joinClubs;
            const likeClubs = getState().clubReducer.likeClubs;
            const clubData = { ...joinClubs, ...likeClubs };
            if (clubData[clubKey]) {
                club = clubData[clubKey]
            }
            else {
                club = await getClubData(clubKey);
            }
            //先取得貼文基本屬性
            post = await setPostFoundations(clubKey, postKey, post, club);

            let updateFavorites = {};
            //按讚處理
            //按讚
            if (post.statusFavorite == false) {
                post.statusFavorite = !post.statusFavorite;
                //牽扯到物件形狀
                //沒其他使用者按過讚
                if (post.numFavorites == 0) {
                    post.numFavorites = post.numFavorites + 1;
                    post.favorites = {};
                    post.favorites[user.uid] = true;
                    updateFavorites[user.uid] = true;
                }
                //有其他使用者按過讚
                else {
                    post.numFavorites = post.numFavorites + 1;
                    post.favorites[user.uid] = true;
                    updateFavorites[user.uid] = true;
                }
            }
            //取消讚
            else {
                post.statusFavorite = !post.statusFavorite;
                //牽扯到物件形狀
                //沒其他使用者按過讚
                if (post.numFavorites == 1) {
                    post.numFavorites = post.numFavorites - 1;
                    delete post.favorites[user.uid];
                    updateFavorites[user.uid] = false;
                }
                //有其他使用者按過讚
                //設為null寫進firebase會自動消失
                else {
                    post.numFavorites = post.numFavorites - 1;
                    delete post.favorites[user.uid];
                    updateFavorites[user.uid] = null;
                }
            }
            //更改firebasePostFavorites
            await updatePostFavorites(post.clubKey, post.postKey, updateFavorites);

            //寫進Reducer
            const prePostReducer = getState().postReducer.allPost;
            const newPrePostReducer = JSON.parse(JSON.stringify(prePostReducer));
            const nextPostReducer = handlePostDataToReducer(newPrePostReducer, clubKey, postKey, post);
            dispatch(PostAction.getPostData(nextPostReducer));
            return post;
        }
        else {
            console.log('貼文不存在');
            alert('貼文不存在');
            return null;
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//********************************************************************************
//留言
//********************************************************************************

//取得貼文留言
export const getPostComment = (clubKey, postKey) => async (dispatch) => {
    const user = firebase.auth().currentUser;
    const commentPost = {};
    const commentData = await getPostComments(clubKey, postKey);
    if (commentData != null) {
        //將key放進物件裡
        const promisesComment = Object.keys(commentData).map(async (element) => {
            commentData[element].clubKey = clubKey;
            commentData[element].postKey = postKey;
            commentData[element].commentKey = element;
            //處理User
            userData = await getUserData(commentData[element].commenter);
            commentData[element].commenterNickName = userData.nickName;
            commentData[element].commenterPhotoUrl = userData.photoUrl;
            if (commentData[element].commenter === user.uid) {
                commentData[element].statusEnable = true;
            }
            else {
                commentData[element].statusEnable = false;
            }
            commentData[element].statusEdit = false;
            commentPost[commentData[element].commentKey] = commentData[element];
        })
        await Promise.all(promisesComment);
    }
    return commentPost;
}

//新增留言
export const creatingComment = (clubKey, postKey, content) => async (dispatch, getState) => {

    try {
        const postRef = firebase.database().ref('posts/' + clubKey + '/' + postKey);
        const snapshot = await postRef.once("value");
        if (snapshot.exists()) {
            const obj = {};
            //新增留言進firebase
            await createComment(clubKey, postKey, content);

            //貼文資料全部重抓更新
            const post = await getInsidePostData(clubKey, postKey);
            //取得社團資料
            let club;
            const joinClubs = getState().clubReducer.joinClubs;
            const likeClubs = getState().clubReducer.likeClubs;
            const clubData = { ...joinClubs, ...likeClubs };
            if (clubData[clubKey]) {
                club = clubData[clubKey]
            }
            else {
                club = await getClubData(clubKey);
            }
            //先取得貼文基本屬性
            post = await setPostFoundations(clubKey, postKey, post, club);
            const prePostReducer = getState().postReducer.allPost;
            const newPrePostReducer = JSON.parse(JSON.stringify(prePostReducer));
            const nextPostReducer = handlePostDataToReducer(newPrePostReducer, clubKey, postKey, post);
            dispatch(PostAction.getPostData(nextPostReducer));
            obj['postList'] = nextPostReducer;
            //留言資料全部重抓
            const comment = await dispatch(getPostComment(clubKey, postKey));
            obj['comment'] = comment;
            return obj;
        }
        else {
            console.log('貼文不存在');
            alert('貼文不存在');
            return null;
        }
    }
    catch (error) {
        console.log(error);
    }
}

//刪除留言
export const deletingComment = (clubKey, postKey, commentKey) => async (dispatch, getState) => {
    try {
        const postRef = firebase.database().ref('posts/' + clubKey + '/' + postKey);
        const snapshot = await postRef.once("value");
        if (snapshot.exists()) {
            const obj = {};

            //從firebase刪除留言
            await deleteComment(clubKey, postKey, commentKey);

            //貼文資料全部重抓更新
            const post = await getInsidePostData(clubKey, postKey);
            //取得社團資料
            let club;
            const joinClubs = getState().clubReducer.joinClubs;
            const likeClubs = getState().clubReducer.likeClubs;
            const clubData = { ...joinClubs, ...likeClubs };
            if (clubData[clubKey]) {
                club = clubData[clubKey]
            }
            else {
                club = await getClubData(clubKey);
            }
            //先取得貼文基本屬性
            post = await setPostFoundations(clubKey, postKey, post, club);
            const prePostReducer = getState().postReducer.allPost;
            const newPrePostReducer = JSON.parse(JSON.stringify(prePostReducer));
            const nextPostReducer = handlePostDataToReducer(newPrePostReducer, clubKey, postKey, post);
            dispatch(PostAction.getPostData(nextPostReducer));
            obj['postList'] = nextPostReducer;
            //留言資料全部重抓
            const comment = await dispatch(getPostComment(clubKey, postKey));
            obj['comment'] = comment;
            return obj;
        }
        else {
            console.log('貼文不存在');
            alert('貼文不存在');
            return null;
        }
    }
    catch (error) {
        console.log(error);
    }
}

//編輯留言
export const editingComment = (clubKey, postKey, commentKey, content) => async (dispatch, getState) => {
    try {
        const postRef = firebase.database().ref('posts/' + clubKey + '/' + postKey);
        const snapshot = await postRef.once("value");
        if (snapshot.exists()) {
            const obj = {};
            //從firebase編輯留言
            await editComment(clubKey, postKey, commentKey, content);

            //貼文資料全部重抓更新
            const post = await getInsidePostData(clubKey, postKey);
            //取得社團資料  
            const club = await getClubData(clubKey);
            //先取得貼文基本屬性
            post = await setPostFoundations(clubKey, postKey, post, club);
            const prePostReducer = getState().postReducer.allPost;
            const newPrePostReducer = JSON.parse(JSON.stringify(prePostReducer));
            const nextPostReducer = handlePostDataToReducer(newPrePostReducer, clubKey, postKey, post);
            dispatch(PostAction.getPostData(nextPostReducer));
            obj['postList'] = nextPostReducer;
            //留言資料全部重抓
            const comment = await dispatch(getPostComment(clubKey, postKey));
            obj['comment'] = comment;
            return obj;
        }
        else {
            console.log('貼文不存在');
            alert('貼文不存在');
            return null;
        }
    }
    catch (error) {
        console.log(error);
    }
}
