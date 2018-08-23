import { combineReducers } from 'redux'
import { userReducer } from './UserReducer'
import { commonReducer } from './CommonReducer'
import { homeReducer } from './HomeReducer'
import { settingReducer} from './SettingReducer'


export const rootReducer = combineReducers({
    userReducer, //使用者驗證相關狀態
    commonReducer, //通用相關狀態
    homeReducer, //首頁貼文資料
    settingReducer, //app相關設定
})