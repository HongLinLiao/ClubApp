import { connect } from 'react-redux'
import AnalysisDetails from '../../components/analysis/AnalysisDetails'


const mapStateToProps = ({ userReducer, clubReducer }) => ({
    user: userReducer.user,
    joinClub: userReducer.joinClub,
    likeClub: userReducer.likeClub,
    joinClubs: clubReducer.joinClubs,
    likeClubs: clubReducer.likeClubs,
})

const mapDispatchToProps = {
    
}


export default connect(mapStateToProps, mapDispatchToProps)(AnalysisDetails)