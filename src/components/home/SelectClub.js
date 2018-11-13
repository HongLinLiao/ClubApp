import React from 'react'
import { ScrollView, Text, View, RefreshControl } from 'react-native'
import SelectClubElement from './SelectClubElement'
import styles from '../../styles/home/Selecting'
import Overlayer from '../common/Overlayer'

class SelectClub extends React.Component {

    state = {
        //遮罩
        loading: false,
        //重整
        refreshing: false,
    }

    //過門
    selectOverLayor = () => {
        this.setState({ loading: !this.state.loading })
    }

    //重整動畫
    onRefresh = async () => {
        try {
            const { homeReload, clubList } = this.props;
            this.setState({ refreshing: true, loading: !this.state.loading });
            this.setState({ refreshing: false });
            await homeReload(clubList);
            this.setState({ loading: !this.state.loading });
        }
        catch (error) {
            console.log(error.toString());
        }
    }

    render() {
        const newClubList = { ...this.props.clubList };
        const newNumSelectingStatsTrue = this.props.numSelectingStatusTrue;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                            tintColor='#f6b456'
                        />
                    }
                >
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
                                    homeReload={this.props.homeReload}
                                    parentOverLayor={this.selectOverLayor}
                                >
                                </SelectClubElement>
                            ))
                        }

                    </View>
                </ScrollView>
                {this.state.loading ? <Overlayer /> : null}
            </View>
        );
    }
}

export default SelectClub