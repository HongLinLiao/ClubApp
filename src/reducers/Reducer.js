import { combineReducers } from 'redux'
import { authReducer } from './AuthReducer'
import { commonReducer } from './CommonReducer'


export const rootReducer = combineReducers({
    authReducer, //使用者驗證相關狀態
    commonReducer //通用相關狀態
})