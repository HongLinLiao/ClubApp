import React from 'react';
import { connect } from 'react-redux';


export default function(ComposedComponent) {

  class Authentication extends React.Component {

    handleAuth = (user, routeName) => {

      console.log(routeName)

      if(user) {

        this.props.navigation.navigate('App')

      }
    }

    componentWillMount() {
      const { user, navigation } = this.props
      this.handleAuth(user, navigation.state.routeName)
    }

    componentWillUpdate(nextProps) {
      const { user, navigation } = nextProps
      this.handleAuth(user, navigation.state.routeName)
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const mapStateToProps = ({ authReducer }) => ({
     user: authReducer.user,
    });

  return connect(mapStateToProps)(Authentication)
}