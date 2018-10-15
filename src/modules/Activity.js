import * as firebase from "firebase"
import * as ActivityAction from '../actions/ActivityAction'
import {
    getActivityData,
    getInsideActivityData,
    getUserData,
    updateActivityFavorites,
    getUserActivityKeeps,
    getClubData,
    updateActivityViews,
    updateActivityKeeps,
} from './Data'
import { changeMemberStatusToChinese } from './Common';

//********************************************************************************
// Get Data
//********************************************************************************

//取得user收藏的活動
export const getUserActivities = async () => {
    const uid = firebase.auth().currentUser.uid;
    const keepList = await getUserActivityKeeps(uid);
    if (keepList != null) {
        return keepList;
    }
    else {
        return null;
    }
}

//用activityKeyArray進firebase抓新資料
export const getActivityDataComplete = (activityKeeps) => async (dispatch, getState) => {
    try {
        let activityData;
        const activityReducer = getState().activityReducer.allActivity;
        // 新物件: activityReducer
        const newActivityReducer = JSON.parse(JSON.stringify(activityReducer));

        // 回傳物件
        const objPost = {};
        var i, j;
        const clubList = Object.keys(activityKeeps);
        for (i = 0; i < clubList.length; i++) {
            const clubKey = clubList[i];

            const club = await getClubData(clubKey);
            // console.log('open:' + club.open);
            if (!club.open) {
                const { uid } = firebase.auth().currentUser;
                if (!club.member[uid]) {
                    // console.log('不是成員');
                    return null;
                }
                // console.log('是成員');
            }
            const activityList = Object.keys(activityKeeps[clubKey]);
            for (j = 0; j < activityList.length; j++) {
                const activityKey = activityList[j];
                activityData = await getInsideActivityData(clubKey, activityKey);
                if (activityData != null) {
                    //活動基本屬性
                    activityData = await setActivityFoundations(clubKey, activityKey, activityData, club, activityKeeps);
                    newActivityReducer = handleActivityDataToReducer(newActivityReducer, clubKey, activityKey, activityData);
                    if (activityData.open) {
                        objPost = handleActivityDataToObject(objPost, clubKey, activityKey, activityData);
                    }
                }
            }
        }
        dispatch(ActivityAction.getActivityData(newActivityReducer));
        return objPost;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//用clubKey取得社團下所有活動
export const getActivityDataFromClubKey = (clubKey) => async (dispatch, getState) => {
    try {
        const club = await getClubData(clubKey);
        const user = firebase.auth().currentUser;
        console.log('open:' + club.open);
        if (!club.open) {
            if (!club.member[user.uid]) {
                alert('Activity is not exist!');
                console.log('不是成員');
                return null;
            }
            console.log('是成員');
        }
        let objPost={};
        let activityKey;
        const activityData = await getActivityData(clubKey);
        if(activityData){
            activityKey = Object.keys(activityData);
        }
        else{
            return {};
        }
        

        const activityReducer = getState().activityReducer.allActivity;
        // 新物件: activityReducer
        const newActivityReducer = JSON.parse(JSON.stringify(activityReducer));

        if (activityKey.length > 0) {
            let i;
            const keepList = await getUserActivities();
            for (i = 0; i < activityKey.length; i++) {
                activityData[activityKey[i]] = await setActivityFoundations(clubKey, activityKey[i], activityData[activityKey[i]], club, keepList);
                newActivityReducer = handleActivityDataToReducer(newActivityReducer, clubKey, activityKey[i], activityData[activityKey[i]]);
                if (activityData[activityKey[i]].open) {
                    objPost = handleActivityDataToObject(objPost, clubKey, activityKey[i], activityData[activityKey[i]]);
                }
            }
            dispatch(ActivityAction.getActivityData(newActivityReducer));
        }
        return objPost;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//進入內頁
export const getInsideActivity = (clubKey, activityKey) => async (dispatch, getState) => {
    try {
        const club = await getClubData(clubKey);
        const user = firebase.auth().currentUser;
        console.log('open:' + club.open);
        if (!club.open) {
            if (!club.member[user.uid]) {
                alert('Activity is not exist!');
                console.log('不是成員');
                return null;
            }
            console.log('是成員');
        }
        const activityData = await getInsideActivityData(clubKey, activityKey);
        if (activityData == null || !activityData.open) {
            alert('Activity is not exist!');
            console.log('Activity is not exist!');
            return null;
        }
        else {
            let keepList = await getUserActivities();
            if (keepList == null) {
                keepList = {};
            }
            activityData = await setActivityFoundations(clubKey, activityKey, activityData, club, keepList);
            activityData = await setActivityView(activityData);

            //寫進activityReducer
            const preActivityReducer = getState().activityReducer.allActivity;
            const newPreActivityReducer = JSON.parse(JSON.stringify(preActivityReducer));
            const nextActivityReducer = handleActivityDataToReducer(newPreActivityReducer, clubKey, activityKey, activityData);
            dispatch(ActivityAction.getActivityData(nextActivityReducer));
            return activityData;
        }
    }
    catch (error) {
        console.log(error.toString);
    }
}

//********************************************************************************
// 活動
//********************************************************************************

//建立一個新活動
export const createActivity = (cid, activityData) => async (dispatch) => {
    try {
        dispatch(ActivityAction.createAcitvityRequest())

        const user = firebase.auth().currentUser
        const activityRef = firebase.database().ref('activities').child(cid).push()
        const activityStorageRef = firebase.storage().ref('activities').child(cid).child(activityRef.key).child('photo')

        //更新firestore
        const response = await fetch(activityData.photo);
        const blob = await response.blob(); //轉換照片格式為blob
        const snapshot = await activityStorageRef.put(blob)
        const photoUrl = await snapshot.ref.getDownloadURL()

        const activityDB = {
            title: activityData.title,
            place: activityData.place,
            price: parseInt(activityData.price),
            content: activityData.content,
            remarks: activityData.remarks,
            photo: photoUrl,
            poster: user.uid,
            open: activityData.open,
            startDateTime: new Date(activityData.startDateTime).toLocaleString(),
            endDateTime: new Date(activityData.endDateTime).toLocaleString(),
            editDate: new Date().toLocaleString(),
            views: false,
            favorites: false,
        }

        await activityRef.set(activityDB)

    } catch (e) {

        console.log(e)

        throw e

    }
}

//刪除活動


//********************************************************************************
// handle
//********************************************************************************

//產生新的object混合新活動
export const handleActivityDataToReducer = (activityReducer, clubKey, activityKey, activityData) => {
    try {
        //新物件: activityReducer資料
        const newPreActivityReducer = JSON.parse(JSON.stringify(activityReducer));
        const newActivityData = {}
        newActivityData[activityKey] = activityData;
        const nextActivityData = {};
        nextActivityData = { ...newPreActivityReducer[clubKey], ...newActivityData };
        newPreActivityReducer[clubKey] = nextActivityData;
        return newPreActivityReducer;
    }
    catch (error) {
        throw error;
    }
}

//傳入參數貼文列物件，將貼文加入貼文列物件
export const handleActivityDataToObject = (objPost, clubKey, activityKey, activityData) => {
    try {
        //新物件
        const newObjPost = JSON.parse(JSON.stringify(objPost));
        const newActivityData = {}
        newActivityData[activityKey] = activityData;
        let nextActivityData = {};
        nextActivityData = { ...objPost[clubKey], ...newActivityData };
        newObjPost[clubKey] = nextActivityData;
        return newObjPost;
    }
    catch (error) {
        throw error;
    }
}

//********************************************************************************
//處理活動屬性
//********************************************************************************

//處理活動基本屬性(學校與社團名稱、key值、nickName、職位、views、favorites)
export const setActivityFoundations = async (clubKey, activityKey, activity, club, userKeeps) => {
    try {
        //處理活動是否有收藏
        if (userKeeps[clubKey]) {
            if (userKeeps[clubKey][activityKey]) {
                activity.statusKeep = true;
            }
            else {
                activity.statusKeep = false;
            }
        }
        else {
            activity.statusKeep = false;
        }

        //該貼文社團與學校名稱
        activity.clubName = club.clubName;
        activity.schoolName = club.schoolName;
        //處理poster職位名稱
        if (club.member[activity.poster]) {
            activity.posterStatus = club.member[activity.poster].status;
            activity.posterStatusChinese = changeMemberStatusToChinese(activity.posterStatus);
        }
        else {
            activity.posterStatusChinese = '';
            activity.posterStatus = '';
        }

        //將activityKey放進attribute，否則找不到該貼文社團
        activity.clubKey = clubKey;
        activity.activityKey = activityKey;
        //處理User
        userData = await getUserData(activity.poster);
        activity.posterNickName = userData.nickName;
        activity.posterPhotoUrl = userData.photoUrl;
        //處理view和favorite
        const user = firebase.auth().currentUser;
        activity = setViewFavoriteData(activity, user.uid);
        return activity;
    }
    catch (error) {
        throw error;
    }
}

//產生statusView和statusFavorite
export const setViewFavoriteData = (activity, userUid) => {
    try {
        //views與favorite數量
        activity.numViews = Object.keys(activity.views).length;
        activity.numFavorites = Object.keys(activity.favorites).length;
        //該使用者是否有按讚與觀看
        if (activity.views[userUid] == true)
            activity.statusView = true;
        else
            activity.statusView = false;
        if (activity.favorites[userUid] == true)
            activity.statusFavorite = true;
        else
            activity.statusFavorite = false;
        return activity;
    }
    catch (error) {
        throw error;
    }
}

//********************************************************************************
//按讚、收藏、觀看
//********************************************************************************

//按讚
export const setActivityFavorite = (clubKey, activityKey) => async (dispatch, getState) => {
    try {
        const club = await getClubData(clubKey);
        const user = firebase.auth().currentUser;
        console.log('open:' + club.open);
        if (!club.open) {
            if (!club.member[user.uid]) {
                alert('Activity is not exist!');
                console.log('不是成員');
                return null;
            }
            console.log('是成員');
        }
        const activity = await getInsideActivityData(clubKey, activityKey);
        if (activity == null || activity.open == false) {
            console.log('活動不存在');
            alert('Activity is not exist!');
            return null;
        }
        else {
            const keepList = await getUserActivities();
            if (keepList == null) {
                keepList = {};
            }
            //先取得貼文基本屬性
            activity = await setActivityFoundations(clubKey, activityKey, activity, club, keepList);
            let updateFavorites = {};
            //按讚處理
            //按讚
            if (activity.statusFavorite == false) {
                activity.statusFavorite = !activity.statusFavorite;
                //牽扯到物件形狀
                //沒其他使用者按過讚
                if (activity.numFavorites == 0) {
                    activity.numFavorites = activity.numFavorites + 1;
                    activity.favorites = {};
                    activity.favorites[user.uid] = true;
                    updateFavorites[user.uid] = true;
                }
                //有其他使用者按過讚
                else {
                    activity.numFavorites = activity.numFavorites + 1;
                    activity.favorites[user.uid] = true;
                    updateFavorites[user.uid] = true;
                }
            }
            //取消讚
            else {
                activity.statusFavorite = !activity.statusFavorite;
                //牽扯到物件形狀
                //沒其他使用者按過讚
                if (activity.numFavorites == 1) {
                    activity.numFavorites = activity.numFavorites - 1;
                    delete activity.favorites[user.uid];
                    updateFavorites[user.uid] = false;
                }
                //有其他使用者按過讚
                //設為null寫進firebase會自動消失
                else {
                    activity.numFavorites = activity.numFavorites - 1;
                    delete activity.favorites[user.uid];
                    updateFavorites[user.uid] = null;
                }
            }
            //更改firebasePostFavorites
            await updateActivityFavorites(activity.clubKey, activity.activityKey, updateFavorites);

            //寫進activityReducer
            const preActivityReducer = getState().activityReducer.allActivity;
            const newPreActivityReducer = JSON.parse(JSON.stringify(preActivityReducer));
            const nextActivityReducer = handleActivityDataToReducer(newPreActivityReducer, clubKey, activityKey, activity);
            dispatch(ActivityAction.getActivityData(nextActivityReducer));
            return activity;
        }

    }
    catch (error) {
        console.log(error.toString());
    }
}

//收藏
export const setActivityKeep = (clubKey, activityKey) => async (dispatch, getState) => {
    try {
        const club = await getClubData(clubKey);
        const user = firebase.auth().currentUser;
        console.log('open:' + club.open);
        if (!club.open) {
            if (!club.member[user.uid]) {
                alert('Activity is not exist!');
                console.log('不是成員');
                return null;
            }
            console.log('是成員');
        }
        const activity = await getInsideActivityData(clubKey, activityKey);
        if (activity == null || activity.open == false) {
            console.log('活動不存在');
            alert('Activity is not exist!');
            return null;
        }
        else {
            const keepList = await getUserActivities();
            if (keepList == null) {
                keepList = {};
            }
            const newKeepList = JSON.parse(JSON.stringify(keepList));

            if (newKeepList[clubKey]) {
                if (newKeepList[clubKey][activityKey]) {
                    console.log('取消收藏');
                    newKeepList[clubKey][activityKey] = null;
                    delete newKeepList[clubKey][activityKey];
                    //寫進firebase為null消失
                    statusKeep = null;
                }
                else {
                    console.log('收藏');
                    newKeepList[clubKey] = {};
                    newKeepList[clubKey][activityKey] = true;
                    statusKeep = true;
                }
            }
            else {
                console.log('收藏');
                newKeepList[clubKey] = {};
                newKeepList[clubKey][activityKey] = true;
                statusKeep = true;
            }

            //改firebase
            await updateActivityKeeps(user.uid, clubKey, activityKey, statusKeep);

            //先取得活動基本屬性
            activity = await setActivityFoundations(clubKey, activityKey, activity, club, newKeepList);

            //寫進activityReducer
            const preActivityReducer = getState().activityReducer.allActivity;
            const newPreActivityReducer = JSON.parse(JSON.stringify(preActivityReducer));
            const nextActivityReducer = handleActivityDataToReducer(newPreActivityReducer, clubKey, activityKey, activity);
            dispatch(ActivityAction.getActivityData(nextActivityReducer));
            return activity;
        }

    }
    catch (error) {
        console.log(error.toString());
    }
}

//觀看
export const setActivityView = async (activity) => {
    try {
        const user = firebase.auth().currentUser;
        //檢查使用者是否是第一次查看
        //不是第一次看
        if (activity.views[user.uid] == true) {
            console.log('已看過');
        }
        //是第一次看
        else {
            let updateViews = {};
            //沒有其他使用者看過
            if (Object.keys(activity.views).length == 0) {
                activity.numViews = activity.numViews + 1;
                activity.views = {};
                activity.views[user.uid] = true;
                activity.statusView = true;
                updateViews[user.uid] = true;
            }
            //有其他使用者看過
            else {
                activity.numViews = activity.numViews + 1;
                activity.views[user.uid] = true;
                activity.statusView = true;
                updateViews[user.uid] = true;
            }
            //寫進資料庫
            await updateActivityViews(activity.clubKey, activity.activityKey, updateViews);
            console.log('已設定觀看');
        }
        return activity;
    }
    catch (error) {
        throw error;
    }
}