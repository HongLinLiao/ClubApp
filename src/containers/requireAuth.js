import React from 'react';
import { connect } from 'react-redux';


export default function(ComposedComponent) {

  class Authentication extends React.Component {
    
    handleAuth = (user, askVerify, emailVerified, routeName) => {

      console.log(routeName)

      if(user) {   
        if(!emailVerified && askVerify) { //使用者沒有驗證+重複詢問才導向
          if(routeName != 'EmailVerify') { //不是驗證頁面
            this.props.navigation.navigate('EmailVerify')
          }
        }
        else {
          this.props.navigation.navigate('App')
        } 
      }
      else {
        this.props.navigation.navigate('Auth')
      }
    }

    componentWillMount() {
      const { user, askVerify, emailVerified, navigation } = this.props
      this.handleAuth(user, askVerify, emailVerified, navigation.state.routeName)
    }

    componentWillUpdate(nextProps) {
      const { user, askVerify, emailVerified, navigation } = nextProps
      this.handleAuth(user, askVerify, emailVerified, navigation.state.routeName)
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const mapStateToProps = ({ authReducer }) => ({ 
    user: authReducer.user, 
    askVerify: authReducer.askVerify,
    emailVerified: authReducer.emailVerified
  });

  return connect(mapStateToProps)(Authentication)
}