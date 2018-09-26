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
    editComment
} from "./Data"
import { changeMemberStatusToChinese, getNickName } from './Common';
import * as PostAction from '../actions/PostAction'
import * as HomeAction from '../actions/HomeAction'

//********************************************************************************
//主函式
//********************************************************************************

//取得貼文內頁資料(含留言)
export const getInsidePost = (clubKey, postKey, router) => async (dispatch) => {
    try {
        //取得貼文基本基料
        const post = await getInsidePostComplete(clubKey, postKey);
        const newPost = {};
        newPost[post.postKey] = post;
        //判斷是否是第一遍看文章
        const viewPost = await setPostView(newPost);
        //取得貼文所有留言
        const commentPost = await getPostComment(clubKey, postKey);

        switch (router) {
            case 'Home':
                dispatch(HomeAction.getHomeInsidePostSuccess(viewPost));
                break;
            default:
                console.log(router);
        }
        switch (router) {
            case 'Home':
                dispatch(HomeAction.getHomeInsidePostCommentSuccess(commentPost));
                break;
            default:
                console.log(router);
        }
        dispatch(setPostChangeToReducer(viewPost[postKey], commentPost));
    }
    catch (error) {
        switch (router) {
            case 'Home':
                dispatch(HomeAction.getHomeInsidePostFailure(error.toString()));
            default:
                console.log(error.toString());
        }
        console.log(error.toString());
    }
}

//取得貼文列資訊(不含留言)
export const getPostListComplete = async (clubKey) => {
    var postList = {};
    var i;
    //取得該社團資訊
    const club = await getClubData(clubKey);
    const post = await getPostData(clubKey);
    if (post != null) {
        const key = Object.keys(post);
        for (i = 0; i < key.length > 0; i++) {
            //取得貼文基本屬性
            post[key[i]] = await getPostFoundations(clubKey, key[i], post[key[i]], club);
            postList = { ...postList, ...post };
        }
    }
    return postList;
}

//********************************************************************************
//貼文
//********************************************************************************

//取得貼文資訊(不含留言)
export const getInsidePostComplete = async (clubKey, postKey) => {
    const club = await getClubData(clubKey);
    let post = await getInsidePostData(clubKey, postKey);
    if (post != null) {
        post = await getPostFoundations(clubKey, postKey, post, club);
    }
    return post;
}

//處理貼文基本屬性(學校與社團名稱、key值、nickName、職位、views、favorites)
export const getPostFoundations = async (clubKey, postKey, post, club) => {
    //該貼文社團與學校名稱
    post.clubName = club.clubName;
    post.schoolName = club.schoolName;
    //處理poster職位名稱
    post.posterStatus = club.member[post.poster].status;
    post.posterStatusChinese = changeMemberStatusToChinese(post.posterStatus);
    //將clubKey放進attribute，否則找不到該貼文社團
    post.clubKey = clubKey;
    post.postKey = postKey;
    //處理NickName
    post.posterNickName = await getNickName(post.poster);
    //處理view和favorite
    const user = firebase.auth().currentUser;
    post = getViewFavoriteData(post, user.uid);
    return post;
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

//********************************************************************************
//按讚與觀看
//********************************************************************************

//產生statusView和statusFavorite
export const getViewFavoriteData = (post, userUid) => {
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

//按讚
export const setPostFavorite = (clubKey, postKey, dealInsidePostStatus) => async (dispatch) => {
    try {
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

        const commentPost = {}
        if (dealInsidePostStatus) {
            commentPost = await getPostComment(clubKey, postKey);
        }

        //更改firebasePostFavorites
        await updatePostFavorites(post.clubKey, post.postKey, updateFavorites);
        //同步更改reducer資料
        await dispatch(setPostChangeToReducer(post, commentPost));
    }
    catch (error) {
        dispatch(PostAction.setPostFavoriteFailure(error));
        console.log(error.toString());
    }
}

//觀看
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
            commentData[element].commenterNickName = await getNickName(commentData[element].commenter);
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
    return commentPost;
}

//新增留言
export const creatingComment = (clubKey, postKey, content) => async (dispatch) => {

    try {
        //新增貼文進firebase
        await createComment(clubKey, postKey, content);

        //貼文資料全部重抓更新
        const club = await getClubData(clubKey);
        let post = await getInsidePostData(clubKey, postKey);
        post = await getPostFoundations(clubKey, postKey, post, club);
        const commentPost = await getPostComment(clubKey, postKey);
        if (Object.values(commentPost)[0] == false) {
            commentPost[Object.keys(commentPost)[0]] = {};
        }
        //同步更改reducer資料
        await dispatch(setPostChangeToReducer(post, commentPost));
    }
    catch (error) {
        console.log(error);
    }
}

//刪除留言
export const deletingComment = (clubKey, postKey, commentKey) => async (dispatch) => {
    try {
        //從firebase刪除留言
        await deleteComment(clubKey, postKey, commentKey);

        const user = firebase.auth().currentUser
        const postRef = firebase.database().ref('posts').child(cid).push()

        const postDB = {
            title: postData.title,
            content: postData.content,
            images: postData.images.length == 0 ? postData.images : false,
            poster: user.uid,
            date: new Date().toLocaleString(),
            favorites: false,
            views: false,
        }
        //貼文資料全部重抓更新
        const club = await getClubData(clubKey);
        let post = await getInsidePostData(clubKey, postKey);
        post = await getPostFoundations(clubKey, postKey, post, club);
        const commentPost = await getPostComment(clubKey, postKey);
        if (Object.values(commentPost)[0] == false) {
            commentPost[Object.keys(commentPost)[0]] = {};
        }
        //同步更改reducer資料
        await dispatch(setPostChangeToReducer(post, commentPost));
    }
    catch (error) {
        console.log(error);
    }
}

//編輯留言
export const editingComment = (clubKey, postKey, commentKey, content) => async (dispatch) => {
    try {
        //從firebase編輯留言
        await editComment(clubKey, postKey, commentKey, content);

        //貼文資料全部更新
        const club = await getClubData(clubKey);
        let post = await getInsidePostData(clubKey, postKey);
        post = await getPostFoundations(clubKey, postKey, post, club);
        const commentPost = await getPostComment(clubKey, postKey);
        if (Object.values(commentPost)[0] == false) {
            commentPost[Object.keys(commentPost)[0]] = {};
        }
        //同步更改reducer資料
        await dispatch(setPostChangeToReducer(post, commentPost));
    }
    catch (error) {
        console.log(error);
    }
}

//********************************************************************************
//多Reducer function
//********************************************************************************

//********************************************************************************
//同步處理
//********************************************************************************

//同步更改reducer資料
export const setPostChangeToReducer = (post, comment) => async (dispatch, getState) => {
    try {
        //************************************************************************
        //postList 與 post 同步
        //************************************************************************
        const homePostList = { ...getState().homeReducer.postList };
        const homePost = { ...getState().homeReducer.post };
        if (homePostList.hasOwnProperty(post.postKey)) {
            homePostList[post.postKey] = post;
        }
        if (homePost.hasOwnProperty(post.postKey)) {
            homePost[post.postKey] = post;
        }
        //dispatch進Reducer.postList
        dispatch(PostAction.setPostToReducerPostListSuccess(homePostList));
        //dispatch進Reducer.post
        dispatch(PostAction.setPostToReducerPostSuccess(homePost));

        //************************************************************************
        //comment 同步
        //************************************************************************
        const homeComment = { ...getState().homeReducer.comment };
        if (homeComment.hasOwnProperty(post.postKey)) {
            homeComment = comment;
        }
        //dispatch進Reducer.comment
        dispatch(PostAction.setCommentToReducerCommentSuccess(homeComment));
    }
    catch (error) {
        throw error;
    }
}

//********************************************************************************
//Comment component顯示關係處理
//********************************************************************************
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
