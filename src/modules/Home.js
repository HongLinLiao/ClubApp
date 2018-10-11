import * as HomeAction from '../actions/HomeAction'
import { getPostDataComplete, getPostKeyListFromClubKey } from './Post';
import { getActivityKeyFromClubKey, getActivityDataComplete } from './Activity.js';
import { getClubData } from './Data';
import * as firebase from "firebase"

//********************************************************************************
// reload functiob
//********************************************************************************

//貼文列重整
export const getHomePostReload = (clubList, homeReload) => async (dispatch) => {
    try {
        const postKeyList = await dispatch(getHomePostKey(clubList));
        const newPostList = await dispatch(getPostDataComplete(postKeyList));
        homeReload(newPostList);
        determinToSearch(clubList, newPostList);
    }
    catch (error) {
        console.log(error.toStirng());
    }
}

//活動列重整
export const getHomeActivityReload = (clubList,activityReload) => async (dispatch) => {
    try {
        const activityKeyList = await dispatch(getHomeActivityKey(clubList));
        const newActivityList = await dispatch(getActivityDataComplete(activityKeyList));
        activityReload(newActivityList);
    }
    catch (error) {
        console.log(error.toStirng());
    }
}


//********************************************************************************
// main functiob
//********************************************************************************

//抓joinClub與likeClub，產生clubList放入homeReducer控制篩選 （初始狀態）
export const initHomeClubList = (joinClub, likeClub) => async (dispatch) => {
    try {
        const allClub = { ...joinClub, ...likeClub };
        const clubList = await getClubListForSelecting(allClub);
        const numSelectingStatusTrue = Object.keys(clubList).length;

        dispatch(HomeAction.getHomeClubListSuccess(clubList, numSelectingStatusTrue));
        return clubList;
    }
    catch (error) {
        dispatch(HomeAction.getHomeClubListFailure(error.toString()));
        console.log(error.toString());
    }
}

//以clubList去取得postKey
export const getHomePostKey = (clubList) => async (dispatch) => {
    try {
        var i;
        const postKeyList = {};
        //clubList裡有社團才搜尋貼文
        if (Object.keys(clubList).length > 0) {
            const clubKey = Object.keys(clubList);
            //根據clubList去搜尋clubKey下的post
            for (i = 0; i < clubKey.length; i++) {
                //篩選關掉則跳過搜尋
                if (clubList[clubKey[i]].selectStatus == false) {
                    continue;
                }
                else {
                    let tempPostKeyList = await getPostKeyListFromClubKey(clubKey[i]);
                    postKeyList = { ...postKeyList, ...tempPostKeyList };
                }
            }
        }
        dispatch(HomeAction.getHomePostListSuccess(postKeyList));
        return postKeyList;
    }
    catch (error) {
        dispatch(HomeAction.getHomePostListFailure(error.toString()))
        console.log(error.toString());
    }
}

//以clubList去取得activityKey
export const getHomeActivityKey = (clubList) => async (dispatch) => {
    try {
        var i;
        const activityList = {};
        //clubList裡有社團才搜尋貼文
        if (Object.keys(clubList).length > 0) {
            const clubKey = Object.keys(clubList);
            //根據clubList去搜尋clubKey下的post
            for (i = 0; i < clubKey.length; i++) {
                //篩選關掉則跳過搜尋
                let tempActivityKeyList = await getActivityKeyFromClubKey(clubKey[i]);
                activityList = { ...activityList, ...tempActivityKeyList };
            }
        }
        dispatch(HomeAction.getHomeActivityListSuccess(activityList));
        return activityList;
    }
    catch (error) {
        dispatch(HomeAction.getHomeActivityListFailure(error.toString()))
        console.log(error.toString());
    }
}

//改變HomeClubList的selectStatus，並判斷是否有關閉全部selectStatus
export const setHomeClubListStatus = (clubKey, clubList, numSelectingStatusTrue) => async (dispatch) => {
    try {
        if (numSelectingStatusTrue == 1) {
            if (clubList[clubKey].selectStatus == true) {
                alert('At least one club need openning！');
            }
            else {
                clubList[clubKey].selectStatus = !(clubList[clubKey].selectStatus);
                numSelectingStatusTrue = numSelectingStatusTrue + 1;
                dispatch(HomeAction.setHomeClubListStatusSuccess(clubList, numSelectingStatusTrue));
            }
        }
        else {
            if (clubList[clubKey].selectStatus == false) {
                numSelectingStatusTrue = numSelectingStatusTrue + 1;
            }
            else {
                numSelectingStatusTrue = numSelectingStatusTrue - 1;
            }
            clubList[clubKey].selectStatus = !(clubList[clubKey].selectStatus);
            dispatch(HomeAction.setHomeClubListStatusSuccess(clubList, numSelectingStatusTrue));
        }
        return clubList;
    }
    catch (error) {
        dispatch(HomeAction.setHomeClubListStatusFailure(error.toString()));
        console.log(error.toString());
    }
}

//********************************************************************************
// auxiliary functiob
//********************************************************************************

//依據傳入club物件去產生一個完整clubList(含selectStatus)
export const getClubListForSelecting = async (allClub) => {
    try {
        const clubList = {};

        const promises = Object.keys(allClub).map(async (element) => {

            const club = await getClubData(element);

            const tempObj = {};
            tempObj[element] = {
                clubKey: element,
                selectStatus: true,
                schoolName: club.schoolName,
                clubName: club.clubName
            };
            clubList = { ...clubList, ...tempObj };
        });
        await Promise.all(promises);
        return clubList;
    }
    catch (error) {
        console.log(error.toString());
        throw error;
    }
}

//判斷是否使用者有收藏或加入社團與社團是否有存在文章
export const determinToSearch = (clubList, postList) => {
    try {
        if (Object.keys(clubList).length == 0) {
            alert('You haven\'t joined or liked clubs!');
        }
        else {
            if (Object.keys(postList).length == 0) {
                alert('Your clubs haven\'t exist posts!');
            }
            else {
                console.log('pass!');
            }
        }
    }
    catch (error) {
        console.log(error.toString());
    }
}





