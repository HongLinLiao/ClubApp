import React from 'react';
import { connect } from 'react-redux';
import { setLoadingState } from '../../actions/CommonAction'
import { Spinner } from '../../components/common/Spinner'


export default function(ComposedComponent) {

  class AppDirection extends React.Component {
    
    handleAuth = (user, askVerify, firstLogin, routeName) => {

      console.log(routeName)

      if(user) {
      }     
      else {
        this.props.navigation.navigate('AuthRouter')
      }
    }

    componentWillMount() {
      const { user, askVerify, firstLogin, loading, dispatch, navigation } = this.props

      if(loading) dispatch(setLoadingState(false)) //停止載入頁面

      this.handleAuth(user, askVerify, firstLogin, navigation.state.routeName)
    }

    componentWillUpdate(nextProps) {
      const { user, askVerify, firstLogin, navigation } = nextProps
      this.handleAuth(user, askVerify, firstLogin, navigation.state.routeName)
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const mapStateToProps = ({ userReducer, commonReducer }) => ({ 
    user: userReducer.user, 
    askVerify: userReducer.askVerify,
    firstLogin: userReducer.firstLogin,
  });



  return connect(mapStateToProps)(AppDirection)
}