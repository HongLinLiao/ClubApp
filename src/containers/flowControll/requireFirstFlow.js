import React from 'react';
import { connect } from 'react-redux';


export default function(ComposedComponent) {

  class FirstLoginDirection extends React.Component {

    handleAuth = (user, firstLogin, routeName) => {

      console.log(routeName)

      if(!firstLogin) { //不是第一次登入

        this.props.navigation.navigate('MainRouter') //導向App頁面

      }
    }

    componentWillMount() {
      const { user, firstLogin, navigation } = this.props
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

  const mapStateToProps = ({ authReducer }) => ({
     user: authReducer.user,
     firstLogin: authReducer.firstLogin
    });

  return connect(mapStateToProps)(FirstLoginDirection)
}