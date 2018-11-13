import React from 'react'
import { connect } from 'react-redux'
import { setHomeClubListStatus } from '../../modules/Home'
import SelectClub from '../../components/home/SelectClub'

class Selecting extends React.Component {
    render() {
        return (
            <SelectClub
                clubList={this.props.clubList}
                navigation={this.props.navigation}
                numSelectingStatusTrue={this.props.numSelectingStatusTrue}
                setHomeClubListStatus={this.props.setHomeClubListStatus}
                homeReload={this.props.navigation.state.params.homeReload}
            >
            </SelectClub>
        );
    }
}

const mapStateToProps = ({ homeReducer }) => ({
    clubList: homeReducer.clubList,
    numSelectingStatusTrue: homeReducer.numSelectingStatusTrue
})

const mapDispatchToProps = {
    //更改首頁篩選
    setHomeClubListStatus,
}

export default connect(mapStateToProps, mapDispatchToProps)(Selecting);