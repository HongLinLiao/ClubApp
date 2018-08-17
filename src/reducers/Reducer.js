import { combineReducers } from 'redux'
import { userReducer } from './UserReducer'
import { commonReducer } from './CommonReducer'


export const rootReducer = combineReducers({
    userReducer, //使用者驗證相關狀態
    commonReducer //通用相關狀態
})