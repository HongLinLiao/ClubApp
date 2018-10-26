import React from 'react'
import { connect } from 'react-redux';
import MemberManage from '../../components/club/MemberManage'
import { } from '../../modules/Club'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    joinClubs: clubReducer.joinClubs,
    likeClubs: clubReducer.likeClubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(MemberManage);