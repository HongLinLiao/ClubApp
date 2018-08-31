import * as HomeAction from '../actions/HomeAction'
import { getPostData , getClubData } from './Data';
import { getClubListForSelecting } from './Club';
import { getPosterNickName } from './Post';
import * as firebase from "firebase"

//取得clubList放入homeReducer控制篩選（初始狀態）
export const getHomeClubList = (joinClub, likeClub) => async (dispatch) => {
    try {
        const allClub = { ...joinClub, ...likeClub };
        const clubList = await getClubListForSelecting(allClub);
        const numSelectingStatusTrue = Object.keys(clubList).length;

        dispatch(HomeAction.setClubListSuccess(clubList, numSelectingStatusTrue));
        return clubList;
    }
    catch (error) {
        dispatch(HomeAction.setClubListFailure(error.toString()));
        console.log(error.toString());
    }
}

//取得首頁貼文列表
export const getHomePostList = (clubList) => async (dispatch,getState) => {
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
                    const post = await getPostData(clubKey[i]);
                    if (post == null) {
                        continue;
                    }
                    else {
                        //找到該貼文屬於哪個社團
                        Object.keys(post).map((element) => {
                            post[element].schoolName = clubList[clubKey[i]].schoolName;
                            post[element].clubName = clubList[clubKey[i]].clubName;
                            //將clubKey放進attribute，否則找不到貼文社團
                            post[element].clubKey = clubKey[i];
                            post[element].postKey = element;
                            //將content縮寫成memo
                            if (post[element].content.length > 20) {
                                post[element].memo = post[element].content.substring(0, 21) + '...more';
                            }
                            else {
                                post[element].memo = post[element].content;
                            }
                        });
                        //找到該poster的nickName
                        const newPost  = await getPosterNickName(post);
                        postList = { ...postList, ...newPost };
                    }
                }
            }
            //使用者收藏與加入的社團皆未有文章存在
            if (Object.keys(postList).length == 0) {
                alert('使用者之社團未存在貼文');
            }
        }
        else {
            //user沒加入或收藏社團
            alert('使用者沒加入或收藏社團');
        }
        dispatch(HomeAction.getPostListSuccess(postList));
    }
    catch (error) {
        dispatch(HomeAction.getPostListFailure(error.toString()))
        console.log(error.toString())
    }
}

//依據選取的貼文將貼文資料傳入post，並進入貼文內頁
export const setPostListToPost = (element) => async (dispatch) => {

    try {
        dispatch(HomeAction.pressPostSuccess(element));
        console.log(element);
        element.navigation.navigate('Post');
    }
    catch (error) {
        dispatch(HomeAction.pressPostFailure(error.toString()))
        console.log(error.toString())
    }
}

//改變HomeClubList的selectStatus，並判斷是否有關閉全部selectStatus
export const setHomeClubListStatus = (clubKey, clubList, numSelectingStatusTrue) => async (dispatch) => {
    try {
        if (numSelectingStatusTrue == 1) {
            if (clubList[clubKey].selectStatus == true) {
                alert('至少需有一個社團保持開啟！');
            }
            else {
                clubList[clubKey].selectStatus = !(clubList[clubKey].selectStatus);
                numSelectingStatusTrue = numSelectingStatusTrue + 1;
                dispatch(HomeAction.setClubStatusSuccess(clubList, numSelectingStatusTrue));
                dispatch(getHomePostList(clubList));
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
            dispatch(HomeAction.setClubStatusSuccess(clubList, numSelectingStatusTrue));
            dispatch(getHomePostList(clubList));
        }

    }
    catch (error) {
        dispatch(HomeAction.setClubStatusFailure(error.toString()));
        console.log(error.toString());
    }
}