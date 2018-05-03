import { combineReducers } from 'redux'


const user = (state = {}, action) => {
  switch (action.type) {
    case 'AUTHENTICATED':
        return Object.assign(state, {
            token: action.payload.token,
            setting: action.payload.setting,
            user: action.payload.user
        })
    case 'SIGNIN_ERROR':
        return Object.assign(state, {
            error: action.payload.error
        })
    case 'MY_PROFILE':
        return Object.assign(state, {
            setting: action.payload.myprofile.setting,
            user: action.payload.myprofile.user
        })
    case 'SIGNUP_ERROR':
        return Object.assign(state, {
            signupError: action.payload.error
        })
    case 'KEEP_PROFILE':
        return Object.assign(state, {
            keepProfile: action.payload.keepProfile
        })
    default:
      return state
  }
}


export default combineReducers({
    user
})
