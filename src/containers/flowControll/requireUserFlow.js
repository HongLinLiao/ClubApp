import React from 'react';
import { Alert } from 'react-native'
import { connect } from 'react-redux';
import { setLoadingState } from '../../actions/CommonAction'
import { Spinner } from '../../components/common/Spinner'


export default function(ComposedComponent) {

  class UserDirection extends React.Component {

    handleAuth = (user, askVerify, routeName) => {

      console.log(routeName)

      if(user) {

        if(user.emailVerified || !askVerify) { //使用者有驗證+沒有重複詢問才導向

          this.props.navigation.navigate('FirstLoginRouter') //導向App頁面
            
        }

      }
      else {
        this.props.navigation.navigate('AuthRouter')
      }
    }

    componentWillMount() {
      const { user, askVerify, loading, navigation, dispatch } = this.props

      if(loading) dispatch(setLoadingState(false)) //停止載入頁面

      this.handleAuth(user, askVerify, navigation.state.routeName)
    }

    componentWillUpdate(nextProps) {
      const { user, askVerify, navigation, dispatch } = nextProps
      
      this.handleAuth(user, askVerify, navigation.state.routeName)
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const mapStateToProps = ({ userReducer, commonReducer }) => ({
    user: userReducer.user,
    askVerify: userReducer.askVerify,
  });

  return connect(mapStateToProps)(UserDirection)
}