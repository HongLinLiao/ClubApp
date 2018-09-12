import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import SelectClubElement from './SelectClubElement'

class SelectClub extends React.Component {

    render() {
        const newClubList = { ...this.props.clubList };
        const newNumSelectingStatsTrue = this.props.numSelectingStatusTrue;
        return (
            <ScrollView>
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
            </ScrollView>
        );
    }
}

export default SelectClub