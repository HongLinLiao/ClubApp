import React from 'react'
import {} from '../../modules/App'
import {
    connect
} from 'react-redux';
import SearchPlace from '../../components/club/SearchPlace'


const mapStateToProps = ({userReducer, clubReducer}) => ({
})

const mapDispatchToProps = {
    
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchPlace);