import * as firebase from 'firebase'
import React from 'react'
import { Image } from 'react-native'



export const getPopularClubData = async (clubDataArray) => {
    try {
        const clubArray = []
        const promises = Object.keys(clubDataArray).map(async (cid, index) => {
            const { clubName, schoolName } = clubDataArray[cid]
            const postsRef = firebase.database().ref('posts').child(cid)
            const activiesRef = firebase.database().ref('activities').child(cid)
            const postSnapshot = await postsRef.orderByKey().once('value')
            const activitySnapshot = await activiesRef.orderByKey().once('value')

            let postCounts = 0
            let activityCounts = 0
            let totalPostViews = 0
            let totalPostFavorites = 0
            let totalPostComments = 0
            let totalActivityViews = 0
            let totalActivityFavorites = 0

            if(postSnapshot.exists()) {
                postCounts = postSnapshot.numChildren()
                postSnapshot.forEach((childSnapshot) => {
                    const viewsSnapshot = childSnapshot.child('views')
                    const favoritesSnapshot = childSnapshot.child('favorites')
                    const numCommentsSnapshot = childSnapshot.child('numComments')
                    if(viewsSnapshot.val()) {
                        totalPostViews += viewsSnapshot.numChildren()
                    }
                    if(favoritesSnapshot.val()) {
                        totalPostFavorites += favoritesSnapshot.numChildren()
                    }
                    totalPostComments += numCommentsSnapshot.val()
                })
            }

            if(activitySnapshot.exists()) {
                activityCounts = activitySnapshot.numChildren()
                activitySnapshot.forEach((childSnapshot) => {
                    const viewsSnapshot = childSnapshot.child('views')
                    const favoritesSnapshot = childSnapshot.child('favorites')
                    if(viewsSnapshot.val()) {
                        totalActivityViews += viewsSnapshot.numChildren()
                    }
                    if(favoritesSnapshot.val()) {
                        totalActivityFavorites += favoritesSnapshot.numChildren()
                    }
                })
            }

            console.log(cid)
            console.log(postCounts)
            console.log(activityCounts)
            console.log(totalPostViews)
            console.log(totalPostFavorites)
            console.log(totalActivityViews)
            console.log(totalActivityFavorites)

            let avgPostViews = Math.round((totalPostViews / postCounts)*10)/10 || 0
            let avgPostFavorites = Math.round((totalPostFavorites / postCounts)*10)/10 || 0
            let avgPostComments = Math.round((totalPostComments / postCounts)*10)/10 || 0
            let avgActivityViews = Math.round((totalActivityViews / activityCounts)*10)/10 || 0
            let avgActivityFavorites = Math.round((totalActivityFavorites / activityCounts)*10)/10 || 0

            let avgPostRank = Math.round(((totalPostViews + (totalPostFavorites * 2)) / postCounts)*10)/10 || 0
            let avgActivityRank = Math.round(((totalActivityViews + (totalActivityFavorites * 2)) / activityCounts)*10)/10 || 0
            let popular = avgPostRank + avgActivityRank

            let clubData = {
                postCounts,
                activityCounts,
                totalPostViews,
                totalPostFavorites,
                totalPostComments,
                totalActivityViews,
                totalActivityFavorites,
                avgPostViews,
                avgPostFavorites,
                avgPostComments,
                avgActivityViews,
                avgActivityFavorites,
                avgPostRank,
                avgActivityRank
            }
            
            clubArray.push({
                x: index + 1,
                y: popular,
                club: clubDataArray[cid],
                fill: '#f6b456',
                cid,
                clubData
            })
        })

        await Promise.all(promises)

        return clubArray
    } catch(e) {
        console.log(e)
        throw e
    }
}


export const getClubDetailsData = async (cid, club) => {
    try {

        
    } catch(e) {
        console.log(e)
        throw e
    }
}