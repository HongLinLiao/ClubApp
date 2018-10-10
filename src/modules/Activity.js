import * as firebase from "firebase"
import * as ActivityAction from '../actions/ActivityAction'
import { getActivityData, getInsideActivityData, getUserData, updateActivityFavorites, getUserActivityKeeps, getClubData } from './Data'
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
            const activityList = Object.keys(activityKeeps[clubKey]);
            for (j = 0; j < activityList.length; j++) {
                const activityKey = activityList[j];
                activityData = await getInsideActivityData(clubKey, activityKey);
                if (activityData != null) {
                    //活動基本屬性
                    activityData = await setActivityFoundations(clubKey, activityKey, activityData, club);
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
        // 回傳物件
        const objPost = {};

        const activityData = await getActivityData(clubKey);
        let activityDataList = {};
        const activityKey = Object.keys(activityData);

        const activityReducer = getState().activityReducer.allActivity;
        // 新物件: activityReducer
        const newActivityReducer = JSON.parse(JSON.stringify(activityReducer));

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

        if (activityKey.length > 0) {
            let i;
            for (i = 0; i < activityKey.length; i++) {
                activityData[activityKey] = await setActivityFoundations(clubKey, activityKey[i], activityData[activityKey], club);
                newActivityReducer = handleActivityDataToReducer(newActivityReducer, clubKey, activityKey[i], activityData[activityKey]);
                if (activityData[activityKey].open) {
                    objPost = handleActivityDataToObject(objPost, clubKey, activityKey[i], activityData[activityKey]);
                }
            }
            dispatch(ActivityAction.getActivityData(newActivityReducer));
        }
        return objPost;
    }
    catch (error) {
        console.log(error.toString());
        throw error;
    }
}

//進入內頁
export const getInsideActivity = (clubKey, activityKey) => async (dispatch, getState) => {
    try {
        const activityData = await getInsideActivityData(clubKey, activityKey);
        if (activityData == null || !activityData.open) {
            alert('Activity is not exist!');
            console.log('Activity is not exist!');
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
            activityData = await setActivityFoundations(clubKey, activityKey, activityData, club);

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


        const activityDB = {
            title: activityData.title,
            place: activityData.place,
            price: parseInt(activityData.price),
            content: activityData.content,
            remarks: activityData.remarks,
            photo: activityData.photo,
            poster: user.uid,
            open: activityData.open,
            startDateTime: new Date(activityData.startDateTime).toLocaleString(),
            endDateTime: new Date(activityData.endDateTime).toLocaleString(),

            editDate: new Date().toLocaleString(),
            views: false,
            favorites: false,
        }

        await activityRef.set(activityDB)

        //更新reducer部分還沒做

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
//處理貼文屬性
//********************************************************************************

//處理活動基本屬性(學校與社團名稱、key值、nickName、職位、views、favorites)
export const setActivityFoundations = async (clubKey, activityKey, activity, club) => {
    try {
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
        // activity.numViews = Object.keys(post.views).length;
        activity.numFavorites = Object.keys(activity.favorites).length;
        //該使用者是否有按讚與觀看
        // if (post.views[userUid] == true)
        //     post.statusView = true;
        // else
        //     post.statusView = false;
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
//按讚與觀看
//********************************************************************************

//按讚
export const setActivityFavorite = (clubKey, activityKey) => async (dispatch, getState) => {
    try {
        const activity = await getInsideActivityData(clubKey, activityKey);

        if (activity == null || activity.open == false) {
            console.log('活動不存在');
            alert('活動不存在');
            return null;
        }
        else {
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
            activity = await setActivityFoundations(clubKey, activityKey, activity, club);

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