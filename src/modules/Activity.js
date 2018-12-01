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
import { sendActivityNotification } from './Api'


//********************************************************************************
// 活動同步
//********************************************************************************

//init:放活動列進reducer
export const initActivityListToReducer = (activityList, navigation) => async (dispatch, getState) => {
    try {
        let newActivityList = activityList.slice();
        let newReducer = getState().activityReducer.activityList;
        const routeName = navigation.state.routeName;
        newReducer[routeName] = newActivityList;
        dispatch(ActivityAction.getActivityList(newReducer));
    }
    catch (error) {
        throw error;
    }
}

//init:放活動進Reducer
export const initActivityToReducer = (obj, navigation) => async (dispatch, getState) => {
    try {
        let newObj = JSON.parse(JSON.stringify(obj));
        let newReducer = getState().activityReducer.activity;
        const routeName = navigation.state.routeName;
        if (obj) {
            let newActivity = {};
            newActivity[obj.activity.activityKey] = newObj;
            newReducer[routeName] = newActivity;
        }
        else {
            newReducer[routeName] = null;
            delete newReducer[routeName];
        }
        dispatch(ActivityAction.getActivity(newReducer));
    }
    catch (error) {
        throw error;
    }
}

//init:放setActivity進Reducer
export const initSetActivity = (setActivity, navigation) => async (dispatch, getState) => {
    try {
        let setActivityInReducer = getState().activityReducer.setActivity;
        let newObjct = Object.assign({}, setActivityInReducer);
        const routeName = navigation.state.routeName;
        newObjct[routeName] = setActivity;
        dispatch(ActivityAction.getSetActivity(newObjct));
    }
    catch (error) {
        console.log(error.toString());
    }
}

//init:放setActivityList進activityReducer
export const initSetActivityList = (setActivityList, navigation) => async (dispatch, getState) => {
    try {
        let setActivityListInReducer = getState().activityReducer.setActivityList;
        let newObjct = Object.assign({}, setActivityListInReducer);
        const routeName = navigation.state.routeName;
        newObjct[routeName] = setActivityList;
        dispatch(ActivityAction.getSetActivityList(newObjct));
    }
    catch (error) {
        console.log(error.toString());
    }
}

//synchronize:活動同步更改
export const syncActivity = (data) => async (dispatch, getState) => {
    try {
        //call reducer
        const activityListInReducer = getState().activityReducer.activityList;
        let ordActivityList = JSON.parse(JSON.stringify(activityListInReducer));
        const activityInReducer = getState().activityReducer.activity;
        let ordActivity = JSON.parse(JSON.stringify(activityInReducer));
        let activityListStatus = false;
        let activityStatus = false;
        let status = false;
        //如果是陣列，表示更動的來源是重整
        if (Array.isArray(data)) {
            if (data.length == 0) {
                let itemActivityList = Object.keys(ordActivityList);
                //空的再設成空的
                for (let i = 0; i < itemActivityList.length; i++) {
                    if (ordActivityList[itemActivityList[i]].length == 0) {
                        status = true;
                    }
                    //空的
                    if (status) {
                        let setActivityListFuction = getState().activityReducer.setActivityList[itemActivityList[i]];
                        setActivityListFuction(ordActivityList[itemActivityList[i]]);
                    }
                };
            }
            else {
                data.map((child) => {
                    let activityKey = Object.keys(child)[0];

                    //更新活動列
                    //需要查詢的route
                    let itemActivityList = Object.keys(ordActivityList);
                    //跑查詢的route裡是否具有要更動的活動
                    for (let i = 0; i < itemActivityList.length; i++) {
                        let result = ordActivityList[itemActivityList[i]].some(function (value, index, array) {
                            if (Object.keys(value)[0] == activityKey) {
                                //更改貼文列
                                ordActivityList[itemActivityList[i]][index][activityKey] = child[activityKey];
                                //代表有改變要寫進route 頁面
                                status = true;
                                activityListStatus = true;
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                        //空的
                        if (status) {
                            let setActivityListFuction = getState().activityReducer.setActivityList[itemActivityList[i]];
                            setActivityListFuction(ordActivityList[itemActivityList[i]]);
                            console.log(activityKey + ': ' + itemActivityList[i] + '已同步');
                        }
                    };

                    //更新活動
                    //需要查詢的route
                    let itemActivity = Object.keys(ordActivity);
                    let keyList;
                    //跑查詢的route是某具有要更動的活動
                    for (let j = 0; j < itemActivity.length; j++) {
                        keyList = Object.keys(ordActivity[itemActivity[j]]);
                        for (let z = 0; z < keyList.length; z++) {
                            if (keyList[z] == activityKey) {
                                //更改內容
                                ordActivity[itemActivity[j]][keyList[z]]['activity'] = child[activityKey];
                                //寫進頁面
                                let setActivityFuction = getState().activityReducer.setActivity[itemActivity[j]];
                                setActivityFuction(ordActivity[itemActivity[j]][keyList[z]]);
                                activityStatus = true;
                                console.log(activityKey + ': ' + itemActivity[j] + '已同步');
                                break;
                            }
                        }
                    }
                });
            }
        }
        //其餘來源是物件，表示更動來源是活動動作
        else {
            if (Object.keys(data).length >= 1) {
                let activityKey = data.activity.activityKey;

                //更新活動列
                //需要查詢的route
                let itemActivityList = Object.keys(ordActivityList);
                //跑查詢的route裡是否具有要更動的活動
                for (let i = 0; i < itemActivityList.length; i++) {
                    let result = ordActivityList[itemActivityList[i]].some(function (value, index, array) {
                        if (Object.keys(value)[0] == activityKey) {
                            //更改活動列
                            ordActivityList[itemActivityList[i]][index][activityKey] = data.activity;
                            //代表有改變要寫進route頁面
                            status = true;
                            activityListStatus = true;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    if (status) {
                        let setActivityListFuction = getState().activityReducer.setActivityList[itemActivityList[i]];
                        setActivityListFuction(ordActivityList[itemActivityList[i]]);
                        console.log(activityKey + ': ' + itemActivityList[i] + '已同步');
                    }
                };

                //更新活動
                //需要查詢的route
                let itemActivity = Object.keys(ordActivity);
                let keyList;
                //跑查詢的route是否具有要更動的活動
                for (let j = 0; j < itemActivity.length; j++) {
                    keyList = Object.keys(ordActivity[itemActivity[j]]);
                    for (let z = 0; z < keyList.length; z++) {
                        if (keyList[z] == activityKey) {
                            //更改內容
                            ordActivity[itemActivity[j]][keyList[z]]['activity'] = data.activity;
                            //寫進頁面
                            let setActivityFuction = getState().activityReducer.setActivity[itemActivity[j]];
                            setActivityFuction(ordActivity[itemActivity[j]][keyList[z]]);
                            activityStatus = true;
                            console.log(activityKey + ': ' + itemActivity[j] + '已同步');
                            break;
                        }
                    }
                }
            }
        }
        //寫回reducer
        if (activityListStatus) {
            dispatch(ActivityAction.getActivityList(ordActivityList));
        }
        if (activityStatus) {
            dispatch(ActivityAction.getActivity(ordActivity));
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//synchronize:活動同步更改(刪除)
export const syncActivityDelete = (activityKey) => async (dispatch, getState) => {
    try {
        //call reducer
        const activityListInReducer = getState().activityReducer.activityList;
        let ordActivityList = JSON.parse(JSON.stringify(activityListInReducer));
        const activityInReducer = getState().activityReducer.activity;
        let ordActivity = JSON.parse(JSON.stringify(activityInReducer));
        let activityListStatus = false;
        let activityStatus = false;
        let status = false;

        //更新活動列
        //需要查詢的route
        let itemactivityList = Object.keys(ordActivityList);
        //跑查詢的route裡是否具有要更動的活動
        for (let i = 0; i < itemactivityList.length; i++) {
            let result = ordActivityList[itemactivityList[i]].some(function (value, index, array) {
                if (Object.keys(value)[0] == activityKey) {
                    //更改活動列
                    ordActivityList[itemactivityList[i]].splice(index, 1);
                    //代表有改變要寫進route頁面
                    status = true;
                    activityListStatus = true;
                    return true;
                }
                else {
                    return false;
                }
            });
            if (status) {
                let setActivityListFuction = getState().activityReducer.setActivityList[itemactivityList[i]];
                setActivityListFuction(ordActivityList[itemactivityList[i]]);
                console.log(activityKey + ': ' + itemactivityList[i] + '已同步');
            }
        };
        //更新活動
        //需要查詢的route
        let itemActivity = Object.keys(ordActivity);
        let keyList;
        //跑查詢的route是某具有要更動的活動
        for (let j = 0; j < itemActivity.length; j++) {
            keyList = Object.keys(ordActivity[itemActivity[j]]);
            for (let z = 0; z < keyList.length; z++) {
                if (keyList[z] == activityKey) {
                    //更改內容
                    ordActivity[itemActivity[j]][keyList[z]] = null;
                    delete ordActivity[itemActivity[j]];
                    //寫進頁面
                    activityStatus = true;
                    console.log(activityKey + ': ' + itemActivity[j] + '已同步');
                    break;
                }
            }
        }
        //寫回reducer
        if (activityListStatus) {
            dispatch(ActivityAction.getActivityList(ordActivityList));
        }
        if (activityStatus) {
            dispatch(ActivityAction.getActivity(ordActivity));
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//synchronize:活動頁返回
export const syncActivityBack = (routeName) => async (dispatch, getState) => {
    try {
        let setActivityInReducer = getState().activityReducer.setActivity;
        let newObjct = Object.assign({}, setActivityInReducer);
        if (newObjct[routeName]) {
            newObjct[routeName] = null;
            delete newObjct[routeName];
            dispatch(ActivityAction.getSetActivity(newObjct));
        }

        let activity = getState().activityReducer.activity;
        let newReducer = JSON.parse(JSON.stringify(activity));
        if (newReducer[routeName]) {
            newReducer[routeName] = null;
            delete newReducer[routeName];
            dispatch(ActivityAction.getActivity(newReducer));
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//custom function：搜尋社團返回搜尋頁 清除setState
export const syncSearchActivityBack = (routeName) => async (dispatch, getState) => {
    try {
        let setActivityListInReducer = getState().activityReducer.setActivityList;
        let newObjct = Object.assign({}, setActivityListInReducer);
        if (newObjct[routeName]) {
            newObjct[routeName] = null;
            delete newObjct[routeName];
            dispatch(ActivityAction.getSetActivityList(newObjct));
        }

        let activityList = getState().activityReducer.activityList;
        let newReducer = JSON.parse(JSON.stringify(activityList));
        if (newReducer[routeName]) {
            newReducer[routeName] = null;
            delete newReducer[routeName];
            dispatch(ActivityAction.getActivityList(newReducer));
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//********************************************************************************
//活動
//********************************************************************************

//取得社團活動
export const getClubActivityReload = (clubKey, navigation) => async (dispatch) => {
    try {
        const getClubActivity = firebase.functions().httpsCallable('getClubActivity');
        const response = await getClubActivity(clubKey);
        if (response.data) {
            //丟進reducer
            dispatch(initActivityListToReducer(response.data, navigation));
            //檢查同步
            dispatch(syncActivity(response.data))
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}

//進入內頁
export const getInsideActivity = (clubKey, activityKey) => async (dispatch, getState) => {
    try {
        const getActivityInside = firebase.functions().httpsCallable('getActivityInside');
        let response = await getActivityInside({ clubKey: clubKey, activityKey: activityKey });
        return response.data;
    }
    catch (error) {
        console.log(error.toString);
    }
}

//收藏
export const setActivityKeep = (clubKey, activityKey) => async (dispatch, getState) => {
    try {
        const setActivityKeep = firebase.functions().httpsCallable('setActivityKeep');
        const response = await setActivityKeep({ clubKey: clubKey, activityKey: activityKey });
        return response.data;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//按讚
export const setActivityFavorite = (clubKey, activityKey) => async (dispatch, getState) => {
    try {
        const setActivityFavorite = firebase.functions().httpsCallable('setActivityFavorite');
        const response = await setActivityFavorite({ clubKey: clubKey, activityKey: activityKey });
        return response.data;
    }
    catch (error) {
        console.log(error.toString());
    }
}

//********************************************************************************
// Get Data
//********************************************************************************

//取得user收藏的活動 x
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

//用activityKeyArray進firebase抓新資料 x
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
        let objPost = {};
        let activityKey;
        const activityData = await getActivityData(clubKey);
        if (activityData) {
            activityKey = Object.keys(activityData);
        }
        else {
            return {};
        }

        const activityReducer = getState().activityReducer.allActivity;
        // 新物件: activityReducer
        const newActivityReducer = JSON.parse(JSON.stringify(activityReducer));

        if (activityKey.length > 0) {
            let i;
            const keepList = await getUserActivities();
            if (keepList == null) {
                keepList = {};
            }
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


//********************************************************************************
// 活動
//********************************************************************************

//建立一個新活動
export const createActivity = (cid, activityData, club) => async (dispatch) => {
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

        const activity = {
            title: activityData.title,
            location: activityData.location || false,
            place: activityData.place,
            price: parseInt(activityData.price),
            content: activityData.content,
            remarks: activityData.remarks,
            photo: photoUrl,
            poster: user.uid,
            open: activityData.open,
            startDateTime: new Date(activityData.startDateTime).toUTCString(),
            endDateTime: new Date(activityData.endDateTime).toUTCString(),
            editDate: new Date().toUTCString(),
            views: false,
            favorites: false,
            keeps: false
        }

        await activityRef.set(activity)

        await sendActivityNotification(cid, activity, club)

    } catch (e) {

        console.log(e)

        throw e

    }
}
