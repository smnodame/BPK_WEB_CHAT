import _ from 'lodash'
import $ from 'jquery'
import React, { Component } from 'react'

import Friend from '../Friend'

import { sendTheMessage, createNewRoom } from '../../redux/api'
import { enterContacts, removeFavorite, addFavorite, isShowGroupSetting, selectedFriend, showOrHideFriendLists, onLoadMore, isShowUserProfile, onSearchFriend, selectChat, onSelectKeep, navigate, onClickChat } from '../../redux/actions.js'
import { store } from '../../redux'
import { Modal, Button } from 'react-bootstrap'
import {
    emit_update_friend_chat_list,
    emit_unsubscribe,
    emit_message
} from '../../redux/socket.js'

class ForwardModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            friends: {
                favorite: [],
                other: [],
                group: [],
                department: []
            },
            numberOfFriendLists: {
                favorite: 0,
                other: 0,
                group: 0,
                department: 0,
            },
            is_show_favorite: true,
            is_show_group: true
        }
    }
    
    componentDidMount() {
    }

    toggleFavorite = () => {
        this.setState({
            is_show_favorite: !this.state.is_show_favorite
        })
    }

    toggleGroup = () => {
        this.setState({
            is_show_group: !this.state.is_show_group
        })
    }

    toggleDepartment = () => {
        this.setState({
            is_show_department: !this.state.is_show_department
        })
    }

    toggleOther = () => {
        this.setState({
            is_show_other: !this.state.is_show_other
        })
    }

    componentWillReceiveProps() {
        if(_.get(this.props, 'data.friend.friends')) {
            this.setState({
                friends: this.props.data.friend.friends,
                numberOfFriendLists: this.props.data.friend.numberOfFriendLists
            })
        }
        if(_.get(this.props, 'data.user.user')) {
            this.setState({
                user: this.props.data.user.user
            })
        }
    }

    loadmore = (group) => {
        store.dispatch(onLoadMore(group))
    }

    renderFriend = (friends) => {
        return friends.map((friend, key) => {
            return (
                <div className="box invite-friend-container" key={key} onClick={() => { this._pushMessage(friend) }}>
                    <Friend image={friend.profile_pic_url} name={friend.display_name} status={friend.status_quote} />
                </div>
            )
        })
    }

    _pushMessage = async (chatInfo) => {
        // create new chat room if not exist before
        if(!chatInfo.chat_room_id) {
            const resCreateNewRoom = await createNewRoom(chatInfo.friend_user_id)
            chatInfo.chat_room_id = resCreateNewRoom.data.data.chat_room_id
        }

        await sendTheMessage(chatInfo.chat_room_id, '', '', '', '', this.props.selectedMessageId)
        
        // update message for everyone in group
        emit_message('forward the message', chatInfo.chat_room_id)

        // update our own
        emit_update_friend_chat_list(this.state.user.user_id, this.state.user.user_id)

        // update every friends in group
        if(chatInfo.chat_room_type == 'G' || chatInfo.chat_room_type == 'C') {
            const friend_user_ids = chatInfo.friend_user_ids.split(',')
            friend_user_ids.forEach((friend_user_id) => {
                emit_update_friend_chat_list(this.state.user.user_id, friend_user_id)
            })
        } else {
            emit_update_friend_chat_list(this.state.user.user_id, chatInfo.friend_user_id)
        }

        this._handlerAfterFinish()
    }

    _handlerAfterFinish = () => {
        this.props.onHide()
        this.props.onSuccess()
    }

    render = () => {
        return (
            <div className="static-modal">
            <Modal show={this.props.show} onHide={() => {
                    this.props.onHide()
                }}>
                <Modal.Header style={{ backgroundColor: '#eee' }}>
                    <Modal.Title>FORWARD MESSAGE TO</Modal.Title>
                </Modal.Header>
                <div>
                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Favorites ({this.state.numberOfFriendLists.favorite})</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_favorite? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleFavorite()}></i>
                            <i className={this.state.is_show_favorite? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleFavorite()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_favorite? 'show': 'hide'}>
                        {
                            this.renderFriend(this.state.friends.favorite)
                        }
                        <div onClick={() => this.loadmore('favorite')}  className={this.state.numberOfFriendLists.favorite > this.state.friends.favorite.length? 'row message-previous': 'hide'}>
                            <div className="col-sm-12 previous">
                                <a name="20">
                                    LOAD MORE
                                </a>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Groups ({this.state.numberOfFriendLists.group})</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_group? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleGroup()}></i>
                            <i className={this.state.is_show_group? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleGroup()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_group? 'show': 'hide'}>
                        {
                            this.renderFriend(this.state.friends.group)
                        }
                        <div onClick={() => this.loadmore('group')} className={this.state.numberOfFriendLists.group > this.state.friends.group.length? 'row message-previous': 'hide'}>
                            <div className="col-sm-12 previous">
                                <a name="20">
                                    LOAD MORE
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Departments ({this.state.numberOfFriendLists.department})</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_department? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleDepartment()}></i>
                            <i className={this.state.is_show_department? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleDepartment()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_department? 'show': 'hide'}>
                        {
                            this.renderFriend(this.state.friends.department)
                        }
                        <div onClick={() => this.loadmore('department')} className={this.state.numberOfFriendLists.department > this.state.friends.department.length? 'row message-previous': 'hide'}>
                            <div className="col-sm-12 previous">
                                <a name="20">
                                    LOAD MORE
                                </a>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Others ({this.state.numberOfFriendLists.other})</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_other? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleOther()}></i>
                            <i className={this.state.is_show_other? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleOther()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_other? 'show': 'hide'}>
                        {
                            this.renderFriend(this.state.friends.other)
                        }
                        <div onClick={() => this.loadmore('other')} className={this.state.numberOfFriendLists.other > this.state.friends.other.length? 'row message-previous': 'hide'}>
                            <div className="col-sm-12 previous">
                                <a name="20">
                                    LOAD MORE
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
        )
    }
}

export default ForwardModal