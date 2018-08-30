import { getClubData } from './Data';
import * as firebase from "firebase"

//依據傳入club物件去產生一個完整clubList
export const setClubList = async(allClub) =>  {
    try {
        const clubList = {};

        const promises = Object.keys(allClub).map(async (element) => {

            const club = await getClubData(element);

            const tempObj = {};
            tempObj[element] = {
                clubKey: element,
                selectStatus: true,
                schoolName: club.schoolName,
                clubName: club.clubName
            };
            clubList = { ...clubList, ...tempObj };
        });
        await Promise.all(promises);
        return clubList;
    }
    catch (error) {
        console.log(error.toString());
    }
}