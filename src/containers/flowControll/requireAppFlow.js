import React from 'react';
import { connect } from 'react-redux';


export default function(ComposedComponent) {

  class AppDirection extends React.Component {
    
    handleAuth = (user, askVerify, firstLogin, routeName) => {

      console.log(routeName)

      if(user) {

        if(firstLogin) { //第一次登入

          this.props.navigation.navigate('IntroductionRouter')
          return
        }

        if(!user.emailVerified && askVerify) { //使用者沒有驗證+重複詢問才導向
          
          this.props.navigation.navigate('UserAuthRouter')
          
        }

      }
      
      else {
        this.props.navigation.navigate('AuthRouter')
      }
    }

    componentWillMount() {
      const { user, askVerify, firstLogin, navigation } = this.props
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

  const mapStateToProps = ({ authReducer }) => ({ 
    user: authReducer.user, 
    askVerify: authReducer.askVerify,
    firstLogin: authReducer.firstLogin
  });

  return connect(mapStateToProps)(AppDirection)
}