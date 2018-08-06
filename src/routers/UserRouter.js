import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import requireUserFlow from '../containers/flowControll/requireUserFlow'
import EmailVerifiedPage from '../containers/auth/EmailVerifiedPage'



export default createSwitchNavigator({
  EmailVerified:  requireUserFlow(EmailVerifiedPage)
})


