
import _ from "lodash"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

import { all, call, put, takeEvery, takeLatest, take, select, delay } from 'redux-saga/effects'
import {
    numberOfFriendLists,
    signin_error,
    languages,
    authenticated,
    friendGroups,
    updateFriendLists,
    friends,
    myprofile,
    signupEror,
    searchNewFriend,
    chatLists,
    selectedChatInfo,
    chat,
    onSticker,
    sticker,
    onIsShowActionChat,
    inviteFriends,
    selectChat,
    memberInGroup,
    optionMessage,
    enterContact,
    enterSplash,
    onFetchMessageLists,
    sharedMessage,
    onUpdateGroupLists,
    keepProfile,
    isLoading,
    lastMessageID,
    onFetchFriendInGroup,
    isShowUserProfile,
    isShowGroupSetting
} from './actions'
import {
    fetchMyProfile,
    fetchChatLists,
    fetchFriendListCount,
    fetchFriendGroups,
    fetchFriendLists,
    fetchFriendProfile,
    loginApi,
    fetchLanguage,
    updateProfileImage,
    addFavoriteApi,
    removeFavoriteApi,
    createNewAccount,
    fetchChat,
    fetchSticker,
    muteChat,
    hideChat,
    blockChat,
    deleteChat,
    setAsSeen,
    unblockChat,
    unmuteChat,
    fetchInviteFriend,
    inviteFriendToGroup,
    fetchChatInfo,
    removeFriendFromGroup,
    exitTheGroup,
    friendInGroup,
    updateProfile,
    inviteFriendToGroupWithOpenCase,
    createNewRoom,
    updatePictureAuth,
    fetchKeepProfile,
    logoutApi
} from './api'
import {
    getFriendGroups,
    getFriends,
    getNumberOfGroup,
    getRangeOfGroup,
    getFilterFriend,
    navigateSelector,
    getMessageLists,
    getChatInfo,
    getSelectedActionChatRoomId,
    getChatLists,
    getUserInfo,
    getInviteFriendLists,
    getMemberInGroup,
    getOptionMessageLists,
    getSharedMessage,
    getKeepProfile
} from './selectors'

function* start_app() {
    while (true) {
        yield take('START_APP')
        try {
            const { data: { data }} = yield call(fetchLanguage)
            yield put(languages(data))

            yield put(enterContact())
        } catch (e) {
            console.log('err' ,e)
        }
    }
}

const fetchNumberOfGroup = (filter) => {
    return Promise.all([
        fetchFriendListCount('favorite', filter),
        fetchFriendListCount('group', filter),
        fetchFriendListCount('department', filter),
        fetchFriendListCount('other', filter)
    ]).then((res) => {
        return {
            favorite: res[0].data.total_number,
            group: res[1].data.total_number,
            department: res[2].data.total_number,
            other: res[3].data.total_number
        }
    })
}

const combinedFriends = (groups, rangeFriendLists, filter) => {
    let promises = []
    _.forEach(groups, (group) => {
        const promise = fetchFriendLists(group, rangeFriendLists[group], 0, filter)
        promises.push(promise)
    })
    return Promise.all(promises).then(values => {
        let friends = {}
        _.forEach(groups, (group, index) => {
            friends[group] = _.get(values[index], 'data.data', [])
        })
        return friends
    })
}

function* enterContactSaga() {
    while (true) {
        yield take('ENTER_CONTACT')

        try {
            const filter = ''
            // fetch groups
            const resFetchFriendGroups = yield call(fetchFriendGroups)
            const friendGroupsData = _.get(resFetchFriendGroups, 'data.data')
            yield put(friendGroups(friendGroupsData))

            // fetch initial friend lists
            const rangeFriendLists = yield select(getRangeOfGroup)
            const friendsData = yield call(combinedFriends, friendGroupsData, rangeFriendLists, filter)
            yield put(friends(friendsData))

            // fetch user profile
            const resFetchMyProfile = yield call(fetchMyProfile)
            yield put(myprofile(_.get(resFetchMyProfile, 'data.data')))

            // fetch chat lists
            const resFetchChatLists = yield call(fetchChatLists)
            yield put(chatLists(_.get(resFetchChatLists, 'data.data', [])))

            // fetch number of friend lists
            const numberOfFriend = yield call(fetchNumberOfGroup, filter)
            yield put(numberOfFriendLists(numberOfFriend))

            // const user_id = yield call(getAuth)

            // start socket after enter the contact
            // start_socket(user_id)

            const resFetchKeepProfile = yield call(fetchKeepProfile)
            yield put(keepProfile(_.get(resFetchKeepProfile, 'data.data', '')))

            // fetch sticker
            yield put(onSticker())
        } catch (e) {
            console.log('err' ,e)
        }
    }
}

function* onStickerSaga() {
    while (true) {
        yield take('ON_STICKER')
        try {
            const stickerData = yield call(fetchSticker)

            const sticker_base_url = _.get(stickerData, 'data.sticker_base_url')
            const collections = _.get(stickerData, 'data.data', [])

            const collectionsLists = collections.map((c, index) => {
                const stickerLists = c.sticker_file_list.split(',')
                const stickerObj = stickerLists.map((s) => {
                    return {
                        url: `${sticker_base_url}/${c.sticker_folder}/${s}`,
                        file: s,
                        path: `${c.sticker_folder}/${s}`
                    }
                })
                return {
                    sticker_collection_id: c.sticker_collection_id,
                    collection_image_url: `${sticker_base_url}/${c.sticker_folder}/${stickerLists[0]}`,
                    sticker_collection_name: c.sticker_collection_name,
                    sticker_lists: stickerObj,
                    key: index
                }
            })

            yield put(sticker(collectionsLists))
        } catch (err) {
            console.log('[onStickerSaga] ', err)
        }
    }
}

function* loadmoreSaga() {
    while (true) {
        const { payload: { group } } = yield take('ON_LOAD_MORE')
        try {
            //get all friends
            const friendsData = yield select(getFriends)
            const groupFriends = _.get(friendsData, group, [])

            // get filter
            const filter = yield select(getFilterFriend)

            // get range for each group
            const rangeFriendLists = yield select(getRangeOfGroup)
            const resFetchFriendLists = yield call(fetchFriendLists, group, rangeFriendLists[group], groupFriends.length, filter)

            // add new list in old list
            friendsData[group] = friendsData[group].concat( _.get(resFetchFriendLists, 'data.data', []))

            // updatet
            yield put(friends(friendsData))
        } catch (err) {
            console.log('[loadmoreSaga] ', err)
        }
    }
}

function* onSearchFriendSaga() {
    while (true) {
        const { payload: { filter }} = yield take('ON_SEARCH_FRIEND')
        try {
            const groups = yield select(getFriendGroups)

            // fetch initial friend lists
            const rangeFriendLists = yield select(getRangeOfGroup)
            const friendsData = yield call(combinedFriends, groups, rangeFriendLists, filter)
            yield put(friends(friendsData))

            // fetch number of friend lists
            const numberOfFriend = yield call(fetchNumberOfGroup, filter)
            yield put(numberOfFriendLists(numberOfFriend))
        } catch (e) {
            console.log('err' ,e)
        }
    }
}

function* addFavoriteSaga() {
    while (true) {
        const { payload: { user_id, friend_user_id, friend_data }} = yield take('ADD_FAVORITE')
        try {
            // get all friend
            const friendsData = yield select(getFriends)

            // add friend to favorite group
            friendsData.favorite.push(friend_data)

            // update in store
            yield put(friends(friendsData))

            // get number of group
            const numberOfGroup = yield select(getNumberOfGroup)
            numberOfGroup.favorite = numberOfGroup.favorite + 1

            // update number of friend
            yield put(numberOfFriendLists(numberOfGroup))

            // call api to update in server
            yield call(addFavoriteApi, user_id, friend_user_id)
        } catch (e) {
            console.log('err' ,e)
        }
    }
}

function* removeFavoriteSaga() {
    while (true) {
        const { payload: { user_id, friend_user_id }} = yield take('REMOVE_FAVORITE')
        
        try {
            // get all friend
            const friendsData = yield select(getFriends)

            // get favorite friend
            const favorite = _.get(friendsData, 'favorite', [])

            // filter for removing friend in favorite
            const newFavorite = favorite.filter((friend) => {
                return friend.friend_user_id != friend_user_id
            })

            friendsData.favorite = newFavorite

            // get number of group
            const numberOfGroup = yield select(getNumberOfGroup)
            numberOfGroup.favorite = numberOfGroup.favorite - 1

            // update number of friend
            yield put(numberOfFriendLists(numberOfGroup))

            // update in store
            yield put(friends(friendsData))

            // call api to update in server
            yield call(removeFavoriteApi, user_id, friend_user_id)
        } catch (e) {
            console.log('err' ,e)
        }
    }
}

function* updateProfileSaga() {
    while (true) {
        const { payload: { profile, pic_base64 }} = yield take('ON_UPDATE_PROFILE')
        try {
            const userInfo = yield select(getUserInfo)
            
            // update profile with api
            yield call(updateProfile, profile)

            // update picture profile
            if(!_.get(pic_base64, 'profile_pic_base64', false)) {
                delete pic_base64.profile_pic_base64
            }
            if(!_.get(pic_base64, 'wall_pic_base64', false)) {
                delete pic_base64.wall_pic_base64
            }

            if(_.get(pic_base64, 'profile_pic_base64', false) || _.get(pic_base64, 'wall_pic_base64', false)) {
                yield call(updatePictureAuth, pic_base64)
            }

            // fetch user profile
            const resFetchMyProfile = yield call(fetchMyProfile)
            yield put(myprofile(_.get(resFetchMyProfile, 'data.data')))

            // hide user profile modal after save
            yield put(isShowUserProfile(false))
        } catch (err) {
            console.log('[updateProfileSaga] ', err)
        }
    }
}

function* onUpdateGroupSettingSaga() {
    while (true) {
        const { payload: { data }} = yield take('ON_UPDATE_GROUP_SETTING')
        
        try {
            // update in friend lists
            const friendLists = yield select(getFriends)
            friendLists.group = friendLists.group.map((friend) => {
                if(data.chat_room_id == friend.chat_room_id) {
                    friend.wall_pic_url = data.wall_pic_url
                    friend.profile_pic_url = data.profile_pic_url
                    friend.c_hn = data.hn
                    friend.c_patient_name = data.patient_name
                    friend.c_description = data.description
                    friend.display_name = data.display_name
                }
                return friend
            })

            yield put(friends(friendLists))

            // update in chat lists
            const chatListsFromStore = yield select(getChatLists)
            const chatListsForSaveToStore = chatListsFromStore.map((chat) => {
                if(data.chat_room_id == chat.chat_room_id) {
                    chat.friend_wall_pic_url = data.wall_pic_url
                    chat.profile_pic_url = data.profile_pic_url
                    chat.hn = data.hn
                    chat.patient_name = data.patient_name
                    chat.description = data.description
                    chat.display_name = data.display_name
                }
                return chat
            })

            yield put(chatLists(chatListsForSaveToStore))

            // hide group setting modal after save
            yield put(isShowGroupSetting(false))
        } catch (err) {
            console.log('[onUpdateGroupSettingSaga] ', err)
        }
    }
}

function* selectChatSaga() {
    while (true) {
        const { payload: { chatInfo }} = yield take('SELECT_CHAT')
        // fetch chat list from userID
        try {
            
            if(!chatInfo.chat_room_id) {
                continue
            }

            const resFetchChat = yield call(fetchChat, chatInfo.chat_room_id, '', '', '')
            const chatData = _.get(resFetchChat, 'data.data', []).reverse()

            // store last id
            yield put(lastMessageID(chatData.length != 0? chatData[0].chat_message_id : '0'))

            // store data in store redux
            yield put(selectedChatInfo(chatInfo))
            yield put(chat(chatData))

            // subscribe socket io
            // emit_subscribe(chatInfo.chat_room_id)
            
            // call set as setAsSeen
            if(chatData.length != 0) {
                // yield call(setAsSeen, chatInfo.chat_room_id)
                // emit_as_seen(chatInfo.chat_room_id)
            }
        } catch (err) {
            console.log('[selectChatSaga] ', err)
        }
    }
}

function* onFetchMessageListsSaga() {
    while (true) {
        const { payload: { filterMessage }} = yield take('ON_FETCH_MESSAGE_LISTS')
        try {
            const chatInfo = yield select(getChatInfo)

            const resFetchChat = yield call(fetchChat, chatInfo.chat_room_id, '', '', filterMessage)

            const chatData = _.get(resFetchChat, 'data.data', []).reverse()

            // store data in store redux
            yield put(chat(chatData))
        } catch (err) {
            console.log('[onFetchMessageListsSaga] ', err)
        }
    }
}

function* onLoadMoreMessageListsSaga() {
    while (true) {
        try {
            const { payload: { filterMessage }} = yield take('ON_LOAD_MORE_MESSAGE_LIST')

            const chatInfo = yield select(getChatInfo)
            const messageLists = yield select(getMessageLists)

            const topChatMessageId = _.get(messageLists[0], 'chat_message_id', '0')

            if(topChatMessageId != 0) {
                console.log(topChatMessageId)
                const resFetchChat = yield call(fetchChat, chatInfo.chat_room_id, topChatMessageId, '', filterMessage)
                const chatData = _.get(resFetchChat, 'data.data', []).reverse()

                const newMessageLists = [
                    ...chatData,
                    ...messageLists
                ]

                yield put(chat(newMessageLists))
            }
        } catch (err) {
            console.log('[onLoadMoreMessageListsSaga] ', err)
        }
    }
}

function* onFetchFriendInGroupSaga() {
    while (true) {
        const { payload: { chat_id } } = yield take('ON_FETCH_FRIEND_IN_GROUP')
        try {
            // clear friend in member from store
            yield put(memberInGroup([]))

            const resFriendInGroup = yield call(friendInGroup, chat_id, 0, 9999, '')

            yield put(memberInGroup(_.get(resFriendInGroup, 'data.data', [])))
        } catch (err) {
            console.log('[onFetchFriendInGroupSaga] ', err)
        }
    }
}

function* onMuteChatSaga() {
    while (true) {
        yield take('ON_MUTE_CHAT')        
        try {
            const chatInfo = yield select(getChatInfo)

            // mute chat in server
            const resMuteChat = yield call(muteChat, chatInfo.chat_room_id)
            console.log(`[onMuteChatSaga] mute chat room id ${chatInfo.chat_room_id}`)
        } catch (err) {
            console.log('[onMuteChatSaga] ', err)
        }
    }
}

function* onUnmuteChatSaga() {
    while (true) {
        yield take('ON_UNMUTE_CHAT')
        try {
            const chatInfo = yield select(getChatInfo)

            // unmute chat in server
            const resUnMuteChat = yield call(unmuteChat, chatInfo.chat_room_id)
            console.log(`[onUnMuteChatSaga] unmute chat room id ${chatInfo.chat_room_id}`)
        } catch (err) {
            console.log('[onUnmuteChatSaga] ', err)
        }
    }
}

function* onHideChatSaga() {
    while (true) {
        try {
            yield take('ON_HIDE_CHAT')
            const chatInfo = yield select(getChatInfo)

            // hide chat in server
            const resHideChat = yield call(hideChat, chatInfo.chat_room_id)

            console.log(`[onHideChatSaga] hide chat room id ${chatInfo.chat_room_id}`)

            const chatListsFromStore = yield select(getChatLists)

            // filter chat that hide from chat list
            const chatListsFilterHide = chatListsFromStore.filter((chat) => {
                return chatInfo.chat_room_id != chat.chat_room_id
            })

            // update in store
            yield put(chatLists(chatListsFilterHide))
        } catch (err) {
            console.log('[onHideChatSaga] ', err)
        }
    }
}

function* onBlockChatSaga() {
    while (true) {
        yield take('ON_BLOCK_CHAT')
        try {
            const chatInfo = yield select(getChatInfo)

            // block chat in server
            const resBlockChat = yield call(blockChat, chatInfo.chat_room_id)

            console.log(`[onBlockChatSaga] block chat room id ${chatInfo.chat_room_id}`)
        } catch (err) {
            console.log('[onBlockChatSaga] ', err)
        }
    }
}

function* onUnblockChatSaga() {
    while (true) {
        yield take('ON_UNBLOCK_CHAT')
        try {
            const chatInfo = yield select(getChatInfo)

            // unblock chat in server
            const resUnBlockChat = yield call(unblockChat, chatInfo.chat_room_id)

            console.log(`[onUnblockChatSaga] unblock chat room id ${chatInfo.chat_room_id}`)
        } catch (err) {
            console.log('[onUnblockChatSaga] ', err)
        }
    }
}

function* onDeleteChatSaga() {
    while (true) {
        yield take('ON_DELETE_CHAT')
        try {
            const chatInfo = yield select(getChatInfo)

            // delete chat in server
            const resDeleteChat = yield call(deleteChat, chatInfo.chat_room_id)

            console.log(`[onDeleteChatSaga] delete chat room id ${chatInfo.chat_room_id}`)

            // delete chat in redux
            const chatListsFromStore = yield select(getChatLists)
            const chatListsFilterHide = chatListsFromStore.filter((chat) => {
                return chatInfo.chat_room_id != chat.chat_room_id
            })
            
            // clear chat that we delete in chat list
            yield put(chatLists(chatListsFilterHide))
            
            // clear message in message list
            yield put(chat([]))
        } catch (err) {
            console.log('[onDeleteChatSaga] ', err)
        }
    }
}

function* onExitTheGroupSaga() {
    while (true) {
        const { payload: { chat_room_id }} = yield take('ON_EXIT_THE_GROUP')
        try {
            yield call(exitTheGroup, chat_room_id)

            const userInfo = yield select(getUserInfo)

            // delete chat in redux
            const chatListsFromStore = yield select(getChatLists)
            const chatListsFilter = chatListsFromStore.filter((chat) => {
                return chat_room_id!= chat.chat_room_id
            })
            
            // clear chat that we delete in chat list
            yield put(chatLists(chatListsFilter))

            // update friend groups
            yield put(onUpdateGroupLists())
        } catch (err) {
            console.log('[onExitTheGroupSaga] ', err)
        }
    }
}

function* onUpdateGroupListsSaga() {
    while (true) {
        yield take('ON_UPDATE_GROUP_LISTS')
        try {
            const friendLists = yield select(getFriends)
            const friendInGroup = yield call(fetchFriendLists, 'group', friendLists.group.length, 0, '')
            friendLists.group = _.get(friendInGroup, 'data.data', [])

            yield put(friends(friendLists))

            // fetch number of friend lists
            const numberOfFriend = yield call(fetchNumberOfGroup, '')
            yield put(numberOfFriendLists(numberOfFriend))
        } catch (err) {
            console.log('[onUpdateGroupListsSaga] ', err)
        }
    }
}

function* onClickChatSaga() {
    while (true) {
        const { payload: { chatInfo }} = yield take('ON_CLICK_CHAT')
        try {
            if(!chatInfo.chat_room_id) {
                const resCreateNewRoom = yield call(createNewRoom, chatInfo.friend_user_id)
                chatInfo.chat_room_id = resCreateNewRoom.data.data.chat_room_id
            }
            const navigate = yield select(navigateSelector)
            navigate.push('/chat/' + chatInfo.chat_room_id)
        } catch (err) {
            console.log('[onClickChatSaga] ', err)
        }
    }
}

function* removeFriendFromGroupSaga() {
    while (true) {
        const { payload: { chat_room_id, friend_user_id, is_from_member_modal }} = yield take('REMOVE_FRIEND_FROM_GROUP')
        try {
            const resRemoveFriendFromGroup = yield call(removeFriendFromGroup, chat_room_id, friend_user_id)
            const userInfo = yield select(getUserInfo)
            const chatInfo = yield select(getChatInfo)

            if(chatInfo.chat_room_type == 'G' || chatInfo.chat_room_type == 'C') {
                if (!is_from_member_modal) {
                    const inviteFriendLists = yield select(getInviteFriendLists)
                    inviteFriendLists.data.forEach((friend, index) => {
                        if(inviteFriendLists.data[index].friend_user_id == friend_user_id) {
                            inviteFriendLists.data[index].status_quote = 'Tap to invite'
                            inviteFriendLists.data[index].invited = false
                        }
                    })
                    yield put(inviteFriends(inviteFriendLists))
                } else {
                    const member = yield select(getMemberInGroup)
                    member.data = member.data.filter((friend) => {
                        return friend.friend_user_id != friend_user_id
                    })
                    yield put(memberInGroup(member))
                }

                // update own
                // emit_update_friend_chat_list(userInfo.user_id, userInfo.user_id)
                // update chat list
                // emit_update_friend_chat_list(userInfo.user_id, friend_user_id)

                const split = chatInfo.friend_user_ids.split(',')
                const filter = split.filter((id) => id != friend_user_id)
                const join = filter.join(',')
                const newFriendUserIds = join

                chatInfo.friend_user_ids = newFriendUserIds
                yield put(selectedChatInfo(chatInfo))

                // update friend_user_ids in friend lists
                const friendLists = yield select(getFriends)
                friendLists.group = friendLists.group.map((friend) => {
                    if(chatInfo.chat_room_id == friend.chat_room_id) {
                        friend.friend_user_ids = newFriendUserIds
                    }
                    return friend
                })

                yield put(friends(friendLists))

                // update friend_user_ids in chat lists
                const chatListsFromStore = yield select(getChatLists)
                const chatListsForSaveToStore = chatListsFromStore.map((chat) => {
                    if(chatInfo.chat_room_id == chat.chat_room_id) {
                        chat.friend_user_ids = newFriendUserIds
                    }
                    return chat
                })

                yield put(chatLists(chatListsForSaveToStore))
            }
        } catch (err) {
            console.log('[removeFriendFromGroupSaga] ', err)
        }
    }
}

function* onFetchInviteFriendSaga() {
    while (true) {
        const { payload: { inviteFriendSeachText } } = yield take('ON_FETCH_INVITE_FRIEND')
        try {
            const chatInfo = yield select(getChatInfo)
            const userInfo = yield select(getUserInfo)

            const resFetchInviteFriend = yield call(fetchInviteFriend, chatInfo.chat_room_id, userInfo.user_id, 0, 30, inviteFriendSeachText)

            yield put(inviteFriends(_.get(resFetchInviteFriend, 'data.data', [])))
        } catch (err) {
            console.log('[onFetchInviteFriendSaga] ', err)
        }
    }
}

function* loadMoreInviteFriendsSaga() {
    while (true) {
        const { payload : { page, inviteFriendSeachText } } = yield take('LOAD_MORE_INVITE_FRIENDS')
        try {
            const chatInfo = yield select(getChatInfo)
            const userInfo = yield select(getUserInfo)
            const inviteFriendsFromStore = yield select(getInviteFriendLists)
            const resFetchInviteFriend = yield call(fetchInviteFriend, chatInfo.chat_room_id, userInfo.user_id, inviteFriendsFromStore.data.length, 30, inviteFriendSeachText)
            const allInviteFriendLists = inviteFriendsFromStore.data.concat(_.get(resFetchInviteFriend, 'data.data.data', []))
            inviteFriendsFromStore.data = allInviteFriendLists
            yield put(inviteFriends(inviteFriendsFromStore))
        } catch (err) {
            console.log('[loadMoreInviteFriendsSaga] ', err)
        }
    }
}

function* inviteFriendToGroupSaga() {
    while (true) {
        const { payload: { chat_room_id, friend_user_id }} = yield take('ON_INVITE_FRIEND_TO_GROUP')
        try {
            const userInfo = yield select(getUserInfo)
            const inviteFriendLists = yield select(getInviteFriendLists)

            const resInviteFriendToGroup = yield call(inviteFriendToGroup, chat_room_id, friend_user_id)
            const newChatRoomId = resInviteFriendToGroup.data.data.new_chat_room_id

            const resFetchChatInfo = yield call(fetchChatInfo, newChatRoomId)

            const chatInfo = yield select(getChatInfo)

            if(chatInfo.chat_room_type == 'G' || chatInfo.chat_room_type == 'C') {
                inviteFriendLists.data.forEach((friend, index) => {
                    if(inviteFriendLists.data[index].friend_user_id == friend_user_id) {
                        inviteFriendLists.data[index].status_quote = 'Invited. (Tap to remove)'
                        inviteFriendLists.data[index].invited = true
                    }
                })
                yield put(inviteFriends(inviteFriendLists))

                // update own
                // emit_update_friend_chat_list(userInfo.user_id, userInfo.user_id)

                // update chat list
                // emit_update_friend_chat_list(userInfo.user_id, friend_user_id)

                const split = chatInfo.friend_user_ids.split(',')
                split.push(`${friend_user_id}`)
                const newFriendUserIds = split.join(',')

                chatInfo.friend_user_ids = newFriendUserIds
                yield put(selectedChatInfo(chatInfo))

                // update friend_user_ids in friend lists
                const friendLists = yield select(getFriends)
                friendLists.group = friendLists.group.map((friend) => {
                    if(chatInfo.chat_room_id == friend.chat_room_id) {
                        friend.friend_user_ids = newFriendUserIds
                    }
                    return friend
                })

                yield put(friends(friendLists))

                // update friend_user_ids in chat lists
                const chatListsFromStore = yield select(getChatLists)
                const chatListsForSaveToStore = chatListsFromStore.map((chat) => {
                    if(chatInfo.chat_room_id == chat.chat_room_id) {
                        chat.friend_user_ids = newFriendUserIds
                    }
                    return chat
                })

                yield put(chatLists(chatListsForSaveToStore))
            } else {
                const cInfo = resFetchChatInfo.data.data
                cInfo.friend_user_ids = `${cInfo.friend_user_ids},${chatInfo.friend_user_id}`

                // add owner friend to new group room
                yield call(inviteFriendToGroup, newChatRoomId, chatInfo.friend_user_id)

                // update own
                // emit_update_friend_chat_list(userInfo.user_id, userInfo.user_id)

                // update chat list
                // emit_update_friend_chat_list(userInfo.user_id, friend_user_id)
                // emit_update_friend_chat_list(userInfo.user_id, chatInfo.friend_user_id)

                // update friend groups
                yield put(onUpdateGroupLists())

                // redirect to a created chat
                const navigate = yield select(navigateSelector)
                navigate.push('/chat/' + cInfo.chat_room_id)
            }

            continue
        } catch (err) {
            console.log('[inviteFriendToGroupSaga] ', err)
        }
    }
}

function* onInviteFriendToGroupWithOpenCaseSaga() {
    while (true) {
        const { payload: { chat_room_id, selected_invite_friend_user_id, selected_option_message_id }} = yield take('ON_INVITE_FRIEND_TO_GROUP_WITH_OPEN_CASE')
        try {
            const userInfo = yield select(getUserInfo)
            const chatInfo = yield select(getChatInfo)

            const resInviteFriendToGroup = yield call(inviteFriendToGroupWithOpenCase, {
                chat_room_id: chat_room_id,
                user_id: userInfo.user_id,
                friend_user_id: chatInfo.friend_user_id,
                chat_message_ids: selected_option_message_id
            })
            const newChatRoomId = resInviteFriendToGroup.data.new_chat_room_id
            const displayName = resInviteFriendToGroup.data.room_name

            // add owner friend to new group room
            yield call(inviteFriendToGroup, newChatRoomId, selected_invite_friend_user_id)

            const resFetchChatInfo = yield call(fetchChatInfo, newChatRoomId)
            const cInfo = resFetchChatInfo.data.data

            // redirect to a created chat
            const navigate = yield select(navigateSelector)
            navigate.push('/chat/' + cInfo.chat_room_id)

            // update own
            // emit_update_friend_chat_list(userInfo.user_id, userInfo.user_id)

            // update chat list
            // emit_update_friend_chat_list(userInfo.user_id, selected_invite_friend_user_id)
            // emit_update_friend_chat_list(userInfo.user_id, chatInfo.friend_user_id)

            // update friend groups
            yield put(onUpdateGroupLists())
            continue
        } catch (err) {
            console.log('[onInviteFriendToGroupWithOpenCaseSaga] ', err)
        }
    }
}


function* signin() {
    while (true) {
        const { payload: { username, password } } = yield take('SIGNIN')
        try {
            yield put(isLoading(true))
            if(username && password) {
                const res_loginApi = yield call(loginApi, username, password)
    
                console.log(' finsihed sign in ')
                console.log(res_loginApi)
    
                if(_.get(res_loginApi.data, 'error')) {
                    yield put(signin_error(res_loginApi.data.error))
                    yield put(isLoading(false))
                    continue
                }
                const { data: { token, setting, user } } = res_loginApi
                yield put(authenticated(token, setting))
                yield put(signin_error(''))

                localStorage.setItem('user_id', user.user_id)

                location.reload()
            }
            yield put(signin_error('กรุณาระบุ Username เเละ Password'))
            yield put(isLoading(false))
        } catch (err) {
            console.log('[signin] ', err)
        }
        
    }
}

// single entry point to start all Sagas at once
export default function* rootSaga() {
    yield all([
        start_app(),
        enterContactSaga(),
        loadmoreSaga(),
        onSearchFriendSaga(),
        addFavoriteSaga(),
        removeFavoriteSaga(),
        updateProfileSaga(),
        onUpdateGroupSettingSaga(),
        onStickerSaga(),
        selectChatSaga(),
        onFetchMessageListsSaga(),
        onLoadMoreMessageListsSaga(),
        onFetchFriendInGroupSaga(),
        onMuteChatSaga(),
        onHideChatSaga(),
        onBlockChatSaga(),
        onDeleteChatSaga(),
        onUnblockChatSaga(),
        onUnmuteChatSaga(),
        onUpdateGroupListsSaga(),
        onExitTheGroupSaga(),
        onClickChatSaga(),
        removeFriendFromGroupSaga(),
        onFetchInviteFriendSaga(),
        loadMoreInviteFriendsSaga(),
        inviteFriendToGroupSaga(),
        onInviteFriendToGroupWithOpenCaseSaga(),
        signin()
    ])
}


