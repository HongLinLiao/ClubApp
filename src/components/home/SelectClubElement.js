import React from 'react';
import { View, Text, Switch } from 'react-native';

const SelectClubElement = (element) => {

    reload = async (clubKey) => {

        const { clubList, numSelectingStatusTrue, setHomeClubListStatus, determinToSearch } = element;
        const newPostList = await setHomeClubListStatus(clubKey, clubList, numSelectingStatusTrue);
        //判斷是否有觸發篩選條件
        if(newPostList!=null){
            await determinToSearch(clubList, newPostList);
        }
    }

    return (
        <View>
            <Text>{element.clubName}</Text>
            <Text>{element.schoolName}</Text>
            <Switch
                value={element.selectStatus}
                onValueChange={async () => { await this.reload(element.clubKey) }}
            />
        </View>
    );

};


export default SelectClubElement;