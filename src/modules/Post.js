import * as firebase from "firebase"
import { getUserData, getPostData, getClubData } from "./Data"
import { changeMemberStatusToChinese } from './Club';

//取得完整的貼文資訊
export const getPostComplete = async(clubKey) => {
    var postList = {};
    var i;
    //取得該社團資訊
    const club = await getClubData(clubKey);
    const post = await getPostData(clubKey);
    if (post != null) {
        for (i = 0; i < Object.keys(post).length > 0; i++) {
            const promisesAll = Object.keys(post).map(async (element) => {
                //該貼文社團與學校名稱
                post[element].schoolName = club.schoolName;
                post[element].clubName = club.clubName;
                
                //將clubKey放進attribute，否則找不到該貼文社團
                post[element].clubKey = clubKey;
                post[element].postKey = element;

                //處理posterNickName
                post[element] = await setPosterNickName(post[element]);

                //處理poster職位名稱
                post[element].posterStatus = club.member[post[element].posterUid].status;
                post[element].posterStatusChinese = changeMemberStatusToChinese(post[element].posterStatus);

                //處理view和favorite
                post[element] = getViewFavoriteData(post[element]);
            });
            await Promise.all(promisesAll);
            postList = { ...postList, ...post };
        }
    }
    return postList;
}

//找到該poster的nickName
export const setPosterNickName = async (post) => {
    const promisesNickName = Object.keys(post).map(async (element) => {
        if (element.length > 15) {
            post.posterUid = element;
            const user = await getUserData(element);
            post.posterNickName = user.nickName;
        }
    });
    await Promise.all(promisesNickName);
    return post;
};

//處理Views和Favorite
export const getViewFavoriteData = (post) => {
    //views與favorite數量
    post.numViews = Object.keys(post.views).length;
    post.numFavorites = Object.keys(post.favorites).length;
    //受否有按讚或觀看
    
    return post;
}