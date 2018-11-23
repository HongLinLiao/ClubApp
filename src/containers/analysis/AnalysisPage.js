import { connect } from 'react-redux'
import Analysis from '../../components/analysis/Analysis'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub,
    joinClubs: clubReducer.joinClubs,
    likeClubs: clubReducer.likeClubs,
    currentCid: clubReducer.currentCid,
})

const mapDispatchToProps = {
    
}


export default connect(mapStateToProps, mapDispatchToProps)(Analysis)