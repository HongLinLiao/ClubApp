import * as firebase from "firebase"
import { sendPostNotification } from './Api'
import * as PostAction from '../actions/PostAction'
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
        newReducer[routeName] = newPostList;
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
        if (obj) {
            let newPost = {};
            newPost[obj.post.postKey] = newObj
            newReducer[routeName] = newPost;
        }
        else {
            newReducer[routeName] = null;
            delete newReducer[routeName];
        }
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
        let newObjct = Object.assign({}, setPostInReducer);
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
        let newObjct = Object.assign({}, setPostListInReducer);
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
        //call reducer
        const postListInReducer = getState().postReducer.postList;
        let ordPostList = JSON.parse(JSON.stringify(postListInReducer));
        const postInReducer = getState().postReducer.post;
        let ordPost = JSON.parse(JSON.stringify(postInReducer));
        let postListStatus = false;
        let postStatus = false;
        let status = false;
        //如果是陣列，表示更動的來源是重整
        if (Array.isArray(data)) {
            if (data.length == 0) {
                let itemPostList = Object.keys(ordPostList);
                //空的再設成空的，解決首頁篩遠後是空的清不完的問題
                for (let i = 0; i < itemPostList.length; i++) {
                    if (ordPostList[itemPostList[i]].length == 0) {
                        status = true;
                    }
                    //空的
                    if (status) {
                        let setPostListFuction = getState().postReducer.setPostList[itemPostList[i]];
                        setPostListFuction(ordPostList[itemPostList[i]]);
                    }
                };
            }
            else {
                data.map((child) => {
                    let postKey = Object.keys(child)[0];

                    //更新貼文列
                    //需要查詢的route
                    let itemPostList = Object.keys(ordPostList);
                    //跑查詢的route裡是否具有要更動的貼文
                    for (let i = 0; i < itemPostList.length; i++) {
                        let result = ordPostList[itemPostList[i]].some(function (value, index, array) {
                            if (Object.keys(value)[0] == postKey) {
                                //更改貼文列
                                ordPostList[itemPostList[i]][index][postKey] = child[postKey];
                                //代表有改變要寫進route 頁面
                                status = true;
                                postListStatus = true;
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                        //空的
                        if (status) {
                            let setPostListFuction = getState().postReducer.setPostList[itemPostList[i]];
                            setPostListFuction(ordPostList[itemPostList[i]]);
                            console.log(postKey + ': ' + itemPostList[i] + '已同步');
                        }
                    };

                    //更新貼文
                    //需要查詢的route
                    let itemPost = Object.keys(ordPost);
                    let keyList;
                    //跑查詢的route是某具有要更動的貼文
                    for (let j = 0; j < itemPost.length; j++) {
                        keyList = Object.keys(ordPost[itemPost[j]]);
                        for (let z = 0; z < keyList.length; z++) {
                            if (keyList[z] == postKey) {
                                //更改內容
                                ordPost[itemPost[j]][keyList[z]]['post'] = child[postKey];
                                //寫進頁面
                                let setPostFuction = getState().postReducer.setPost[itemPost[j]];
                                setPostFuction(ordPost[itemPost[j]][keyList[z]]);
                                postStatus = true;
                                console.log(postKey + ': ' + itemPost[j] + '已同步');
                                break;
                            }
                        }
                    }
                });
            }
        }
        //其餘來源是物件，表示更動來源是貼文動作
        else {
            if (Object.keys(data).length >= 1) {
                let postKey = data.post.postKey;

                //更新貼文列
                //需要查詢的route
                let itemPostList = Object.keys(ordPostList);
                //跑查詢的route裡是否具有要更動的貼文
                for (let i = 0; i < itemPostList.length; i++) {
                    let result = ordPostList[itemPostList[i]].some(function (value, index, array) {
                        if (Object.keys(value)[0] == postKey) {
                            //更改貼文列
                            ordPostList[itemPostList[i]][index][postKey] = data.post;
                            //代表有改變要寫進route頁面
                            status = true;
                            postListStatus = true;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    if (status) {
                        let setPostListFuction = getState().postReducer.setPostList[itemPostList[i]];
                        setPostListFuction(ordPostList[itemPostList[i]]);
                        console.log(postKey + ': ' + itemPostList[i] + '已同步');
                    }
                };
                //如果長度=1，代表是單篇貼文外部動作(不更新comment)，反之
                if (Object.keys(data).length > 1) {
                    //更新貼文
                    //需要查詢的route
                    let itemPost = Object.keys(ordPost);
                    let keyList;
                    //跑查詢的route是某具有要更動的貼文
                    for (let j = 0; j < itemPost.length; j++) {
                        keyList = Object.keys(ordPost[itemPost[j]]);
                        for (let z = 0; z < keyList.length; z++) {
                            if (keyList[z] == postKey) {
                                //更改內容
                                ordPost[itemPost[j]][keyList[z]]['post'] = data.post;
                                ordPost[itemPost[j]][keyList[z]]['comment'] = data.comment;
                                //寫進頁面
                                let setPostFuction = getState().postReducer.setPost[itemPost[j]];
                                setPostFuction(ordPost[itemPost[j]][keyList[z]]);
                                postStatus = true;
                                console.log(postKey + ': ' + itemPost[j] + '已同步');
                                break;
                            }
                        }
                    }
                }
                else {
                    //更新貼文
                    //需要查詢的route
                    let itemPost = Object.keys(ordPost);
                    let keyList;
                    //跑查詢的route是某具有要更動的貼文
                    for (let j = 0; j < itemPost.length; j++) {
                        keyList = Object.keys(ordPost[itemPost[j]]);
                        for (let z = 0; z < keyList.length; z++) {
                            if (keyList[z] == postKey) {
                                //更改內容
                                ordPost[itemPost[j]][keyList[z]]['post'] = data.post;
                                //寫進頁面
                                let setPostFuction = getState().postReducer.setPost[itemPost[j]];
                                setPostFuction(ordPost[itemPost[j]][keyList[z]]);
                                postStatus = true;
                                console.log(postKey + ': ' + itemPost[j] + '已同步');
                                break;
                            }
                        }
                    }
                }
            }
        }
        //寫回reducer
        if (postListStatus) {
            dispatch(PostAction.getPostList(ordPostList));
        }
        if (postStatus) {
            dispatch(PostAction.getPost(ordPost));
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//synchronize:貼文同步更改(刪除)
export const syncPostDelete = (postKey) => async (dispatch, getState) => {
    try {
        //call reducer
        const postListInReducer = getState().postReducer.postList;
        let ordPostList = JSON.parse(JSON.stringify(postListInReducer));
        const postInReducer = getState().postReducer.post;
        let ordPost = JSON.parse(JSON.stringify(postInReducer));
        let postListStatus = false;
        let postStatus = false;
        let status = false;

        //更新貼文列
        //需要查詢的route
        let itemPostList = Object.keys(ordPostList);
        //跑查詢的route裡是否具有要更動的貼文
        for (let i = 0; i < itemPostList.length; i++) {
            let result = ordPostList[itemPostList[i]].some(function (value, index, array) {
                if (Object.keys(value)[0] == postKey) {
                    //更改貼文列
                    ordPostList[itemPostList[i]].splice(index, 1);
                    //代表有改變要寫進route頁面
                    status = true;
                    postListStatus = true;
                    return true;
                }
                else {
                    return false;
                }
            });
            if (status) {
                let setPostListFuction = getState().postReducer.setPostList[itemPostList[i]];
                setPostListFuction(ordPostList[itemPostList[i]]);
                console.log(postKey + ': ' + itemPostList[i] + '已同步');
            }
        };
        //更新貼文
        //需要查詢的route
        let itemPost = Object.keys(ordPost);
        let keyList;
        //跑查詢的route是某具有要更動的貼文
        for (let j = 0; j < itemPost.length; j++) {
            keyList = Object.keys(ordPost[itemPost[j]]);
            for (let z = 0; z < keyList.length; z++) {
                if (keyList[z] == postKey) {
                    //更改內容
                    ordPost[itemPost[j]][keyList[z]] = null;
                    delete ordPost[itemPost[j]];
                    //寫進頁面
                    postStatus = true;
                    console.log(postKey + ': ' + itemPost[j] + '已同步');
                    break;
                }
            }
        }
        //寫回reducer
        if (postListStatus) {
            dispatch(PostAction.getPostList(ordPostList));
        }
        if (postStatus) {
            dispatch(PostAction.getPost(ordPost));
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//synchronize:貼文頁返回
export const syncPostBack = (routeName) => async (dispatch, getState) => {
    try {
        let setPostInReducer = getState().postReducer.setPost;
        let newObjct = Object.assign({}, setPostInReducer);
        if (newObjct[routeName]) {
            newObjct[routeName] = null;
            delete newObjct[routeName];
            dispatch(PostAction.getSetPost(newObjct));
        }

        let post = getState().postReducer.post;
        let newReducer = JSON.parse(JSON.stringify(post));
        if (newReducer[routeName]) {
            newReducer[routeName] = null;
            delete newReducer[routeName];
            dispatch(PostAction.getPost(newReducer));
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//custom function：搜尋社團返回搜尋頁 清除setState
export const syncSearchPostBack = (routeName) => async (dispatch, getState) => {
    try {
        let setPostListInReducer = getState().postReducer.setPostList;
        let newObjct = Object.assign({}, setPostListInReducer);
        if (newObjct[routeName]) {
            newObjct[routeName] = null;
            delete newObjct[routeName];
            dispatch(PostAction.getSetPostList(newObjct));
        }

        let postList = getState().postReducer.postList;
        let newReducer = JSON.parse(JSON.stringify(postList));
        if (newReducer[routeName]) {
            newReducer[routeName] = null;
            delete newReducer[routeName];
            dispatch(PostAction.getPostList(newReducer));
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//********************************************************************************
// 貼文
//********************************************************************************

//取得社團貼文
export const getClubPostReload = (clubKey, navigation) => async (dispatch) => {
    try {
        const getClubPost = firebase.functions().httpsCallable('getClubPost');
        const response = await getClubPost(clubKey);
        if (response.data.postListArr) {
            //丟進reducer
            dispatch(initPostListToReducer(response.data.postListArr, navigation));
            //檢查同步
            dispatch(syncPost(response.data.postListArr))
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//新增貼文
export const createPost = (cid, postData, club) => async (dispatch) => {
    try {
        dispatch(PostAction.createPostRequest())

        const user = firebase.auth().currentUser
        const postRef = firebase.database().ref('posts').child(cid).push()
        const postStorageRef = firebase.storage().ref('posts').child(cid).child(postRef.key)
        const imgUrlArray = postData.images ? [] : false

        if (postData.images) {
            const promises = Object.keys(postData.images).map(async (key) => {
                const uri = postData.images[key]
                const response = await fetch(uri);
                const blob = await response.blob(); //轉換照片格式為blob

                //更新firestore
                const imageRef = postStorageRef.child(key)
                const snapshot = await imageRef.put(blob)
                const imgUrl = await snapshot.ref.getDownloadURL()

                imgUrlArray.push(imgUrl)
            })

            await Promise.all(promises)
        }


        const post = {
            title: postData.title,
            content: postData.content,
            images: imgUrlArray,
            poster: user.uid,
            date: new Date().toUTCString(),
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

//編輯貼文
export const editingPost = (clubKey, postKey, editData) => async (dispatch) => {
    try {
        const editPost = firebase.functions().httpsCallable('editPost');

        if (editData.newImages != null) {
            if (!editData.images) {
                editData.images = [];
            }
            let promise = editData.newImages.map(async (value) => {
                let response = await fetch(value);
                let blob = await response.blob(); //轉換照片格式為blob
                let storageRef = firebase.storage().ref('posts').child(clubKey).child(postKey).child(blob._data.name);
                let snapshot = await storageRef.put(blob);
                let imgUrl = await snapshot.ref.getDownloadURL();
                editData.images.push(imgUrl);
            })
            await Promise.all(promise);
            editData.newImages = null;
            delete editData.newImages;
        }

        const response = await editPost({ clubKey: clubKey, postKey: postKey, editData: editData });
        return response.data;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//刪除貼文
export const deletingPost = (clubKey, postKey) => async (dispatch) => {
    try {
        const deletePost = firebase.functions().httpsCallable('deletePost');
        const response = await deletePost({ clubKey: clubKey, postKey: postKey });
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
        let response = await getPostInside({ clubKey: clubKey, postKey: postKey });
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