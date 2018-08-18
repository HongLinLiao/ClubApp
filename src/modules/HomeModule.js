import * as HomeAction from '../actions/HomeAction'
import * as firebase from "firebase"

//取得貼文列表
export const getPostList = () => async (dispatch) => {

    dispatch(HomeAction.getPostListRequest());

    try {
        var i, j;
        var postList = [];

        //user已加入的社團key
        var joinClub = ['c001'];
        //user已收藏的社團key
        var likeClub = ['c002'];
        var allClub = joinClub.concat(likeClub);

        if (allClub.length > 0) {
            console.log('user加入和收藏的社團: ' + allClub);

            //根據user的社團去搜尋社團key下的post子樹
            for (i = 0; i < allClub.length; i++) {
                var postRef = firebase.database().ref('Post/' + allClub[i]);
                await postRef.once('value')
                    .then(function (snapshot) {
                        //過濾掉第一層 post的key
                        snapshot.forEach(function (childSnapshop) {

                            //不能add property進childSnapshop
                            var copyPost = childSnapshop.val();

                            //把content縮短成memo簡寫
                            if (copyPost.content.length > 10) {
                                //取content 0~21個字元
                                copyPost.memo = copyPost.content.substring(0, 21) + '......';
                            }
                            else {
                                copyPost.memo = copyPost.content;
                            }

                            //將uid轉換成value
                            Object.keys(copyPost).map(function (element) {
                                if (element.toString().length > 20) {
                                    copyPost.uid = element.toString();
                                    //根據抓到的uid下去抓nickName
                                    var nickNameRef = firebase.database().ref('users/' + element.toString() + '/nickName');
                                    nickNameRef.once('value')
                                        .then( function (snapshop){
                                            copyPost.poster = snapshop.val();
                                            console.log(copyPost.poster)
                                        });
                                }
                            });
                            postList.push(copyPost)
                        });
                    });
            }
        }
        else {
            //user沒加入或收藏社團
        }

        if (postList.length == 0) {
            alert('Your clubs have not exist post!');
        }

        dispatch(HomeAction.getPostListSuccess(postList));
        console.log(postList)
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
