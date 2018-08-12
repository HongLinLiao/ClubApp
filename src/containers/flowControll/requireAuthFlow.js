import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '../../components/common/Spinner'
import { setLoadingState } from '../../actions/CommonAction'




export default function(ComposedComponent) {

  class Authentication extends React.Component {

    handleAuth = (user, routeName) => {

      console.log(routeName)

      if(user) {

        this.props.navigation.navigate('AppRouter')

      }

    }

    componentWillMount() {
      const { user, navigation, loading, dispatch } = this.props

      // if(loading) dispatch(setLoadingState(false)) //取消等待狀態

      this.handleAuth(user, navigation.state.routeName)
    }


    componentWillUpdate(nextProps) {
      const { user, navigation } = nextProps
      this.handleAuth(user, navigation.state.routeName)
    }

    render() {
      return !this.props.loading ? <ComposedComponent {...this.props} /> : <Spinner />
    }
  }

  const mapStateToProps = ({ authReducer, commonReducer }) => ({
     user: authReducer.user,
     loading: commonReducer.loading,
    });

  return connect(mapStateToProps)(Authentication)
}