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

const system = (state = {
    isShowFriendLists: {
        favorite: false,
        group: false,
        department: false,
        other: false
    }
}, action) => {
    switch (action.type) {
        case 'LANGUAGES':
            return Object.assign(state, {
                languages: action.payload.languages
            })
        case 'IS_SHOW_FRIEND_LISTS':
            return Object.assign(state, {
                isShowFriendLists: action.payload.isShowFriendLists
            })
        case 'NAVIGATE':
            return Object.assign(state, {
                navigate: action.payload.navigate
            })
        case 'SHARED_MESSAGE':
            return Object.assign(state, {
                sharedMessage: action.payload.sharedMessage
            })
        case 'IS_LOADING':
            return Object.assign(state, {
                isLoading: action.payload.loading
            })
        case 'IS_SHOW_USER_PROFILE':
            return Object.assign(state, {
                isShowUserProfile: action.payload.isShowUserProfile
            })
        case 'IS_SHOW_GROUP_SETTING':
            return Object.assign(state, {
                isShowGroupSetting: action.payload.isShowGroupSetting
            })
        case 'CALL_DIALOG':
            return Object.assign(state, {
                isShowCallDialog: action.payload.isShowCallDialog
            }, {
                callData: {
                    chat_id: action.payload.chat_id,
                    sender: action.payload.sender, 
                    receiver: action.payload.receiver, 
                    photo: action.payload.photo, 
                    name: action.payload.name,
                    isRinging: action.payload.isRinging
                }
            })
        default:
            return state
    }
}

const friend = (state = {
    rangeFriendLists: {
        favorite: 50,
        group: 50,
        department: 50,
        other: 50
    },
    filter: ''
}, action) => {
    switch (action.type) {
        case 'FRIEND_GROUPS':
            return Object.assign(state, {
                friendGroups: action.payload.friendGroups
            })
        case 'FRIENDS':
            return Object.assign(state, {
                friends: action.payload.friends
            })
        case 'NUMBER_OF_FRIEND_LISTS':
            return Object.assign(state, {
                numberOfFriendLists: action.payload.numberOfFriendLists
            })
        case 'ON_SEARCH_FRIEND':
            return Object.assign(state, {
                filter: action.payload.filter
            })
        case 'SELECTED_FRIEND':
            return Object.assign(state, {
                selectedFriend: action.payload.selectedFriend
            })
        default:
            return state
    }
}

const chat = (state = {
    isShowActionChat: false,
    selectedChatRoomId: ''
}, action) => {
    switch (action.type) {
        case 'CHAT_LISTS':
            return Object.assign(state, {
                chatLists: action.payload.chatLists
            })
        case 'CHAT':
            return Object.assign(state, {
                chat: action.payload.chat
            })
        case 'SELECTED_CHAT_INFO':
            return Object.assign(state, {
                chatInfo: action.payload.chatInfo
            })
        case 'STICKER':
            return Object.assign(state, {
                sticker: action.payload.sticker
            })
        case 'IS_SHOW_ACTION_CHAT':
            return Object.assign(state, {
                isShowActionChat: action.payload.isShowActionChat,
                selectedChatRoomId: action.payload.selectedChatRoomId
            })
        case 'INVITE_FRIENDS':
            return Object.assign(state, {
                inviteFriends: action.payload.friends
            })
        case 'MEMBER_IN_GROUP':
            return Object.assign(state, {
                memberInGroup: action.payload.friends
            })
        case 'OPTION_MESSAGE':
            return Object.assign(state, {
                optionMessage: action.payload.message
            })
        case 'LAST_MESSAGE_ID':
            return Object.assign(state, {
                lastMessageID: action.payload.lastMessageID
            })
        case 'IS_SHOW_SEARCH_BAR':
            let chat = {}
            if(!action.payload.isShow) {
                chat = {
                    chat: []
                }
            }
            return Object.assign(state, {
                isShowSearchBar: action.payload.isShow,
            }, chat)
        default:
            return state
    }
}

export default combineReducers({
    user,
    system,
    friend,
    chat
})
