import React from 'react';
import { connect } from 'react-redux';




export default function(ComposedComponent) {

  class Authentication extends React.Component {

    handleAuth = (user, emailVerified, routeName) => {

      console.log(routeName)

      if(user) {
        if(emailVerified) {
          this.props.navigation.navigate('App')
        }
        else {
          this.props.navigation.navigate('EmailVerify', {email: user.email})
        }
      }
    }

    componentWillMount() {
      const { user, emailVerified, navigation } = this.props
      this.handleAuth(user, emailVerified, navigation.state.routeName)
    }

    componentWillUpdate(nextProps) {
      const { user, emailVerified, navigation } = nextProps
      this.handleAuth(user, emailVerified, navigation.state.routeName)
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const mapStateToProps = ({ authReducer }) => ({
     user: authReducer.user,
     emailVerified: authReducer.emailVerified 
    });

  return connect(mapStateToProps)(Authentication)
}