import React from 'react';
import { connect } from 'react-redux';




export default function(ComposedComponent) {

  class Authentication extends React.Component {
    componentWillMount() {
      console.log(this.props.user)
      if(this.props.user) {
        // this.props.navigation.navigate('App')
      }
    }
    componentWillUpdate(nextProps) {
      console.log(nextProps.user)
      if(nextProps.user) {
        // this.props.navigation.navigate('App')
      }
    }
    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const mapStateToProps = state => ({ user: state.userReducer.user });

  return connect(mapStateToProps)(Authentication)
}