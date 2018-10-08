import { connect } from 'react-redux'
import Analysis from '../../components/analysis/Analysis'


const mapStateToProps = ({ userReducer }) => ({
    user: userReducer.user
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(Analysis)