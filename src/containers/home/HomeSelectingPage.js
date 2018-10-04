import React from 'react'
import { connect } from 'react-redux'
import { setHomeClubListStatus ,getHomePostReload ,determinToSearch } from '../../modules/Home'
import SelectClub from '../../components/home/SelectClub'

class Selecting extends React.Component {
    render() {
        return (
            <SelectClub
                clubList={this.props.clubList}
                numSelectingStatusTrue={this.props.numSelectingStatusTrue}
                setHomeClubListStatus={this.props.setHomeClubListStatus}
                homeReload={this.props.navigation.state.params}
                getHomePostReload={this.props.getHomePostReload}
                determinToSearch={this.props.determinToSearch}
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
    //首頁更新
    getHomePostReload,
    //判斷首頁
    determinToSearch,
}

export default connect(mapStateToProps, mapDispatchToProps)(Selecting);