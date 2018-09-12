import * as firebase from "firebase"
import * as PostAction from '../actions/PostAction'
import {
	getClubData,
	getUserData
} from "./Data"

//找到該poster的nickName
export const getPosterNickName = async (post) => {

	var i;
	const postKey = Object.keys(post);
	for (i = 0; i < postKey.length; i++) {
		const promisesNickName = Object.keys(post[postKey]).map(async (element) => {
			if (element.length > 15) {
				post[postKey].posterUid = element;
				const user = await getUserData(element);
				post[postKey].posterNickName = user.nickName;
			}
		});
		await Promise.all(promisesNickName);
	}
	return post;
}


export const createPost = (cid) => async (dispatch) => {

	try {
		dispatch(PostAction.createPostRequest())

		
	} catch (e) {

	}
}