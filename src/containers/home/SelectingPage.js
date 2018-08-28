import { connect } from 'react-redux'
import { setClubStatus } from '../../modules/Home'
import SelectClub from '../../components/home/SelectClub'

const mapStateToProps = ({ homeReducer }) => ({
    clubList: homeReducer.clubList
})

const mapDispatchToProps = {
    setClubStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectClub);