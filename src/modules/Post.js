import * as firebase from "firebase"
import { getUserData, getPostData, getClubData, getInsidePostData } from "./Data"
import { changeMemberStatusToChinese } from './Club';
import * as PostAction from '../actions/PostAction'
import * as HomeAction from '../actions/HomeAction'

//取得貼文內頁資料
export const getInsidePost = (clubKey, postKey, router) => async (dispatch) => {
    switch (router) {
        case 'Home':
            try {
                const post = await dispatch(getInsidePostComplete(clubKey, postKey));
                const newPost = {};
                newPost[postKey] = { ...post };
                dispatch(HomeAction.getHomeInsidePostSuccess(newPost));
            }
            catch (error) {
                dispatch(HomeAction.getHomeInsidePostFailure(error.toString()));
                console.log(error.toString());
            }
            break;
        default:
            console.log(router);
    }
}

//取得完整的貼文資訊
export const getPostListComplete = (clubKey) => async (dispatch, getState) => {
    var postList = {};
    var i;
    //取得該社團資訊
    const club = await getClubData(clubKey);
    const post = await getPostData(clubKey);
    const userUid = getState().userReducer.user.uid;
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
            post[key[i]] = await dispatch(getViewFavoriteData(post[key[i]], userUid));

            postList = { ...postList, ...post };
        }
    }
    return postList;
}

//取得完整的貼文資訊
export const getInsidePostComplete = (clubKey, postKey) => async (dispatch, getState) => {
    const club = await getClubData(clubKey);
    var post = await getInsidePostData(clubKey, postKey);
    const userUid = getState().userReducer.user.uid;
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
        post = await dispatch(getViewFavoriteData(post, userUid));
    }
    return post;
}

//找到該poster的nickName
export const setPosterNickName = async (post) => {
    const user = await getUserData(post.poster);
    post.posterNickName = user.nickName;
    return post;
};

//處理Views和Favorites
export const getViewFavoriteData = (post, userUid) => async (dispatch) => {
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
export const setPostFavorite = (post) => async (dispatch, getState) => {
    try {
        Object.keys(post).map((element) => {
            //按讚
            if (post[element].statusFavorite == false) {
                post[element].statusFavorite = !post[element].statusFavorite;
                //牽扯到物件形狀
                //沒其他使用者按過讚
                if (post[element].numFavorites == 0) {
                    post[element].numFavorites = post[element].numFavorites + 1;
                    post[element].favorites = {};
                    post[element].favorites[post[element].posterUid] = true;
                }
                //有其他使用者按過讚
                else {
                    post[element].numFavorites = post[element].numFavorites + 1;
                    post[element].favorites[post[element].posterUid] = true;
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
                    post[element].favorites[post[element].posterUid] = null;
                }
            }
        });
        dispatch(PostAction.setPostFavoriteSuccess(post));
    }
    catch (error) {
        dispatch(PostAction.setPostFavoriteFailure(error));
        console.log(error.toString());
    }
}

//觀看
export const setPostView = (post) => (dispatch, getState) => {
    try {
        Object.keys(post).map((element) => {
            //沒有其他使用者看過
            if (post[element].numViews == 0) {
                post[element].numViews = post[element].numViews + 1;
                post[element].views = {};
                post[element].views[post[element].posterUid] = true;
            }
            //有其他使用者看過
            else {
                post[element].numViews = post[element].numViews + 1;
                post[element].views[post[element].posterUid] = true;
            }
        })
        const homePostList = getState().homeReducer.postList;
        homePostList = { ...homePostList, ...post }
        dispatch(PostAction.setPostViewSuccess(homePostList));
    }
    catch (error) {
        dispatch(PostAction.setPostViewFailure(error));
        console.log(error.toString());
    }
}

export const createPost = (cid) => async (dispatch) => {

    try {
        dispatch(PostAction.createPostRequest())


    } catch (e) {

    }
}