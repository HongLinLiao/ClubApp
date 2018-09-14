import * as firebase from "firebase"
import { getUserData, getPostData, getClubData, getInsidePostData, updatePostViews, updatePostFavorites } from "./Data"
import { changeMemberStatusToChinese } from './Club';
import * as PostAction from '../actions/PostAction'
import * as HomeAction from '../actions/HomeAction'

//取得貼文內頁資料
export const getInsidePost = (clubKey, postKey, router) => async (dispatch) => {
    try {
        const post = await getInsidePostComplete(clubKey, postKey);
        const newPost = {};
        newPost[post.postKey] = post;
        const viewPost = await setPostView(newPost);
        switch (router) {
            case 'Home':
                dispatch(HomeAction.getHomeInsidePostSuccess(viewPost));
                break;
            //club
            default:
                console.log(router);
        }
        dispatch(setPostChangeToPostList(viewPost[postKey]));
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

//取得完整的貼文資訊
export const getPostListComplete = async(clubKey) => {
    var postList = {};
    var i;
    //取得該社團資訊
    const club = await getClubData(clubKey);
    const post = await getPostData(clubKey);
    const user = firebase.auth().currentUser;
    if (post != null) {
        const key = Object.keys(post);
        for (i = 0; i < key.length > 0; i++) {
            //該貼文社團與學校名稱
            post[key[i]].schoolName = club.schoolName;
            post[key[i]].clubName = club.clubName;

            //將clubKey放進attribute，否則找不到該貼文社團
            post[key[i]].clubKey = clubKey;
            post[key[i]].postKey = key[i];

            //處理posterNickName
            post[key[i]] = await setPosterNickName(post[key[i]]);

            //處理poster職位名稱
            post[key[i]].posterStatus = club.member[post[key[i]].poster].status;
            post[key[i]].posterStatusChinese = changeMemberStatusToChinese(post[key[i]].posterStatus);

            //處理view和favorite
            post[key[i]] = getViewFavoriteData(post[key[i]], user.uid);

            postList = { ...postList, ...post };
        }
    }
    return postList;
}

//取得完整的貼文資訊
export const getInsidePostComplete = async (clubKey, postKey) => {
    const user = firebase.auth().currentUser;
    const club = await getClubData(clubKey);
    var post = await getInsidePostData(clubKey, postKey);

    if (post != null) {
        //該貼文社團與學校名稱
        post.schoolName = club.schoolName;
        post.clubName = club.clubName;

        //將clubKey放進attribute，否則找不到該貼文社團
        post.clubKey = clubKey;
        post.postKey = postKey;

        //處理posterNickName
        post = await setPosterNickName(post);

        //處理poster職位名稱
        post.posterStatus = club.member[post.poster].status;
        post.posterStatusChinese = changeMemberStatusToChinese(post.posterStatus);

        //處理view和favorite
        post = getViewFavoriteData(post, user.uid);
    }
    return post;
}

//找到該poster的nickName
export const setPosterNickName = async (post) => {
    const user = await getUserData(post.poster);
    post.posterNickName = user.nickName;
    return post;
};

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
export const setPostFavorite = (post) => async (dispatch) => {
    try {
        const user = firebase.auth().currentUser;
        const promisesFavorites = Object.keys(post).map(async (element) => {
            //按讚
            if (post[element].statusFavorite == false) {
                post[element].statusFavorite = !post[element].statusFavorite;
                //牽扯到物件形狀
                //沒其他使用者按過讚
                if (post[element].numFavorites == 0) {
                    post[element].numFavorites = post[element].numFavorites + 1;
                    post[element].favorites = {};
                    post[element].favorites[user.uid] = true;
                }
                //有其他使用者按過讚
                else {
                    post[element].numFavorites = post[element].numFavorites + 1;
                    post[element].favorites[user.uid] = true;
                }
            }
            //取消讚
            else {
                post[element].statusFavorite = !post[element].statusFavorite;
                //牽扯到物件形狀
                //沒其他使用者按過讚
                if (post[element].numFavorites == 1) {
                    post[element].numFavorites = post[element].numFavorites - 1;
                    post[element].favorites = false;
                }
                //有其他使用者按過讚
                //設為null寫進firebase會自動消失
                else {
                    post[element].numFavorites = post[element].numFavorites - 1;
                    post[element].favorites[user.uid] = null;
                }
            }
            //更改firebasePostFavorites
            await updatePostFavorites(post[element].clubKey, post[element].postKey, post[element].favorites);
            //連動更改所有已讀取該篇文章的reducer
            await dispatch(setPostChangeToPostList(post[element]));
        });
        await Promise.all(promisesFavorites);
        dispatch(PostAction.setPostFavoriteSuccess(post));
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
                //沒有其他使用者看過
                if (post[element].numViews == 0) {
                    post[element].numViews = post[element].numViews + 1;
                    post[element].views = {};
                    post[element].views[user.uid] = true;
                    post[element].statusView = true;
                }
                //有其他使用者看過
                else {
                    post[element].numViews = post[element].numViews + 1;
                    post[element].views[user.uid] = true;
                    post[element].statusView = true;
                }
                await updatePostViews(post[element].clubKey, post[element].postKey, post[element].views);
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

//同步更改reducer資料
export const setPostChangeToPostList = (post) => async (dispatch, getState) => {
    try {
        //讀取不同reducer裡的postList
        const homePostList = { ...getState().homeReducer.postList };
        if (homePostList.hasOwnProperty(post.postKey)) {
            homePostList[post.postKey] = post;
        }
        //club
        dispatch(PostAction.setPostChangeToReducerSuccess(homePostList));
    }
    catch (error) {
        dispatch(PostAction.setPostChangeToReducerFailure(error));
        console.log(error.toString());
    }
}

export const createPost = (cid) => async (dispatch) => {

    try {
        dispatch(PostAction.createPostRequest())


    } catch (e) {

    }
}