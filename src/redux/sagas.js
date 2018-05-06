
import _ from "lodash"
import axios from 'axios'

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
    lastMessageID
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
        } catch (err) {
            console.log('[updateProfileSaga] ', err)
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
        updateProfileSaga()
    ])
}


