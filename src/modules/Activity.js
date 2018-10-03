import * as firebase from "firebase"
import * as ActivityAction from '../actions/ActivityAction'


//建立一個新活動
export const createActivity = (cid, activityData) => async (dispatch) => {
    try {
        dispatch(ActivityAction.createAcitvityRequest())

        const user = firebase.auth().currentUser
        const activityRef = firebase.database().ref('activities').child(cid).push()


        const activityDB = {
            title: activityData.title,
            place: activityData.place,
            price: parseInt(activityData.price) ,
            content: activityData.content,
            remarks: activityData.remarks,
            photo: activityData.photo,
            poster: user.uid,
            open: activityData.open,
            startDateTime: new Date(activityData.startDateTime).toLocaleString(),
            endDateTime: new Date(activityData.endDateTime).toLocaleString(),

            editDate: new Date().toLocaleString(),
            views: false,
            favorites: false,
        }

        await activityRef.set(activityDB)

        //更新reducer部分還沒做

    } catch(e) {

        console.log(e)

        throw e

    }
}