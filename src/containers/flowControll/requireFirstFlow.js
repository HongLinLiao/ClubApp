import React from 'react';
import { connect } from 'react-redux';
import { setLoadingState } from '../../actions/CommonAction'
import { Spinner } from '../../components/common/Spinner'


export default function(ComposedComponent) {

  class FirstLoginDirection extends React.Component {

    handleAuth = (user, firstLogin, routeName) => {

      console.log(routeName)

      if(!firstLogin) { //不是第一次登入

        this.props.navigation.navigate('MainRouter') //導向App頁面

      }
    }

    componentWillMount() {
      const { user, firstLogin, loading, dispatch, navigation } = this.props

      if(loading) dispatch(setLoadingState(false)) //停止載入頁面

      this.handleAuth(user, firstLogin, navigation.state.routeName)
    }

    componentWillUpdate(nextProps) {
      const { user, firstLogin, navigation } = nextProps
      this.handleAuth(user, firstLogin, navigation.state.routeName)
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const mapStateToProps = ({ userReducer, commonReducer }) => ({
    user: userReducer.user,
    firstLogin: userReducer.firstLogin,
    });

  return connect(mapStateToProps)(FirstLoginDirection)
}