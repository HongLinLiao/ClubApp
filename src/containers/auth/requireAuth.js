import React from 'react';
import { connect } from 'react-redux';




export default function(ComposedComponent) {

  class Authentication extends React.Component {
    componentWillMount() {
      if(this.props.user) {
        
      }
    }
    componentWillUpdate(nextProps) {
      if(nextProps.user) {

      }
    }
    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const mapStateToProps = state => ({ user: state.userReducer.user });

  return connect(mapStateToProps)(Authentication)
}