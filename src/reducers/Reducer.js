import { combineReducers } from 'redux'
import { authReducer } from './AuthReducer'


export const rootReducer = combineReducers({
    authReducer //驗證資料狀態
})