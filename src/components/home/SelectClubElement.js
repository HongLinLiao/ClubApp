import React from 'react'
import { View, Text, Image } from 'react-native'
import { CheckBox } from 'react-native-elements';
import styles from '../../styles/home/Selecting'
const SelectClubElement = (element) => {

    reload = async (clubKey) => {
        const { clubList, numSelectingStatusTrue, setHomeClubListStatus, homeReload,parentOverLayor } = element;
        parentOverLayor();
        const newClubList = await setHomeClubListStatus(clubKey, clubList, numSelectingStatusTrue);
        await homeReload(newClubList);
        parentOverLayor();
    }

    return (
        <View style={styles.listView}>
            <View style={styles.textArea}>
                <Text style={[styles.school, { color: element.selectStatus ? 'rgba(246,180,86,1)' : 'rgba(102,102,102,1)' }]}>{element.schoolName}</Text>
                <Text style={[styles.club, { color: element.selectStatus ? 'rgba(246,180,86,1)' : 'rgba(102,102,102,1)' }]}>{element.clubName}</Text>
            </View>
            <View>
                <CheckBox
                    right
                    containerStyle={styles.checkContainer}
                    checkedIcon={<Image style={styles.checkIcon}
                        source={require('../../images/orangecheck.png')} />}
                    uncheckedIcon={<Image style={styles.boxIcon}
                        source={require('../../images/666666box.png')} />}
                    checked={element.selectStatus}
                    onPress={async () => { await this.reload(element.clubKey) }} />
            </View>
        </View>

    );

};


export default SelectClubElement;