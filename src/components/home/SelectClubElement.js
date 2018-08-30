import React from 'react';
import { View, Text, Switch } from 'react-native';

const SelectClubElement = (element) => {

    return (
        <View>
            <Text>{element.clubName}</Text>
            <Text>{element.schoolName}</Text>
            <Switch
                value={element.selectStatus}
                onValueChange={async()=>await element.setHomeClubStatus(element.clubKey, element.clubList,element.numSelectingStatusTrue)}
            />
        </View>
    );

};


export default SelectClubElement;