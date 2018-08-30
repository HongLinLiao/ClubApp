import {
	SIGN_IN_REQUEST,
	SIGN_IN_SUCCESS,
	SIGN_IN_FAILURE,
	SIGN_UP_REQUEST,
	SIGN_UP_SUCCESS,
	SIGN_UP_FAILURE,
	SIGN_WITH_FACEBOOK_REQUEST,
	SIGN_WITH_FACEBOOK_SUCCESS,
	SIGN_WITH_FACEBOOK_FAILURE,
	SIGN_WITH_GOOGLE_REQUEST,
	SIGN_WITH_GOOGLE_SUCCESS,
	SIGN_WITH_GOOGLE_FAILURE,
	SEND_VERIFY_EMAIL_SUCCESS,
	SEND_VERIFY_EMAIL_FAILURE,
	SEND_RESET_MAIL_SUCCESS,
	SEND_RESET_MAIL_FAILURE,
	SET_VERIFY_EMAIL_AGAIN,
	SET_USER_PASSWORD,
	SIGN_OUT_FAILURE,
} from '../actions/AuthAction'

import {
	UPDATE_USER_STATE_SUCCESS,
	UPDATE_USER_STATE_FAILURE,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_FALIURE,
	UPDATE_USER_PROFILE,
	UPDATE_USER_PROFILE_FALIURE,
	SET_USER_FIRSTLOGIN,
	CLEAR_USER_STATE
} from '../actions/UserAction'

import {
	CREATE_CLUB
} from '../actions/ClubAction'


const initialState = {
	user: null, //使用者(信箱+暱稱＋大頭貼＋信箱驗證＋uid)
	password: null, //密碼
	message: null, //錯誤訊息
	askVerify: true, //提醒驗證信箱
	success: null, //執行狀態
	firstLogin: true, //是否第一次登入
	loginType: null, //登入類型
	aboutMe: null, //自介
	joinClub: null, //加入社團
	likeClub: null, //收藏社團
}

export const userReducer = (state = initialState, action) => {
	switch (action.type) {
		//登入
		case SIGN_IN_REQUEST:
			return {
				...state,
				success: true,
				rememberMe: action.rememberMe
			}
		case SIGN_IN_SUCCESS:
			return {
				...state,
				user: action.userData.user,
				password: action.userData.password,
				firstLogin: action.userData.firstLogin,
				loginType: action.userData.loginType,
				aboutMe: action.userData.aboutMe,
				joinClub: action.userData.joinClub,
				likeClub: action.userData.likeClub
			}
		case SIGN_IN_FAILURE:
			return {
				...initialState,
				success: false,
				message: action.message
			}

		//註冊
		case SIGN_UP_REQUEST:
			return {
				...state,
				success: true,
			}
		case SIGN_UP_SUCCESS:
			return {
				...state,
				user: action.userData.user,
				password: action.userData.password,
				firstLogin: action.userData.firstLogin,
				loginType: action.userData.loginType,
				aboutMe: action.userData.aboutMe,
				joinClub: action.userData.joinClub,
				likeClub: action.userData.likeClub
			}
		case SIGN_UP_FAILURE:
			return {
				...initialState,
				statis: false,
				message: action.message
			}

		//facebook登入
		case SIGN_WITH_FACEBOOK_REQUEST:
			return {
				...state,
				success: true,
			}
		case SIGN_WITH_FACEBOOK_SUCCESS:
			return {
				...state,
				user: action.userData.user,
				password: action.userData.password,
				firstLogin: action.userData.firstLogin,
				loginType: action.userData.loginType,
				aboutMe: action.userData.aboutMe,
				joinClub: action.userData.joinClub,
				likeClub: action.userData.likeClub
			}
		case SIGN_WITH_FACEBOOK_FAILURE:
			return {
				...initialState,
				success: false,
				message: action.message
			}

		//google登入
		case SIGN_WITH_GOOGLE_REQUEST:
			return {
				...state,
				success: true
			}
		case SIGN_WITH_GOOGLE_SUCCESS:
			return {
				...state,
				user: action.userData.user,
				password: action.userData.password,
				firstLogin: action.userData.firstLogin,
				loginType: action.userData.loginType,
				aboutMe: action.userData.aboutMe,
				joinClub: action.userData.joinClub,
				likeClub: action.userData.likeClub
			}
		case SIGN_WITH_GOOGLE_FAILURE:
			return {
				...initialState,
				success: false,
				message: action.message
			}
			
		//驗證信
		case SEND_VERIFY_EMAIL_SUCCESS:
			return {
				...state,
				success: true
			}
		case SEND_VERIFY_EMAIL_FAILURE:
			return {
				...state,
				message: action.message,
				success: false
			}

		//發送重設信	
		case SEND_RESET_MAIL_SUCCESS:
			return {
				...state,
				success: true
			}
		case SEND_RESET_MAIL_FAILURE:
			return {
				...state,
				success: false,
				message: action.message
			}
		case SET_VERIFY_EMAIL_AGAIN:
			return {
				...state,
				askVerify: action.askAgain 
			}
		
		//登出
		case SIGN_OUT_FAILURE:
			return {
				...state,
				success: false,
				message: action.message
			}
		case CLEAR_USER_STATE:
			return initialState
			
		//使用者狀態
		case UPDATE_USER_STATE_SUCCESS:
			return {
				...state,
				success: true,
				user: action.userData.user,
				password: action.userData.password,
				firstLogin: action.userData.firstLogin,
				loginType: action.userData.loginType,
				aboutMe: action.userData.aboutMe,
				joinClub: action.userData.joinClub,
				likeClub: action.userData.likeClub
			}
		case UPDATE_USER_STATE_FAILURE:
			return {
				...initialState,
				status: false,
				message: action.message
			}
		case UPDATE_USER_SUCCESS:
			return {
				...state,
				success: true,
				user: action.user,
			}
		case UPDATE_USER_FALIURE:
			return {
				...state,
				success: false,
				message: action.message
			}
		case UPDATE_USER_PROFILE:
			return {
				...state,
				success: true,
				user: action.user,
				aboutMe: action.profile.aboutMe,
			}
		case UPDATE_USER_PROFILE_FALIURE:
			return {
				...state,
				success: false,
				message: action.message
			}
		case SET_USER_FIRSTLOGIN:
			return {
				...state,
				firstLogin: action.IsFirstLogin
			}
		case SET_USER_PASSWORD:
			return {
				...state,
				password: action.newPassword
			}

		case CREATE_CLUB:
			let newJoinClub = {...state.joinClub}
			newJoinClub[action.clubInfo.cid] = true
			return {
				...state,
				joinClub: newJoinClub
			}
		default:
			return state
	}
}