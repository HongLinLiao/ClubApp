import * as HomeAction from '../actions/HomeAction'
import { getClubListForSelecting } from './Club';
import { getPostComplete } from './Post';
import * as firebase from "firebase"

//判斷是否使用者有收藏或加入社團與社團是否有存在文章
export const determinToSearch = (clubList, postList) => async (dispatch) => {
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

//取得clubList放入homeReducer控制篩選（初始狀態）
export const getHomeClubList = (joinClub, likeClub) => async (dispatch) => {
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

//取得首頁貼文列表
export const getHomePostList = (clubList) => async (dispatch) => {
    try {
        var i;
        const postList = {};
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
                    post = await getPostComplete(clubKey[i]);
                }
                postList = { ...postList, ...post };
            }
        }
        dispatch(HomeAction.getHomePostListSuccess(postList));
        return postList;
    }
    catch (error) {
        dispatch(HomeAction.getHomePostListFailure(error.toString()))
        console.log(error.toString())
    }
}

//依據選取的貼文將貼文資料傳入post，並進入貼文內頁
export const setPostListToPost = (element) => async (dispatch) => {

    try {
        dispatch(HomeAction.pressPostSuccess(element));
        console.log(element);
        element.navigation.navigate('Post', element);
    }
    catch (error) {
        dispatch(HomeAction.pressPostFailure(error.toString()))
        console.log(error.toString())
    }
}

//改變HomeClubList的selectStatus，並判斷是否有關閉全部selectStatus
export const setHomeClubListStatus = (clubKey, clubList, numSelectingStatusTrue) => async (dispatch) => {
    try {
        const postList = {};
        if (numSelectingStatusTrue == 1) {
            if (clubList[clubKey].selectStatus == true) {
                alert('At least one club need openning！');
                return null;
            }
            else {
                clubList[clubKey].selectStatus = !(clubList[clubKey].selectStatus);
                numSelectingStatusTrue = numSelectingStatusTrue + 1;
                dispatch(HomeAction.setHomeClubListStatusSuccess(clubList, numSelectingStatusTrue));
                postList = await dispatch(getHomePostList(clubList));
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
            postList = await dispatch(getHomePostList(clubList));
        }
        return postList;
    }
    catch (error) {
        dispatch(HomeAction.setHomeClubListStatusFailure(error.toString()));
        console.log(error.toString());
    }
}