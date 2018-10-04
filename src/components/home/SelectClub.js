import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import SelectClubElement from './SelectClubElement'
import styles from '../../styles/home/Selecting'

class SelectClub extends React.Component {

    render() {
        const newClubList = { ...this.props.clubList };
        const newNumSelectingStatsTrue = this.props.numSelectingStatusTrue;
        return (
            <ScrollView>
                <View>
                    <View style={styles.container}>

                        {
                            Object.values(newClubList).map((element) => (
                                <SelectClubElement
                                    key={element.clubKey}
                                    clubKey={element.clubKey}
                                    clubName={element.clubName}
                                    schoolName={element.schoolName}
                                    selectStatus={element.selectStatus}
                                    clubList={newClubList}
                                    setHomeClubListStatus={this.props.setHomeClubListStatus}
                                    numSelectingStatusTrue={newNumSelectingStatsTrue}
                                    determinToSearch={this.props.determinToSearch}
                                >
                                </SelectClubElement>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default SelectClub