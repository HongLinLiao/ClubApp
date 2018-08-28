import React from 'react';
import { View, Text, Switch } from 'react-native';

const SelectClubElement = (element) => {

    return (
        <View>
            <Text>{element.name}</Text>
            <Switch
                value={element.status}
                onValueChange={async()=>await element.setClubStatus(element.index, element.clubList)}
            />
        </View>
    );

};


export default SelectClubElement;