import * as HomeAction from '../actions/HomeAction'
import { getPostData } from './Data';
import { getClubListForSelecting, changeMemberStatusToChinese } from './Club';
import { getPosterNickName } from './Post';
import * as firebase from "firebase"

//判斷是否使用者有收藏或加入社團與社團是否有存在文章
export const determinToSearch = (clubList, postList) => async(dispatch) => {
    if(Object.keys(clubList).length==0){
        alert('You haven\'t joined or liked clubs!');
    }
    else{
        if(Object.keys(postList).length==0){
            alert('Your clubs haven\'t exist posts!');
        }
        else{
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

        dispatch(HomeAction.setClubListSuccess(clubList, numSelectingStatusTrue));
        return clubList;
    }
    catch (error) {
        dispatch(HomeAction.setClubListFailure(error.toString()));
        console.log(error.toString());
    }
}

//取得首頁貼文列表
export const getHomePostList = (clubList) => async (dispatch, getState) => {
    try {
        var i;
        const postList = {};

        //clubList裡有社團才搜尋貼文
        if (Object.keys(clubList).length > 0) {

            const clubKey = Object.keys(clubList);
            //根據clubList去搜尋clubKey下的post
            for (i = 0; i < clubKey.length; i++) {

                const club = getState().clubReducer.clubs[clubKey[i]];
                const clubMember = club.member;

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
                        const newPost = {};
                        //找到該貼文屬於哪個社團
                        const promisesDeal = Object.keys(post).map(async (element) => {
                            post[element].schoolName = club.schoolName;
                            post[element].clubName = club.clubName;

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
                            //找到該poster的nickName
                            newPost = await getPosterNickName(post);
                            post[element].posterStatus = clubMember[newPost[element]['posterUid']].status;
                            post[element].posterStatusChinese = changeMemberStatusToChinese(post[element].posterStatus);
                        });
                        await Promise.all(promisesDeal);
                        postList = { ...postList, ...newPost };
                    }
                }
            }
        }
        dispatch(HomeAction.getPostListSuccess(postList));
        return postList;
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
        const postList={};
        if (numSelectingStatusTrue == 1) {
            if (clubList[clubKey].selectStatus == true) {
                alert('至少需有一個社團保持開啟！');
                return null;
            }
            else {
                clubList[clubKey].selectStatus = !(clubList[clubKey].selectStatus);
                numSelectingStatusTrue = numSelectingStatusTrue + 1;
                dispatch(HomeAction.setClubStatusSuccess(clubList, numSelectingStatusTrue));
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
            dispatch(HomeAction.setClubStatusSuccess(clubList, numSelectingStatusTrue));
            postList = await dispatch(getHomePostList(clubList));
        }
        return postList;
    }
    catch (error) {
        dispatch(HomeAction.setClubStatusFailure(error.toString()));
        console.log(error.toString());
    }
}