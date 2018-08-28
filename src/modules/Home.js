import * as HomeAction from '../actions/HomeAction'
import * as firebase from "firebase"

//從userReducer取得user clubs
export const setClubList = (joinClub, likeClub) => async (dispatch) => {

    dispatch(HomeAction.setClubListRequest());

    try {
        var i;
        var clubList = [];
        var allClub = joinClub.concat(likeClub);
        for (i = 0; i < allClub.length; i++) {
            if (allClub[i] == null) {
                continue;
            }
            else {
                var obj = {};
                obj.index = i
                obj.id = allClub[i];
                obj.status = true;

                //name會在getPostList裡讀取放入clubList

                clubList.push(obj);
            }
        }
        dispatch(HomeAction.setClubListSuccess(clubList));
    }
    catch (error) {
        dispatch(HomeAction.setClubListFailure(error.toString()));
        console.log(error.toString());
    }
}

//取得貼文列表
export const getPostList = () => async (dispatch, getState) => {

    //從store裡面拿clubList
    var clubList = getState().homeReducer.clubList;
    console.log(clubList)

    dispatch(HomeAction.setClubListRequest());
    dispatch(HomeAction.getPostListRequest());
    try {
        var i;
        var postList = [];

        if (clubList.length > 0) {

            //根據user的社團去搜尋社團key下的post子樹
            for (i = 0; i < clubList.length; i++) {
                var postRef;

                //將
                var clubRef = firebase.database().ref('Club/' + clubList[i].id);
                var snapshot = await clubRef.once('value');
                clubList[i].name = snapshot.val().schoolName + snapshot.val().clubName;

                if (clubList[i].status == false) {
                    continue;
                }
                else {
                    postRef = firebase.database().ref('Post/' + clubList[i].id);
                }

                await postRef.once('value')
                    .then(function (snapshot) {
                        //過濾掉第一層 post的key
                        snapshot.forEach(function (childSnapshot) {

                            //不能add property進childSnapshot
                            var copyPost = childSnapshot.val();

                            //把content縮短成memo簡寫
                            if (copyPost.content.length > 10) {
                                //取content 0~21個字元
                                copyPost.memo = copyPost.content.substring(0, 21) + '......';
                            }
                            else {
                                copyPost.memo = copyPost.content;
                            }

                            copyPost.clubName = clubList[i].name;

                            //把uid移至value
                            Object.keys(copyPost).map(function (element) {
                                if (element.toString().length > 20) {
                                    copyPost.uid = element.toString();
                                }
                            });
                            postList.push(copyPost)
                        });
                    });
            }
            for (i = 0; i < postList.length; i++) {
                //根據抓到的uid下去抓nickName
                const nickNameRef = firebase.database().ref('users/' + postList[i].uid + '/nickName');
                await nickNameRef.once('value')
                    .then(function (snapshot) {
                        postList[i].poster = snapshot.val();
                    });
            }
        }
        else {
            //user沒加入或收藏社團
        }

        if (postList.length == 0) {
            alert('Your clubs have not exist post!');
        }

        dispatch(HomeAction.setClubListSuccess(clubList));
        dispatch(HomeAction.getPostListSuccess(postList));
    }
    catch (error) {
        dispatch(HomeAction.setClubListFailure(error.toString()));
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

export const setClubStatus = (index, clubList) => async (dispatch) => {

    dispatch(HomeAction.setClubStatusRequest());

    try {
        clubList[index].status = !(clubList[index].status);

        dispatch(HomeAction.setClubStatusSuccess(clubList));
    }
    catch (error) {
        dispatch(HomeAction.setClubStatusFailure(error.toString()));
        console.log(error.toString());
    }
}