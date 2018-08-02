import React from 'react';
import { connect } from 'react-redux';


export default function(ComposedComponent) {

  class AppDirection extends React.Component {
    
    handleAuth = (user, askVerify, routeName) => {

      console.log(routeName)

      if(user) {

        if(!user.emailVerified && askVerify) { //使用者沒有驗證+重複詢問才導向
      
          this.props.navigation.navigate('EmailVerify', {email: user.email})
          
        }

      }
      else {
        this.props.navigation.navigate('Auth')
      }
    }

    componentWillMount() {
      const { user, askVerify, navigation } = this.props
      this.handleAuth(user, askVerify, navigation.state.routeName)
    }

    componentWillUpdate(nextProps) {
      const { user, askVerify, navigation } = nextProps
      this.handleAuth(user, askVerify, navigation.state.routeName)
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const mapStateToProps = ({ authReducer }) => ({ 
    user: authReducer.user, 
    askVerify: authReducer.askVerify,
  });

  return connect(mapStateToProps)(AppDirection)
}