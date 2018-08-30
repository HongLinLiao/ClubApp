import { getUserData } from './User'
import { getClubData } from './Club'
import * as firebase from 'firebase'

//從firebase取得指定club下之所有post
export const getPostData = async (clubKey) => {
    const postRef = firebase.database().ref('posts/' + clubKey);
    const snapShot = await postRef.once('value');
    const postData = snapShot.val();
    if (postData != null) {

        //將每篇貼文做memo、clubName、posterNickName處理
        const promisesPost = Object.keys(postData).map(async (element) => {

            //寫入postKey
            postData[element].postKey = element;

            //找到該貼文屬於哪個社團
            postData[element].clubKey = clubKey;
            const club = await getClubData(clubKey);
            postData[element].clubName = club.schoolName + club.clubName;

            //將content縮寫成memo
            if (postData[element].content.length > 20) {
                postData[element].memo = postData[element].content.substring(0, 21) + '...more';
            }
            else {
                postData[element].memo = postData[element].content;
            }

            //找到該poster的nickName
            const promisesUserName = Object.keys(postData[element]).map(async (key) => {
                if (key.toString().length > 15) {
                    postData[element].uid = key.toString();
                    const user = await getUserData(key);
                    postData[element].poster = user.nickName;
                }
            });
            await Promise.all(promisesUserName);
        });
        await Promise.all(promisesPost);
    }
    return postData;
}