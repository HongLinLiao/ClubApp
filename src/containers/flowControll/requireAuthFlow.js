import React from 'react';
import { connect } from 'react-redux';


export default function(ComposedComponent) {

  class Authentication extends React.Component {

    handleAuth = (user, firstLogin, routeName) => {

      console.log(routeName)

      if(user) {

        this.props.navigation.navigate('AppRouter')

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

  return connect(mapStateToProps)(Authentication)
}