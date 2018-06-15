export const signin = (username, password) => ({
    type: 'SIGNIN',
    payload: {
        username,
        password
    }
  })
  
export const signin_error = (error) => ({
    type: 'SIGNIN_ERROR',
    payload: {
        error
    }
})
  
export const signupEror = (error) => ({
    type: 'SIGNUP_ERROR',
    payload: {
        error
    }
})

export const signup = (id, password, confirm_password, display_name, mobile_no, language_id) => ({
    type: 'SIGNUP',
    payload: {
        id,
        password,
        confirm_password,
        display_name,
        mobile_no,
        language_id
    }
})

export const authenticated = (token, setting, user) => ({
    type: 'AUTHENTICATED',
    payload: {
        token,
        setting,
        user
    }
})

export const friendGroups = (friendGroups) => ({
    type: 'FRIEND_GROUPS',
    payload: {
        friendGroups
    }
})

export const start_app = () => ({
    type: 'START_APP'
})

export const friends = (friends) => ({
    type: 'FRIENDS',
    payload: {
        friends
    }
})

export const enterContact = () => ({
    type: 'ENTER_CONTACT'
})

export const myprofile = (data) => ({
    type: 'MY_PROFILE',
    payload: {
        myprofile: data
    }
})

export const languages = (languages) => ({
    type: 'LANGUAGES',
    payload: {
        languages
    }
})

export const removeFavorite = (user_id, friend_user_id) => ({
    type: 'REMOVE_FAVORITE',
    payload: {
        user_id,
        friend_user_id
    }
})

export const addFavorite = (user_id, friend_user_id, friend_data) => ({
    type: 'ADD_FAVORITE',
    payload: {
        user_id,
        friend_user_id,
        friend_data
    }
})

export const searchNewFriend = (userID) => ({
    type: 'SEARCH_NEW_FRIEND',
    payload: {
        userID
    }
})

export const chatLists = (chatLists) => ({
    type: 'CHAT_LISTS',
    payload: {
        chatLists
    }
})

export const showOrHideFriendLists = (isShowFriendLists) => ({
    type: 'IS_SHOW_FRIEND_LISTS',
    payload: {
        isShowFriendLists
    }
})

export const numberOfFriendLists = (numberOfFriendLists) => ({
    type: 'NUMBER_OF_FRIEND_LISTS',
    payload: {
        numberOfFriendLists
    }
})

export const updateFriendLists = () => ({
    type: 'UPDATE_FRIEND_LISTS'
})

export const onLoadMore = (group) => ({
    type: 'ON_LOAD_MORE',
    payload: {
        group: group
    }
})

export const isLoading = (loading) => ({
    type: 'IS_LOADING',
    payload: {
        loading
    }
})

export const selectedGroup = (friend) => ({
    type: 'SELECTED_GROUP',
    payload: {
        friend
    }
})

export const onSearchFriend = (filter) => ({
    type: 'ON_SEARCH_FRIEND',
    payload: {
        filter
    }
})

export const navigate = (navigate) => ({
    type: 'NAVIGATE',
    payload: {
        navigate
    }
})

export const logout = () => ({
    type: 'LOGOUT'
})

export const selectChat = (chatInfo) => ({
    type: 'SELECT_CHAT',
    payload: {
        chatInfo
    }
})

export const chat = (chat) => ({
    type: 'CHAT',
    payload: {
        chat
    }
})

export const selectedChatInfo = (chatInfo) => ({
    type: 'SELECTED_CHAT_INFO',
    payload: {
        chatInfo
    }
})

export const onSticker = () => ({
    type: 'ON_STICKER'
})

export const sticker = (stickerData) => ({
    type: 'STICKER',
    payload: {
        sticker: stickerData
    }
})

export const onLoadMoreMessageLists = (filterMessage) => ({
    type: 'ON_LOAD_MORE_MESSAGE_LIST',
    payload: {
        filterMessage
    }
})

export const onIsShowActionChat = (isShowActionChat, selectedChatRoomId) => ({
    type: 'IS_SHOW_ACTION_CHAT',
    payload: {
        isShowActionChat,
        selectedChatRoomId
    }
})
  
export const onMuteChat = () => ({
    type: 'ON_MUTE_CHAT'
})

export const onUnmuteChat = () => ({
    type: 'ON_UNMUTE_CHAT'
})

export const onHideChat = () => ({
    type: 'ON_HIDE_CHAT'
})

export const onBlockChat = () => ({
    type: 'ON_BLOCK_CHAT'
})

export const onUnblockChat = () => ({
    type: 'ON_UNBLOCK_CHAT'
})

export const onDeleteChat = () => ({
    type: 'ON_DELETE_CHAT'
})

export const onFetchInviteFriend = (inviteFriendSeachText) => ({
    type: 'ON_FETCH_INVITE_FRIEND',
    payload: {
        inviteFriendSeachText
    }
})

export const inviteFriends = (friends) => ({
    type: 'INVITE_FRIENDS',
    payload: {
        friends
    }
})

export const loadMoreInviteFriends = (page, inviteFriendSeachText) => ({
    type: 'LOAD_MORE_INVITE_FRIENDS',
    payload: {
        page,
        inviteFriendSeachText
    }
})
  
export const onInviteFriendToGroup = (chat_room_id, friend_user_id, friend_info) => ({
    type: 'ON_INVITE_FRIEND_TO_GROUP',
    payload: {
        chat_room_id,
        friend_user_id,
        friend_info
    }
})

export const onRemoveFriendFromGroup = (chat_room_id, friend_user_id, is_from_member_modal) => ({
    type: 'REMOVE_FRIEND_FROM_GROUP',
    payload: {
        chat_room_id,
        friend_user_id,
        is_from_member_modal
    }
})

export const onExitTheGroup = (chat_room_id) => ({
    type: 'ON_EXIT_THE_GROUP',
    payload: {
        chat_room_id
    }
})

export const onFetchFriendInGroup = (chat_id) => ({
    type: 'ON_FETCH_FRIEND_IN_GROUP',
    payload: {
    chat_id
    }
})

export const memberInGroup = (friends) => ({
    type: 'MEMBER_IN_GROUP',
    payload: {
        friends
    }
})

export const onLoadMoreMemberInGroup = (query) => ({
    type: 'ON_LOAD_MORE_MEMBER_IN_GROUP',
    payload: {
        query
    }
})

export const onEnterOptionMessage = () => ({
    type: 'ON_ENTER_OPTION_MESSAGE'
})

export const onLoadMoreOptionMessage = () => ({
    type: 'ON_LOAD_MORE_OPTION_MESSAGE'
})

export const optionMessage = (message) => ({
    type: 'OPTION_MESSAGE',
    payload: {
        message
    }
})

export const onUpdateProfile = (profile, pic_base64) => ({
    type: 'ON_UPDATE_PROFILE',
    payload: {
        profile,
        pic_base64
    }
})

export const onInviteFriendToGroupWithOpenCase = (chat_room_id, selected_invite_friend_user_id, selected_option_message_id) => ({
    type: 'ON_INVITE_FRIEND_TO_GROUP_WITH_OPEN_CASE',
    payload: {
        chat_room_id,
        selected_invite_friend_user_id,
        selected_option_message_id
    }
})

export const enterSplash = () => ({
    type: 'ENTER_SPLASH'
})

export const onFetchMessageLists = (filterMessage) => ({
    type: 'ON_FETCH_MESSAGE_LISTS',
    payload: {
        filterMessage
    }
})

export const isShowSearchBar = (isShow) => ({
    type: 'IS_SHOW_SEARCH_BAR',
    payload: {
        isShow
    }
})

export const onRecieveShareMessage = (sharedMsg) => ({
    type: 'ON_RECIEVE_SHARE_MESSAGE',
    payload: {
        sharedMsg
    }
})

export const sharedMessage = (txt) => ({
    type: 'SHARED_MESSAGE',
    payload: {
        sharedMessage: txt
    }
})

export const onForward = (data) => ({
    type: 'ON_FORWARD',
    payload: {
        data
    }
})

export const onUpdateGroupLists = () => ({
    type: 'ON_UPDATE_GROUP_LISTS'
})

export const onUpdateGroupSetting = (data) => ({
    type: 'ON_UPDATE_GROUP_SETTING',
    payload: {
        data
    }
})

export const onSelectKeep = () => ({
    type: 'ON_SELECT_KEEP'
})

export const keepProfile = (profile) => ({
    type: 'KEEP_PROFILE',
    payload: {
        keepProfile: profile
    }
})

export const lastMessageID = (lastID) => ({
    type: 'LAST_MESSAGE_ID',
    payload: {
        lastMessageID: lastID
    }
})

export const onClickChat = (chatInfo) => ({
    type: 'ON_CLICK_CHAT',
    payload: {
    chatInfo
    }
})

export const isShowUserProfile = (_isShowUserProfile) => ({
    type: 'IS_SHOW_USER_PROFILE',
    payload: {
    isShowUserProfile: _isShowUserProfile
    }
})

export const isShowGroupSetting = (_isShowGroupSetting) => ({
    type: 'IS_SHOW_GROUP_SETTING',
    payload: {
    isShowGroupSetting: _isShowGroupSetting
    }
})

export const selectedFriend = (_selectedFriend) => ({
    type: 'SELECTED_FRIEND',
    payload: {
    selectedFriend: _selectedFriend
    }
})

export const callDialog = (isShowCallDialog, chat_id, sender, receiver, photo, name) => ({
    type: 'CALL_DIALOG',
    payload: {
        isShowCallDialog, 
        chat_id,
        sender, 
        receiver, 
        photo, 
        name
    }
})

export const incomingCall = (sender, receiver, sender_photo, sender_name) => ({
    type: 'INCOMING_CALL',
    payload: {
        sender,
        receiver,
        sender_photo,
        sender_name
    }
})

export const hangup = () => ({
    type: 'HANGUP'
})

export const startCall = (sender, receiver, user_photo, user_name) => ({
    type: 'START_CALL',
    payload: {
        sender, 
        receiver, 
        user_photo, 
        user_name
    }
})