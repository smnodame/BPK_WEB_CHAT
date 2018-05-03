export const getFriendGroups = state => {
    return state.friend.friendGroups
}

export const getFriends = (state) => {
    return state.friend.friends
}

export const getNumberOfGroup = state => {
    return state.friend.numberOfFriendLists
}

export const getRangeOfGroup = state => {
    return state.friend.rangeFriendLists
}

export const getFilterFriend = state => {
    return state.friend.filter
}

export const navigateSelector = state => {
    return state.system.navigate
}

export const getMessageLists = state => {
    return state.chat.chat
}

export const getChatInfo = state => {
    return state.chat.chatInfo
}

export const getSelectedActionChatRoomId = state => {
    return state.chat.selectedChatRoomId
}

export const getChatLists = state => {
    return state.chat.chatLists
}

export const getUserInfo = state => {
    return state.user.user
}

export const getInviteFriendLists = state => {
    return state.chat.inviteFriends
}

export const getMemberInGroup = state => {
    return state.chat.memberInGroup
}

export const getOptionMessageLists = state => {
    return state.chat.optionMessage
}

export const getSharedMessage = state => {
    return state.system.sharedMessage
}

export const getKeepProfile = state => {
    return state.user.keepProfile
}
