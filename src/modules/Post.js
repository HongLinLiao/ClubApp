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
} from "./Data"
import { changeMemberStatusToChinese } from './Common';
import * as PostAction from '../actions/PostAction'
import * as HomeAction from '../actions/HomeAction'


//取得貼文內頁資料(含留言)  //Router switch
// export const getInsidePost = (clubKey, postKey, router) => async (dispatch) => {
//     try {
//         //取得貼文基本基料
//         const post = await getInsidePostComplete(clubKey, postKey);
//         const newPost = {};
//         if (post != null) {
//             newPost[post.postKey] = post;
//             //判斷是否是第一遍看文章
//             const viewPost = await setPostView(newPost);
//             //取得貼文所有留言
//             const commentPost = await getPostComment(clubKey, postKey);

//             switch (router) {
//                 case 'Home':
//                     dispatch(HomeAction.getHomeInsidePostSuccess(viewPost));
//                     dispatch(HomeAction.getHomeInsidePostCommentSuccess(commentPost));
//                     break;
//                 default:
//                     console.log(router);
//             }
//             return viewPost;
//         }
//         else {
//             console.log('文章不存在');
//             alert('文章不存在');
//             return null;
//         }
//     }
//     catch (error) {
//         switch (router) {
//             case 'Home':
//                 dispatch(HomeAction.getHomeInsidePostFailure(error.toString()));
//             default:
//                 console.log(error.toString());
//         }
//         console.log(error.toString());
//     }
// }

//取得貼文內頁資訊(不含留言)
export const getInsidePostComplete = async (clubKey, postKey) => {
    const club = await getClubData(clubKey);
    let post = await getInsidePostData(clubKey, postKey);
    if (post != null) {
        post = await getPostFoundations(clubKey, postKey, post, club);
    }
    return post;
}



//********************************************************************************
//按讚與觀看
//********************************************************************************

//按讚
export const setPostFavorite = (clubKey, postKey, dealInsidePostStatus) => async (dispatch) => {
    try {
        //dealInsidePostStatus 為是否為貼文內頁按讚

        const postRef = firebase.database().ref('posts/' + clubKey + '/' + postKey);
        const snapshot = await postRef.once("value");
        if (snapshot.exists()) {

            const club = await getClubData(clubKey);
            const user = firebase.auth().currentUser;
            //更新貼文資訊
            const post = await getInsidePostData(clubKey, postKey);
            post = await getPostFoundations(clubKey, postKey, post, club);

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

            const commentPost = {}
            if (dealInsidePostStatus) {
                commentPost = await getPostComment(clubKey, postKey);
            }
        }
        else {
            console.log('貼文不存在');
            alert('貼文不存在');
        }
    }
    catch (error) {
        dispatch(PostAction.setPostFavoriteFailure(error));
        console.log(error.toString());
    }
}

//觀看 (只會在進入貼文執行，故不需判斷貼文是否存在)
export const setPostView = async (post) => {
    try {
        const user = firebase.auth().currentUser;
        const promisesViews = Object.keys(post).map(async (element) => {
            //檢查使用者是否是第一次查看
            //不是第一次看
            if (post[element].views[user.uid] == true) {
                console.log('已看過');
            }
            //是第一次看
            else {
                let updateViews = {};
                //沒有其他使用者看過
                if (Object.keys(post[element].views).length == 0) {
                    post[element].numViews = post[element].numViews + 1;
                    post[element].views = {};
                    post[element].views[user.uid] = true;
                    post[element].statusView = true;
                    updateViews[user.uid] = true;
                }
                //有其他使用者看過
                else {
                    post[element].numViews = post[element].numViews + 1;
                    post[element].views[user.uid] = true;
                    post[element].statusView = true;
                    updateViews[user.uid] = true;
                }
                await updatePostViews(post[element].clubKey, post[element].postKey, updateViews);
            }
        })
        await Promise.all(promisesViews);
        return post;
    }
    catch (error) {
        console.log(error.toString());
        throw error;
    }
}


//********************************************************************************
//留言
//********************************************************************************

//取得貼文留言
export const getPostComment = async (clubKey, postKey) => {
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
            commentData[element].posterPhotoUrl = userData.photoUrl;
            if (commentData[element].commenter === user.uid) {
                commentData[element].statusEnable = true;
            }
            else {
                commentData[element].statusEnable = false;
            }
            commentData[element].statusEdit = false;
        })
        await Promise.all(promisesComment);
        commentPost[postKey] = commentData;
    }
    if (Object.keys(commentPost).length == 0) {
        commentPost[postKey] = false;
    }
    return commentPost;
}

//新增留言
export const creatingComment = (clubKey, postKey, router, content) => async (dispatch) => {

    try {
        const postRef = firebase.database().ref('posts/' + clubKey + '/' + postKey);
        const snapshot = await postRef.once("value");
        if (snapshot.exists()) {
            //新增留言進firebase
            await createComment(clubKey, postKey, content);

            //貼文資料全部重抓更新
            const reload = dispatch(getInsidePost(clubKey, postKey, router));
        }
        else {
            console.log('貼文不存在');
            alert('貼文不存在');
        }
    }
    catch (error) {
        console.log(error);
    }
}

//刪除留言
export const deletingComment = (clubKey, postKey, commentKey, router) => async (dispatch) => {
    try {
        const postRef = firebase.database().ref('posts/' + clubKey + '/' + postKey);
        const snapshot = await postRef.once("value");
        if (snapshot.exists()) {
            //從firebase刪除留言
            await deleteComment(clubKey, postKey, commentKey);

            //貼文資料全部重抓更新
            const reload = dispatch(getInsidePost(clubKey, postKey, router));
        }
        else {
            console.log('貼文不存在');
            alert('貼文不存在');
        }
    }
    catch (error) {
        console.log(error);
    }
}

//編輯留言
export const editingComment = (clubKey, postKey, commentKey, router, content) => async (dispatch) => {
    try {
        const postRef = firebase.database().ref('posts/' + clubKey + '/' + postKey);
        const snapshot = await postRef.once("value");
        if (snapshot.exists()) {
            //從firebase編輯留言
            await editComment(clubKey, postKey, commentKey, content);

            //貼文資料全部重抓更新
            const reload = dispatch(getInsidePost(clubKey, postKey, router));
        }
        else {
            console.log('貼文不存在');
            alert('貼文不存在');
        }
    }
    catch (error) {
        console.log(error);
    }
}

//********************************************************************************
//Comment component顯示關係處理
//********************************************************************************

//改變comment編輯留言狀態  //Router switch
export const setCommentEditStatus = (postKey, commentKey, router, comments, element) => async (dispatch) => {
    try {
        const commentList = { ...comments };
        const tempElement = { ...element };
        tempElement.statusEdit = !tempElement.statusEdit;
        const newElement = {};
        newElement[commentKey] = tempElement;
        commentList[postKey] = { ...commentList[postKey], ...newElement };

        switch (router) {
            case 'Home':
                dispatch(HomeAction.setHomeCommentStatusSuccess(commentList));
                break;
            default:
                console.log(router);
        }
    }
    catch (error) {
        console.log(error);
    }
}


//==================================================================================
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

//用postKeyList進firebase抓新資料
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
            const club = await getClubData(clubKey);
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

//將post加進postReducer
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

//處理貼文基本屬性(學校與社團名稱、key值、nickName、職位、views、favorites)
export const setPostFoundations = async (clubKey, postKey, post, club) => {
    try {
        //該貼文社團與學校名稱
        post.clubName = club.clubName;
        post.schoolName = club.schoolName;
        //處理poster職位名稱
        post.posterStatus = club.member[post.poster].status;
        post.posterStatusChinese = changeMemberStatusToChinese(post.posterStatus);
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
            const club = await getClubData(clubKey);
            //先取得貼文基本屬性
            postData = await setPostFoundations(clubKey, postKey, postData, club);
            //取得postReducer
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