import * as firebase from "firebase"
import { sendPostNotification } from './Api'
import * as PostAction from '../actions/PostAction'
import { postReducer } from "../reducers/PostReducer";
require("firebase/functions");

//********************************************************************************
// 貼文同步
//********************************************************************************

//init:放貼文列進postReducer
export const initPostListToReducer = (postList, navigation) => async (dispatch, getState) => {
    try {
        let newPostList = postList.slice();
        let newReducer = getState().postReducer.postList;
        const routeName = navigation.state.routeName;
        newReducer[routeName] = newPostList
        dispatch(PostAction.getPostList(newReducer));
    }
    catch (error) {
        throw error;
    }
}

//init:放貼文進postReducer
export const initPostToReducer = (obj, navigation) => async (dispatch, getState) => {
    try {
        let newObj = JSON.parse(JSON.stringify(obj));
        let newReducer = getState().postReducer.post;
        const routeName = navigation.state.routeName;
        let newPost = {};
        newPost[obj.post.postKey] = newObj
        newReducer[routeName] = newPost;
        dispatch(PostAction.getPost(newReducer));
    }
    catch (error) {
        throw error;
    }
}

//init:放setPost進postReducer
export const initSetPost = (setPost, navigation) => async (dispatch, getState) => {
    try {
        let setPostInReducer = getState().postReducer.setPost;
        let newObjct = JSON.parse(JSON.stringify(setPostInReducer));
        const routeName = navigation.state.routeName;
        newObjct[routeName] = setPost;
        dispatch(PostAction.getSetPost(newObjct));
    }
    catch (error) {
        console.log(error.toString());
    }
}

//init:放setPostList進postReducer
export const initSetPostList = (setPostList, navigation) => async (dispatch, getState) => {
    try {
        let setPostListInReducer = getState().postReducer.setPostList;
        let newObjct = JSON.parse(JSON.stringify(setPostListInReducer));
        const routeName = navigation.state.routeName;
        newObjct[routeName] = setPostList;
        dispatch(PostAction.getSetPostList(newObjct));
    }
    catch (error) {
        console.log(error.toString());
    }
}

//synchronize:貼文同步更改
export const syncPost = (data) => async (dispatch, getState) => {
    try {
        //如果是陣列，表示更動的來源是重整
        if (Array.isArray(data)) {
            //call reducer
            const postListInReducer = getState().postReducer.postList;
            let ordPostList = JSON.parse(JSON.stringify(postListInReducer));
            const postInReducer = getState().postReducer.post;
            let ordPost = JSON.parse(JSON.stringify(postInReducer));

            data.map((child) => {
                let postKey = Object.keys(child)[0];
                //需要查詢的route
                let item = Object.keys(ordPostList);
                //跑查詢的route裡是否具有要更動的post
                for (let i = 0; i < item.length; i++) {
                    let status = false;
                    let result = ordPostList[item[i]].some(function (value, index, array) {
                        if (Object.keys(value)[0] == postKey) {
                            ordPostList[item[i]][index][postKey] = child[postKey];
                            status = true
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    if(status){
                        let setFuction = getState().postReducer.setPostList[item[i]];
                        setFuction(ordPostList[item[i]]);
                        console.log(item[i]+'已同步');
                    }
                };
            });
        }
        //其餘來源是物件，表示更動來源是貼文動作
        else  {
            
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//********************************************************************************
// 貼文
//********************************************************************************

//新增貼文
export const createPost = (cid, postData, club) => async (dispatch) => {
    try {
        dispatch(PostAction.createPostRequest())

        const user = firebase.auth().currentUser
        const postRef = firebase.database().ref('posts').child(cid).push()

        const post = {
            title: postData.title,
            content: postData.content,
            images: postData.images,
            poster: user.uid,
            date: new Date().toLocaleString(),
            favorites: false,
            views: false,
            numComments: 0
        }

        await postRef.set(post)

        await sendPostNotification(cid, post, club)

    } catch (e) {

        console.log(e)

        throw e
    }
}

//刪除貼文
export const deletingPost = (clubKey, postKey, postList) => async (dispatch) => {
    try {
        const deletePost = firebase.functions().httpsCallable('deletePost');
        const response = await deletePost({ clubKey: clubKey, postKey: postKey, postList: postList });
        return response.data;
    } catch (error) {
        console.log(error.toString())
    }
}

//按貼文讚，commentStatus如果為true則抓留言，反之
export const setPostFavorite = (clubKey, postKey, commentStatus) => async (dispatch) => {
    try {
        const setPostFavorite = firebase.functions().httpsCallable('setPostFavorite');
        const response = await setPostFavorite({ clubKey: clubKey, postKey: postKey, commentStatus: commentStatus });
        return response.data;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//進入內頁
export const getInsidePost = (clubKey, postKey) => async (dispatch) => {
    try {
        const getPostInside = firebase.functions().httpsCallable('getPostInside');
        const response = await getPostInside({ clubKey: clubKey, postKey: postKey });
        return response.data;
    }
    catch (error) {
        console.log(error.toString);
    }
}

//********************************************************************************
// 留言
//********************************************************************************

//新增留言
export const creatingComment = (clubKey, postKey, content) => async (dispatch) => {
    try {
        const createComment = firebase.functions().httpsCallable('createComment');
        const response = await createComment({ clubKey: clubKey, postKey: postKey, content: content });
        return response.data;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//編輯留言
export const editingComment = (clubKey, postKey, commentKey, content) => async (dispatch) => {
    try {
        const editComment = firebase.functions().httpsCallable('editComment');
        const response = await editComment({ clubKey: clubKey, postKey: postKey, commentKey: commentKey, content: content });
        return response.data;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//刪除留言
export const deletingComment = (clubKey, postKey, commentKey) => async (dispatch) => {
    try {
        const deleteComment = firebase.functions().httpsCallable('deleteComment');
        const response = await deleteComment({ clubKey: clubKey, postKey: postKey, commentKey: commentKey });
        return response.data;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//按留言讚
export const setCommentFavorite = (clubKey, postKey, commentKey) => async (dispatch) => {
    try {
        const setCommentFavorite = firebase.functions().httpsCallable('setCommentFavorite');
        const response = await setCommentFavorite({ clubKey: clubKey, postKey: postKey, commentKey: commentKey });
        return response.data;
    }
    catch (error) {
        console.log(error.toString());
    }
}