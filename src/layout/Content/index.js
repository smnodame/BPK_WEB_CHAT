import _ from 'lodash'
import $ from 'jquery'
import React from 'react'
import moment from 'moment'
import download from 'downloadjs'
import Friend from '../../components/Friend'

import Recorder from 'react-recorder'
import { ReactMic } from 'react-mic'
import { Modal, Button } from 'react-bootstrap'
import AudioPlayer from '../../components/AudioPlayer'
import Checkbox from '../../components/Checkbox'
import ForwardModal from '../../components/ForwardModal'
import ReactChatView from 'react-chatview'
import { store } from '../../redux'

import {
    onLoadMoreMessageLists,
    onFetchInviteFriend,
    loadMoreInviteFriends,
    onInviteFriendToGroup,
    onRemoveFriendFromGroup,
    onExitTheGroup,
    onFetchFriendInGroup,
    onLoadMoreMemberInGroup,
    onEnterOptionMessage,
    onLoadMoreOptionMessage,
    onInviteFriendToGroupWithOpenCase,
    onFetchMessageLists,
    isShowSearchBar,
    onForward,
    inviteFriends,
    chat,
    selectChat,
    onMuteChat, 
    onHideChat, 
    onBlockChat, 
    onDeleteChat, 
    onUnblockChat, 
    onUnmuteChat,
    isLoading
} from '../../redux/actions'
import {sendTheMessage, fetchFriendProfile, saveInKeep, sendFileMessage, fetchChatInfo } from '../../redux/api'
import {
    emit_update_friend_chat_list,
    emit_unsubscribe,
    emit_message
} from '../../redux/socket.js'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            resolve(reader.result)
        }
        reader.onerror = function (error) {
            resolve(error)
        }
    })
    
}

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sticker: [],
            collectionKeySelected: 0,
            currentTime: 0.0,
            roundRecording: 0,
            timer: 0,
            member: [],
            inviteFriends: [],
            inviteFilter: '',
            inviteFriendsCount: 0,
            selectedOptionMessageId: {},
            isLoading: true
        }
    }

    generateID = () => {
        return '_' + Math.random().toString(36).substr(2, 9)
    }

    async _pushMessage(message) {
        if (!message)
            return

        const draft_message_id = this.generateID()
        // send local message
        const draftMessage = {
            chat_message_id: draft_message_id,
            draft_message_id: draft_message_id,
            content: message,
            username: this.state.user.username,
            who_read: [],
            create_date: new Date(),
            profile_pic_url: this.state.user.profile_pic_url,
            message_type: '1',
            isError: false
        }

        this.setState({
            message: ''
        })

        const messageLists = _.get(this.state, 'chat', [])
        const chatData = [draftMessage].concat(messageLists)
        store.dispatch(chat(chatData))

        try {
            const resSendTheMessage = await sendTheMessage(this.state.chatInfo.chat_room_id, '1', message, '', '')

            const chat_message_id = _.get(resSendTheMessage, 'data.new_chat_message.chat_message_id')

            // update message for everyone in group
            emit_message(message, this.state.chatInfo.chat_room_id, this.state.user.user_id, chat_message_id, draft_message_id)

            // update our own
            emit_update_friend_chat_list(this.state.user.user_id, this.state.user.user_id)

            // update every friends in group
            if(this.state.chatInfo.chat_room_type == 'G' || this.state.chatInfo.chat_room_type == 'C') {
                const friend_user_ids = this.state.chatInfo.friend_user_ids.split(',')
                friend_user_ids.forEach((friend_user_id) => {
                    emit_update_friend_chat_list(this.state.user.user_id, friend_user_id)
                })
            } else {
                emit_update_friend_chat_list(this.state.user.user_id, this.state.chatInfo.friend_user_id)
            }

            this.setState({
                message: ''
            })

            $( "div.row.message.content" ).scrollTop( this.messagesEnd.scrollHeight )
        } catch(err) {
            const indexLocal = chatData.findIndex((message) => {
                return _.get(message, 'draft_message_id', 'unknown') == draft_message_id
            })

            chatData[indexLocal].isError = true
            store.dispatch(chat(chatData))

            $( "div.row.message.content" ).scrollTop( this.messagesEnd.scrollHeight )
            return
        }
    }

    async _pushSticker(sticker_path, object_url) {
        const draft_message_id = this.generateID()

        // send local message
        const draftMessage = {
            chat_message_id: draft_message_id,
            draft_message_id: draft_message_id,
            content: '',
            username: this.state.user.username,
            who_read: [],
            create_date: new Date(),
            profile_pic_url: this.state.user.profile_pic_url,
            message_type: '4',
            object_url: object_url,
            sticker_path: sticker_path,
            isError: false
        }

        this.setState({
            message: ''
        })

        const messageLists = _.get(this.state, 'chat', [])
        const chatData = [draftMessage].concat(messageLists)
        store.dispatch(chat(chatData))

        try {
            const resSendTheMessage = await sendTheMessage(this.state.chatInfo.chat_room_id, '4', '', sticker_path, '')
            const chat_message_id = _.get(resSendTheMessage, 'data.new_chat_message.chat_message_id')
            // update message for everyone in group
            emit_message('', this.state.chatInfo.chat_room_id, this.state.user.user_id, chat_message_id, draft_message_id)

            // update our own
            emit_update_friend_chat_list(this.state.user.user_id, this.state.user.user_id)

            // update every friends in group
            const friend_user_ids = this.state.chatInfo.friend_user_ids.split(',')
            friend_user_ids.forEach((friend_user_id) => {
                emit_update_friend_chat_list(this.state.user.user_id, friend_user_id)
            })

            this.setState({
                message: ''
            })

            $( "div.row.message.content" ).scrollTop( this.messagesEnd.scrollHeight )
        } catch(err) {
            const indexLocal = chatData.findIndex((message) => {
                return _.get(message, 'draft_message_id', 'unknown') == draft_message_id
            })

            chatData[indexLocal].isError = true
            store.dispatch(chat(chatData))
            $( "div.row.message.content" ).scrollTop( this.messagesEnd.scrollHeight )
            return
        }
    }

    async _pushPhoto(base64, object_url) {
        const draft_message_id = this.generateID()
        // send local message
        const draftMessage = {
            chat_message_id: draft_message_id,
            draft_message_id: draft_message_id,
            content: '',
            username: this.state.user.username,
            who_read: [],
            create_date: new Date(),
            profile_pic_url: this.state.user.profile_pic_url,
            message_type: '2',
            object_url: object_url,
            base64: base64,
            isError: false
        }

        const messageLists = _.get(this.state, 'chat', [])
        const chatData = [draftMessage].concat(messageLists)
        store.dispatch(chat(chatData))

        try {
            const resSendTheMessage = await sendTheMessage(this.state.chatInfo.chat_room_id, '2', '', '', base64)
            const chat_message_id = _.get(resSendTheMessage, 'data.new_chat_message.chat_message_id')
            // update message for everyone in group
            emit_message('', this.state.chatInfo.chat_room_id, this.state.user.user_id, chat_message_id, draft_message_id)

            // update our own
            emit_update_friend_chat_list(this.state.user.user_id, this.state.user.user_id)

            // update every friends in group
            const friend_user_ids = this.state.chatInfo.friend_user_ids.split(',')
            friend_user_ids.forEach((friend_user_id) => {
                emit_update_friend_chat_list(this.state.user.user_id, friend_user_id)
            })

            this.setState({
                message: ''
            })

            $( "div.row.message.content" ).scrollTop( this.messagesEnd.scrollHeight )
        } catch(err) {
            const indexLocal = chatData.findIndex((message) => {
                return _.get(message, 'draft_message_id', 'unknown') == draft_message_id
            })

            chatData[indexLocal].isError = true
            store.dispatch(chat(chatData))

            $( "div.row.message.content" ).scrollTop( this.messagesEnd.scrollHeight )
            return
        }
    }
    
    async _pushFile(file) {
        const draft_message_id = this.generateID()
        // send local message
        const draftMessage = {
            chat_message_id: draft_message_id,
            draft_message_id: draft_message_id,
            content: '',
            username: this.state.user.username,
            who_read: [],
            create_date: new Date(),
            profile_pic_url: this.state.user.profile_pic_url,
            message_type: '5',
            object_url: file,
            file_name: file.name,
            file_extension: file.type,
            isError: false
        }

        const messageLists = _.get(this.state, 'chat', [])
        const chatData = [draftMessage].concat(messageLists)
        store.dispatch(chat(chatData))

        try {
            const resSendTheMessage = await sendFileMessage(this.state.chatInfo.chat_room_id, '5', file)
            const chat_message_id = _.get(resSendTheMessage, 'new_chat_message.chat_message_id')

            // update message for everyone in group
            emit_message('', this.state.chatInfo.chat_room_id, this.state.user.user_id, chat_message_id, draft_message_id)

            // update our own
            emit_update_friend_chat_list(this.state.user.user_id, this.state.user.user_id)

            // update every friends in group
            const friend_user_ids = this.state.chatInfo.friend_user_ids.split(',')
            friend_user_ids.forEach((friend_user_id) => {
                emit_update_friend_chat_list(this.state.user.user_id, friend_user_id)
            })

            this.setState({
                message: ''
            })

            $( "div.row.message.content" ).scrollTop( this.messagesEnd.scrollHeight )
        } catch(err) {
            const indexLocal = chatData.findIndex((message) => {
                return _.get(message, 'draft_message_id', 'unknown') == draft_message_id
            })

            chatData[indexLocal].isError = true
            store.dispatch(chat(chatData))

            $( "div.row.message.content" ).scrollTop( this.messagesEnd.scrollHeight )
            return
        }
    }

    _pushAudio = async () => {
        const draft_message_id = this.generateID()
        // send local message
        const draftMessage = {
            chat_message_id: draft_message_id,
            draft_message_id: draft_message_id,
            content: '',
            username: this.state.user.username,
            who_read: [],
            create_date: new Date(),
            profile_pic_url: this.state.user.profile_pic_url,
            message_type: '3',
            object_url: this.soundRecord.blobURL,
            file_name: `${draft_message_id}.wav`,
            file_extension: "audio/wav"
        }

        const messageLists = _.get(this.state, 'chat', [])
        const chatData = [draftMessage].concat(messageLists)
        store.dispatch(chat(chatData))

        try {
            const file = new File([this.soundRecord], `${draft_message_id}.wav`)
            const resSendTheMessage = await sendFileMessage(this.state.chatInfo.chat_room_id, '3', file)

            const chat_message_id = _.get(resSendTheMessage, 'new_chat_message.chat_message_id')
            // update message for everyone in group
            emit_message('', this.state.chatInfo.chat_room_id, this.state.user.user_id, chat_message_id, draft_message_id)

            // update our own
            emit_update_friend_chat_list(this.state.user.user_id, this.state.user.user_id)

            // update every friends in group
            const friend_user_ids = this.state.chatInfo.friend_user_ids.split(',')
            friend_user_ids.forEach((friend_user_id) => {
                emit_update_friend_chat_list(this.state.user.user_id, friend_user_id)
            })

            this.setState({
                message: '',
                roundRecording: 0
            })
        } catch(err) {
            const indexLocal = chatData.findIndex((message) => {
                return _.get(message, 'draft_message_id', 'unknown') == draft_message_id
            })

            chatData[indexLocal].isError = true
            store.dispatch(chat(chatData))

            return
        }
    }

    load_chat = () => {
        const chat_id = location.pathname.replace('/chat/','')
        store.dispatch(isLoading(true))
        emit_unsubscribe(_.get(this.state.chatInfo, 'chat_room_id'))
        fetchChatInfo(chat_id).then((res) => {
            if(_.get(res, 'data.data')) {
                this.setState({
                    chatInfo: res.data.data,
                    isSelectChatForOpenCase: false,
                    selectedOptionMessageId: {},
                    show_selected_chat_message: false,
                    selected_chat_message_id: '',
                    showInviteFriend: false,
                    footer_selected: ''
                })
                store.dispatch(selectChat(res.data.data))
                store.dispatch(onFetchFriendInGroup(chat_id))         
            } else {
                this.props.history.push('/error')
            }
        }, () => {

        })
    }

    componentDidMount() {
        // start load chat
        this.load_chat()
        this.props.history.listen((location, action) => {
            if(location.pathname.indexOf('/chat/') >= 0) {
                this.load_chat()                
            }
        })
        
    }

    componentDidUpdate() {
    }

    componentWillReceiveProps() {
        
    }

    isBlocked = () => {
        return _.get(this.state.chatInfo, 'is_blocked', '0') == '1'
    }

    isMute = () => {
        return _.get(this.state.chatInfo, 'is_mute', '0') == '1'
    }

    componentWillReceiveProps() {
        if(_.get(this.props.data, 'chat.sticker')) {
            this.setState({
                sticker: this.props.data.chat.sticker || []
            })
        }

        if(_.get(this.props.data, 'chat.chat')) {
            this.setState({
                chat: this.props.data.chat.chat || []
            }, () => {
                   
            })
        }

        if(_.get(this.props.data, 'user.user')) {
            this.setState({
                user: this.props.data.user.user
            })
        }

        if(_.get(this.props.data, 'system')) {
            this.setState({
                isLoading: _.get(this.props.data, 'system.isLoading')
            })
        }

        if(_.get(this.props.data, 'chat.memberInGroup.data')) {
            this.setState({
                member: _.get(this.props.data, 'chat.memberInGroup.data', []),
            })
        }

        if(_.get(this.props.data, 'chat.inviteFriends.data')) {
            this.setState({
                inviteFriends: _.get(this.props.data, 'chat.inviteFriends.data', []),
                inviteFriendsCount: _.get(this.props.data, 'chat.inviteFriends.totalCount', 0),
            })
        }
    }
    
    render_sticker_collection = () => {
        return this.state.sticker.map((item) => {
            return (
                <img src={item.collection_image_url} style={{ width: '90px', padding: '15px', height: '80px', cursor: 'pointer' }}  onClick={() => {
                    this.setState({
                        collectionKeySelected: item.key
                    })
                }} />
            )
        })
    }

    render_sticker = () => {
        return _.get(this.state.sticker, `${this.state.collectionKeySelected}.sticker_lists`, []).map((item) => {
            return (
                <img src={item.url} className="sticker-collection" style={{ width: '145px', padding: '15px', cursor: 'pointer' }} onClick={() => this._pushSticker(item.path, item.url)} />
            )
        })
    }

    _image_upload_handler = (e) => {
        getBase64(e.target.files[0]).then(res => {
            this._pushPhoto(res, res)
        })
    }

    _file_upload_handler = (e) => {
        this._pushFile(e.target.files[0])
        // console.log(e.target.files[0])
    }

    startRecording = () => {
        this.setState({
            record: true,
            status_record: 'start'
        })
        this.timer = setInterval(() => { 
            this.setState({
                timer: this.state.timer + 1
            })
        }, 1000)
    }

    stopRecording = () => {
        this.setState({
            record: false,
            timer: 0,
            status_record: 'stop'
        })
        clearInterval(this.timer)
        this.setState({stoppedRecording: true, recording: false, paused: false})
    }
    
    onData = (recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    }
    
    onStop = (recordedBlob) => {
        this.soundRecord = recordedBlob
        this.setState({
            roundRecording: this.state.roundRecording + 1
        })
    }
    
    loadMoreHistory = () => {
        return new Promise((resolve) => {
            store.dispatch(onLoadMoreMessageLists(this.state.filter))
            resolve('done')
        })
    }

    render_addi_footer = () => {
        if(this.state.footer_selected == 'sticker') {
            return (
                <div style={{ height: 'auto !important', overflowY: 'scroll' }}>
                    <div style={{ overflowX: 'auto', display: 'flex', height: '80px', backgroundColor: 'rgb(251, 251, 251)', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
                        {
                            this.render_sticker_collection()
                        }
                    </div>
                    {
                        this.render_sticker()
                    }
                </div>
            )
        } else if(this.state.footer_selected == 'record') {
            return (
                <div style={{ height: 'auto !important', textAlign: 'center', paddingTop: '40px', background: 'rgb(251, 251, 251)' }}>
                    <Recorder command={this.state.status_record} onStop={this.onStop} onStart={() => console.log(' start record ')} />
                    <button className={ (!this.state.record && this.state.roundRecording == 0) ? 'show' : 'hide' } onClick={this.startRecording} style={{ backgroundColor: '#ff6666', width: '120px', height: '120px', borderRadius: '50%', color: 'white', border: '0px', fontSize: '19px' }} type="button">START</button>
                    <button className={ this.state.record ? 'show' : 'hide' } onClick={this.stopRecording} style={{ backgroundColor: '#ff6666', width: '120px', height: '120px', borderRadius: '50%', color: 'white', border: '0px', fontSize: '19px' }} type="button">
                        STOP <br /> { this.state.timer }
                    </button>
                    <div className={ (!this.state.record && this.state.roundRecording != 0) ? 'show' : 'hide' }>
                        <button onClick={this.startRecording} style={{ backgroundColor: '#edb730', width: '100px', height: '100px', borderRadius: '50%', color: 'white', border: '0px', fontSize: '19px', margin: '10px'  }} type="button">
                            <i className="fa fa-undo" aria-hidden="true" style={{ fontSize: '30px' }}></i>
                        </button>
                        <button onClick={this._pushAudio} style={{ backgroundColor: '#ff6666', width: '100px', height: '100px', borderRadius: '50%', color: 'white', border: '0px', fontSize: '19px', margin: '10px'  }} type="button">SEND</button>
                    </div>
                </div>
            )
        }
    }

    download_file = (e) => {
        e.stopPropagation()
    }

    is_group = () => {
        return _.get(this.state.chatInfo, 'chat_room_type') == 'G' || _.get(this.state.chatInfo, 'chat_room_type') == 'C'
    }

    selected_chat_message = (chat_message_id) => {
        if(!this.state.isSelectChatForOpenCase) {
            this.setState({
                selected_chat_message_id: chat_message_id,
                show_selected_chat_message: true
            })
        }
    }

    render_select_container = () => {

    }

    _resend = () => {
        this.setState({
            showHandleError: false
        }, () => {
            const {
                message,
                index
            } = this.state.selectedMessageError

            const messageLists = this.state.chat
            messageLists.splice(index, 1)
            store.dispatch(chat(messageLists))

            if (message.message_type == '1') {
                this._pushMessage(message.content)
            } else if (message.message_type == '2') {
                this._pushPhoto(message.base64, message.object_url)
            } else if (message.message_type == '3') {
                this._pushAudio()
            } else if (message.message_type == '4') {
                this._pushSticker(message.sticker_path, message.object_url)
            } else if (message.message_type == '5') {
                this._pushFile({
                    uri: message.object_url,
                    fileName: message.file_name,
                    type: message.file_extension
                })
            }
        })
    }

    _deleteErrorMessage = () => {
        this.setState({
            showHandleError: false
        }, () => {
            const {
                message,
                index
            } = this.state.selectedMessageError

            const messageLists = this.state.chat
            messageLists.splice(index, 1)
            store.dispatch(chat(messageLists))
        })
    }
    
    render_message = () => {
        return _.get(this.state, 'chat', []).map((chat, index) => {
            if(!this.state.user) {
                return
            }
            let seenMessage = ''
            const reader = chat.who_read.filter((id) => {
                return id != _.get(this.state.user, 'user_id')
            })
            const is_show_avatar = (this.state.chatInfo.chat_room_type == 'G' || this.state.chatInfo.chat_room_type == 'C') && _.get(this.state.user, 'username') != chat.username
            if((this.state.chatInfo.chat_room_type == 'G' || this.state.chatInfo.chat_room_type == 'C') && reader.length != 0) {
                seenMessage = `seen by ${reader.length}`
            } else if(reader.length != 0){
                seenMessage = `seen`
                if(_.get(this.state.user, 'username') != chat.username) {
                    seenMessage = ''
                }
            }
            const class_reciever = is_show_avatar? 'receiver receiver-message' : 'receiver'
            /* text message */
            if(chat.message_type == '1') {
                return (
                    <div key={chat.chat_message_id} className="row message-body" style={{ marginRight: '10px' }} onClick={() => {
                        if(!_.get(chat, 'isError', false)) {
                            if(this.state.footer_selected) {
                                this.setState({
                                    footer_selected: ''
                                })
                            } else {
                                this.selected_chat_message(chat.chat_message_id)
                            }
                        }
                    }}>
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <div className={ this.state.selected_chat_message_id == chat.chat_message_id ? "hide" : "disapear-selected-message" }/>
                        }
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <i className={ this.state.selected_chat_message_id == chat.chat_message_id ? "fa fa-check-circle selected-message" : "fa fa-check-circle draft-selected-message" } aria-hidden="true" style={{ fontSize: '28px', marginLeft: '15px', color: 'rgb(200, 200, 200)' }}></i>    
                        }
                        {
                            this.state.isSelectChatForOpenCase && <Checkbox onChange={(event) => {
                                const selectedOptionMessageId = {
                                    [chat.chat_message_id]: event.target.checked
                                }
                                this.setState({
                                    selectedOptionMessageId: Object.assign(this.state.selectedOptionMessageId, selectedOptionMessageId, {})
                                })
                            }} />
                        }
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" }>
                            
                            <div className={ is_show_avatar? 'avatar-icon avatar-group': 'hide' }   style={{ width: '40px' }}>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } >
                                <i className={ _.get(chat, 'isError', false)? 'fa fa-exclamation-circle' : 'hide' } aria-hidden="true" style={{ fontSize: '30px', cursor: 'pointer' }} onClick={(e) => {
                                    e.stopPropagation()
                                    this.setState({
                                        showHandleError: true,
                                        selectedMessageError: {
                                            message: chat,
                                            index: index
                                        }
                                    })
                                }}></i>
                                <span className={ _.get(chat, 'isError')? 'hide' : '' }>{ `${moment(chat.create_date).fromNow()}` }</span>
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                            <div className={ this.state.user.username == chat.username ? "sender": class_reciever } onClick={(e) => e.stopPropagation() }>
                                <div className="message-text">
                                    { chat.content }
                                </div>
                            </div>
                            <span className={ this.state.user.username != chat.username ? "message-time" : "hide" } style={{ width: '75px', textAlign: 'left' }}>
                                    { `${moment(chat.create_date).fromNow()}` }
                                    <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                        </div>
                    </div>
                )
            }

             /* image message */
            if(chat.message_type == '2') {
                return (
                    <div key={chat.chat_message_id} className="row message-body" onClick={() => {
                        if(!_.get(chat, 'isError', false)) {
                            if(this.state.footer_selected) {
                                this.setState({
                                    footer_selected: ''
                                })
                            } else {
                                this.selected_chat_message(chat.chat_message_id)
                            }
                        }
                    }}>
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <div className={ this.state.selected_chat_message_id == chat.chat_message_id ? "hide" : "disapear-selected-message" }/>
                        }
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <i className={ this.state.selected_chat_message_id == chat.chat_message_id ? "fa fa-check-circle selected-message" : "fa fa-check-circle draft-selected-message" } aria-hidden="true" style={{ fontSize: '28px', marginLeft: '15px', color: 'rgb(200, 200, 200)' }}></i>    
                        }
                        {
                            this.state.isSelectChatForOpenCase && <Checkbox onChange={(event) => {
                                const selectedOptionMessageId = {
                                    [chat.chat_message_id]: event.target.checked
                                }
                                this.setState({
                                    selectedOptionMessageId: Object.assign(this.state.selectedOptionMessageId, selectedOptionMessageId, {})
                                })
                            }} />
                        }
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" }>
                            <div className={ is_show_avatar? 'avatar-icon': 'hide' }  style={{ width: '40px' }}>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } >
                                <i className={ _.get(chat, 'isError', false)? 'fa fa-exclamation-circle' : 'hide' } aria-hidden="true" style={{ fontSize: '30px', cursor: 'pointer' }} onClick={(e) => {
                                    e.stopPropagation()
                                    this.setState({
                                        showHandleError: true,
                                        selectedMessageError: {
                                            message: chat,
                                            index: index
                                        }
                                    })
                                }}></i>
                                <span className={ _.get(chat, 'isError')? 'hide' : '' }>{ `${moment(chat.create_date).fromNow()}` }</span>
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                            <div className={ this.state.user.username == chat.username ? "sender background-transparent": "receiver background-transparent" }>
                                <img src={ chat.object_url } style={{ width: '200px',     height: '200px' }} onClick={(e) => {
                                    e.stopPropagation()
                                    this.setState({ selected_image: chat.object_url })
                                }}  />
                            </div>
                            <span className={ this.state.user.username != chat.username ? "message-time" : "hide" } style={{ width: '75px', textAlign: 'left' }}>
                                { `${moment(chat.create_date).fromNow()}` }
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                        </div>
                    </div>
                )
            }

            /* audio player message */
            if(chat.message_type == '3') {
                return (
                    <div key={chat.chat_message_id} className="row message-body" onClick={() => {
                        if(!_.get(chat, 'isError', false)) {
                            if(this.state.footer_selected) {
                                this.setState({
                                    footer_selected: ''
                                })
                            } else {
                                this.selected_chat_message(chat.chat_message_id)
                            }
                        }
                    }}>
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <div className={ this.state.selected_chat_message_id == chat.chat_message_id ? "hide" : "disapear-selected-message" }/>
                        }
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <i className={ this.state.selected_chat_message_id == chat.chat_message_id ? "fa fa-check-circle selected-message" : "fa fa-check-circle draft-selected-message" } aria-hidden="true" style={{ fontSize: '28px', marginLeft: '15px', color: 'rgb(200, 200, 200)' }}></i>    
                        }
                        {
                            this.state.isSelectChatForOpenCase && <Checkbox onChange={(event) => {
                                const selectedOptionMessageId = {
                                    [chat.chat_message_id]: event.target.checked
                                }
                                this.setState({
                                    selectedOptionMessageId: Object.assign(this.state.selectedOptionMessageId, selectedOptionMessageId, {})
                                })
                            }} />
                        }
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" }>
                            <div className={ is_show_avatar? 'avatar-icon': 'hide' }  style={{ width: '40px' }}>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } >
                                <i className={ _.get(chat, 'isError', false)? 'fa fa-exclamation-circle' : 'hide' } aria-hidden="true" style={{ fontSize: '30px', cursor: 'pointer' }} onClick={(e) => {
                                    e.stopPropagation()
                                    this.setState({
                                        showHandleError: true,
                                        selectedMessageError: {
                                            message: chat,
                                            index: index
                                        }
                                    })
                                }}></i>
                                <span className={ _.get(chat, 'isError')? 'hide' : '' }>{ `${moment(chat.create_date).fromNow()}` }</span>
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                            <div className={ this.state.user.username == chat.username ? "sender background-transparent audio-right": "receiver background-transparent audio-left" }>
                                <AudioPlayer src={chat.object_url} />
                            </div>
                            <span className={ this.state.user.username != chat.username ? "message-time" : "hide" } style={{ width: '75px', textAlign: 'left' }}>
                                { `${moment(chat.create_date).fromNow()}` }
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                        </div>
                        
                    </div>
                )
            }

             /* sticker message */
            if(chat.message_type == '4') {
                return (
                    <div key={chat.chat_message_id} className="row message-body" onClick={() => {
                        if(!_.get(chat, 'isError', false)) {
                            if(this.state.footer_selected) {
                                this.setState({
                                    footer_selected: ''
                                })
                            } else {
                                this.selected_chat_message(chat.chat_message_id)
                            }
                        }
                    }}>
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <div className={ this.state.selected_chat_message_id == chat.chat_message_id ? "hide" : "disapear-selected-message" }/>
                        }
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <i className={ this.state.selected_chat_message_id == chat.chat_message_id ? "fa fa-check-circle selected-message" : "fa fa-check-circle draft-selected-message" } aria-hidden="true" style={{ fontSize: '28px', marginLeft: '15px', color: 'rgb(200, 200, 200)' }}></i>    
                        }
                        {
                            this.state.isSelectChatForOpenCase && <Checkbox onChange={(event) => {
                                const selectedOptionMessageId = {
                                    [chat.chat_message_id]: event.target.checked
                                }
                                this.setState({
                                    selectedOptionMessageId: Object.assign(this.state.selectedOptionMessageId, selectedOptionMessageId, {})
                                })
                            }} />
                        }
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" } >
                            <div className={ is_show_avatar? 'avatar-icon': 'hide' }  style={{ width: '40px' }} onClick={(e) => e.stopPropagation() }>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } >
                                <i className={ _.get(chat, 'isError', false)? 'fa fa-exclamation-circle' : 'hide' } aria-hidden="true" style={{ fontSize: '30px', cursor: 'pointer' }} onClick={(e) => {
                                    e.stopPropagation()
                                    this.setState({
                                        showHandleError: true,
                                        selectedMessageError: {
                                            message: chat,
                                            index: index
                                        }
                                    })
                                }}></i>
                                <span className={ _.get(chat, 'isError')? 'hide' : '' }>{ `${moment(chat.create_date).fromNow()}` }</span>
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                            <div className={ this.state.user.username == chat.username ? "sender background-transparent sticker-right ": " receiver background-transparent sticker-left" } onClick={(e) => e.stopPropagation() }>
                                <img className="sticker" src={ chat.object_url } style={{ width: '150px' }} />
                            </div>
                            <span className={ this.state.user.username != chat.username ? "message-time" : "hide" } style={{ width: '75px', textAlign: 'left' }}>
                                { `${moment(chat.create_date).fromNow()}` }
                                <span className={ seenMessage ? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                        </div>
                    </div>
                )
            }

             /* file message */
            if(chat.message_type == '5') {
                return (
                    <div key={chat.chat_message_id} className="row message-body" onClick={() => {
                        if(!_.get(chat, 'isError', false)) {
                            if(this.state.footer_selected) {
                                this.setState({
                                    footer_selected: ''
                                })
                            } else {
                                this.selected_chat_message(chat.chat_message_id)
                            }
                        }
                    }}>
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <div className={ this.state.selected_chat_message_id == chat.chat_message_id ? "hide" : "disapear-selected-message" }/>
                        }
                        {
                            !this.state.isSelectChatForOpenCase && !_.get(chat, 'isError', false) && <i className={ this.state.selected_chat_message_id == chat.chat_message_id ? "fa fa-check-circle selected-message" : "fa fa-check-circle draft-selected-message" } aria-hidden="true" style={{ fontSize: '28px', marginLeft: '15px', color: 'rgb(200, 200, 200)' }}></i>    
                        }
                        {
                            this.state.isSelectChatForOpenCase && <Checkbox onChange={(event) => {
                                const selectedOptionMessageId = {
                                    [chat.chat_message_id]: event.target.checked
                                }
                                this.setState({
                                    selectedOptionMessageId: Object.assign(this.state.selectedOptionMessageId, selectedOptionMessageId, {})
                                })
                            }} />
                        }
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" }>
                            <div className={ is_show_avatar? 'avatar-icon': 'hide' }  style={{ width: '40px' }}>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } >
                                <i className={ _.get(chat, 'isError', false)? 'fa fa-exclamation-circle' : 'hide' } aria-hidden="true" style={{ fontSize: '30px', cursor: 'pointer' }} onClick={(e) => {
                                    e.stopPropagation()
                                    this.setState({
                                        showHandleError: true,
                                        selectedMessageError: {
                                            message: chat,
                                            index: index
                                        }
                                    })
                                }}></i>
                                <span className={ _.get(chat, 'isError')? 'hide' : '' }>{ `${moment(chat.create_date).fromNow()}` }</span>
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                            <a className={ this.state.user.username == chat.username ? "sender": "receiver"} style={{ height: '64px', padding: '11px' }} href={chat.object_url} download onClick={(e) => this.download_file(e) }>
                               
                                <div style={{ display: 'flex', cursor: 'pointer' }}>
                                    <i className="fa fa-file" aria-hidden="true" 
                                    style={{ fontSize: '25px', color: '#3a6d99', padding: '5px', textAlign: 'center'}}></i>
                                    <div style={{ paddingLeft: '12px' }}>
                                        <p style={{ margin: '0px', fontWeight: 'bold', color: '#3a6d99', whiteSpace: 'nowrap', textAlign: 'left' }}>{ chat.file_name }</p>
                                        <p style={{ margin: '0px', color: '#3a6d99', textAlign: 'left', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflowY: 'hidden' }}>Download</p>
                                    </div>
                                </div>
                                
                            </a>
                            <span className={ this.state.user.username != chat.username ? "message-time" : "hide" } style={{ width: '75px', textAlign: 'left' }}>
                                { `${moment(chat.create_date).fromNow()}` }
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                        </div>
                    </div>
                )
            }
        })
    }

    onSearchMessage = (e) => {
        if(e) {
            e.preventDefault()
        }
        store.dispatch(onFetchMessageLists(this.state.filter))
        // this.setState({ show_search_input: false })
    }

    closeSearch = () => {
        this.setState({
            show_search_input : false,
            filter: ''
        }, () => {
            store.dispatch(onFetchMessageLists(''))
        })
    }

    openCamera = () => {
        var video = document.getElementById('video')
        
        // Get access to the camera!
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                video.src = window.URL.createObjectURL(stream)
                video.play()
            })
        }
    }
    
    takePhoto = () => {
        var canvas = document.getElementById('canvas')
        var context = canvas.getContext('2d')
        var video = document.getElementById('video')
        context.drawImage(video, 0, 0, 640, 480)
        this.setState({
            alreadyTaken: true
        }, () => {
            this.base64 = canvas.toDataURL("image/jpeg")
        })
    }

    onSearchInviteFriend = (e) => {
        e.preventDefault()
        store.dispatch(onFetchInviteFriend(this.state.inviteFilter))
    }

    render() {
        return (
            <div className="col-sm-7 conversation">
                <div className="row heading header-chat" style={{ backgroundColor: '#3b5998', display: 'flex' }}>
                    <div className="pc-hide" style={{ marginRight: '10px', width: 'auto', marginTop: '6px' }}  onClick={() => this.props.history.push('/')}>
                        <i className="fa fa-arrow-left fa-lg " style={{ color: 'white', padding: '10px' }}></i>
                    </div>
                    <div className="heading-avatar " style={{ width: 'auto' }}>
                        <div className="heading-avatar-icon">
                            <img src={ _.get(this.state.chatInfo, 'profile_pic_url') } style={{ border: '0.5px solid black'}} />
                        </div>
                    </div>
                    <div className={ this.state.show_search_input? 'heading-name mobile-hide' : 'heading-name'} style={{ width: 'auto', flex: '1', display: 'inline-block', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={() => {
                        if( _.get(this.state.chatInfo, 'display_name') != 'KEEP' ) {
                            this.setState({
                                showContactInfo: true
                            }, () => {
                                store.dispatch(onFetchInviteFriend())
                            })
                        }
                    }}>
                        <a className="heading-name-meta" style={{ color: 'white', padding: '15px', paddingTop: '12px', display: 'inline-block', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ _.get(this.state.chatInfo, 'display_name') }
                        </a>
                    </div>
                    <div className={ !this.state.show_search_input ? 'heading-dot pull-right' : 'hide' } style={{ width: 'auto' }}>
                        <i className="fa fa-cog fa-lg  pull-right" style={{ color: 'white', padding: '15px', paddingRight: '5px' }} aria-hidden="true" onClick={() => {
                            if( _.get(this.state.chatInfo, 'display_name') != 'KEEP' ) {
                                this.setState({
                                    showContactInfo: true
                                }, () => {
                                    store.dispatch(onFetchInviteFriend())
                                })
                            }
                        }}></i>
                        <i className="fa fa-search fa-lg  pull-right" style={{ color: 'white', padding: '15px', paddingRight: '5px' }} aria-hidden="true" onClick={() => this.setState({ show_search_input: true }) }></i>
                    </div>
                    <div className={ this.state.show_search_input ? 'pull-right' : 'hide' } style={{  width: 'auto', flex: '1' }}>
                        <form onSubmit={this.onSearchMessage} style={{ marginLeft: '25px', marginTop: '5px' }}>
                            <div className="input-group">
                                <input type="text" style={{ height: '40px' }} className="form-control" placeholder="Search" value={this.state.filter} aria-describedby="basic-addon1" onChange={(event) => this.setState({filter: event.target.value})} />
                                <a className="input-group-addon" style={{ cursor: 'pointer' }} onClick={() => this.onSearchMessage()}>
                                    <i className='fa fa-search' aria-hidden="true" ></i>
                                </a>
                                <a className="input-group-addon" style={{ cursor: 'pointer' }} onClick={() => this.closeSearch()}>
                                    <i className='fa fa-close' aria-hidden="true" ></i>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={ this.state.isLoading? '' : 'hide' } style={{ padding: '0', argin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Loading ...</p>
                </div>
                <ReactChatView className={ this.state.isLoading? 'hide' : '' } flipped={true}  onInfiniteLoad={this.loadMoreHistory.bind(this)} scrollLoadThreshold={50} onClick={() => this.setState({ footer_selected: '' })} className={!!this.state.footer_selected? 'row message message-small content': 'row message content' } ref={(el) => { this.messagesEnd = el }}>
                    {
                        this.render_message()
                    }
                </ReactChatView>
                <input id="image-upload" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this._image_upload_handler} aria-describedby="fileHelp" />
                <input id="file-upload" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this._file_upload_handler} aria-describedby="fileHelp" />

                <div className={ (this.state.isSelectChatForOpenCase || this.state.show_selected_chat_message || this.state.showHandleError )? "hide" : "row reply" } >
                    <div style={{ display: 'flex' }}>
                        <i className={ this.state.show_addi_item? "fa fa-chevron-circle-left fa-lg" : "fa fa-chevron-circle-right fa-lg" } style={{ marginTop: '7px', cursor: 'pointer', padding: '10px', color: '#93918f' }} onClick={() => {
                            this.setState({
                                show_addi_item: !this.state.show_addi_item
                            })
                        }}></i>
                        <i className={ this.state.show_addi_item? "fa fa-smile-o fa-lg" : "hide" } style={{ marginTop: '7px', cursor: 'pointer', padding: '10px', color: '#93918f' }} onClick={() => {
                            this.setState({
                                footer_selected: 'sticker'
                            })
                        }}></i>
                        <i className={ this.state.show_addi_item? "fa fa-file-image-o fa-lg" : "hide" }  style={{ marginTop: '7px', cursor: 'pointer', padding: '10px', color: '#93918f' }} 
                            onClick={() => {
                                $('#image-upload').trigger('click')
                            }}
                        ></i>
                        <i className={ this.state.show_addi_item? "fa fa-file-o fa-lg" : "hide" }  style={{ marginTop: '7px', cursor: 'pointer', padding: '10px', color: '#93918f' }}
                            onClick={() => {
                                $('#file-upload').trigger('click')
                            }}
                        ></i>
                        <i className={ this.state.show_addi_item? "fa fa-camera fa-lg" : "hide" }  style={{ marginTop: '7px', cursor: 'pointer', padding: '10px', color: '#93918f' }}
                            onClick={() => {
                                this.setState({
                                    showCamera: true
                                }, () => {
                                    this.openCamera()
                                })
                            }}
                        ></i>
                        <textarea onClick={() => this.setState({ show_addi_item: false })} onKeyDown={(e) => {
                            if(e.keyCode == 13 && e.shiftKey == false) {
                                e.preventDefault()
                                this._pushMessage(this.state.message)
                            }
                        }} value={this.state.message} onChange={(event) => this.setState({message: event.target.value})} className="form-control" rows="1" id="comment" style={{ marginLeft: '10px', marginRight: '10px' }}></textarea>
                        <i className="fa fa-microphone fa-lg" aria-hidden="true" style={{ marginTop: '7px', padding: '10px', color: '#93918f' }} onClick={() => {
                            this.setState({
                                footer_selected: 'record'
                            })
                        }}></i>
                        <i className="fa fa-send fa-lg" aria-hidden="true" style={{ marginTop: '7px', padding: '10px', color: '#93918f' }} onClick={ () => this._pushMessage(this.state.message) }></i>
                    </div>
                    
                </div>
                <div className="row reply" className={ this.state.isSelectChatForOpenCase? "row reply" : "hide" }>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: '1' }} />
                        <Button bsStyle="success" onClick={() => {
                            const selectedOptionMessageId = []
                            _.forEach(this.state.selectedOptionMessageId, (value, key) => {
                                if(value) {
                                    selectedOptionMessageId.push(key)
                                }
                            })
                            store.dispatch(onInviteFriendToGroupWithOpenCase(this.state.chatInfo.chat_room_id, this.state.selected_invite_friend_user_id, selectedOptionMessageId))
                        }} >Send</Button>
                        <Button bsStyle="warning" style={{ marginLeft: '15px', marginRight: '15px' }} onClick={() => {
                            this.setState({
                                isSelectChatForOpenCase: false,
                                selectedOptionMessageId: {}
                            })
                        }} >Cancle</Button>
                    </div>
                </div>
                <div className="row reply" className={ this.state.showHandleError? "row reply" : "hide" }>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: '1' }} />
                        <Button bsStyle="success" onClick={() => {
                            this._resend()
                        }} >Resend</Button>
                        <Button bsStyle="warning" style={{ marginLeft: '15px' }} onClick={() => {
                            this._deleteErrorMessage()
                        }} >Delete</Button>
                        <Button bsStyle="light" style={{ marginLeft: '15px', marginRight: '15px' }} onClick={() => {
                            this.setState({
                                showHandleError: false
                            })
                        }} >Cancle</Button>
                    </div>
                </div>
                <div className="row reply" className={ this.state.show_selected_chat_message? "row reply" : "hide" }>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: '1' }} />
                        <Button bsStyle="info" onClick={() => {
                                this.setState({
                                    isShowForwardModal: true
                                })
                            }} >FORWARD</Button>
                        {
                            _.get(this.state.chatInfo, 'display_name') != 'KEEP' && <Button bsStyle="warning" style={{ marginLeft: '15px' }} onClick={() => {
                                this.setState({ 
                                    show_selected_chat_message: false,
                                    selected_chat_message_id: ''
                                })
                                new Promise(() => {
                                    saveInKeep(this.state.selected_chat_message_id)
                                })
                            }} >SAVE IN KEEP</Button>
                        }
                        
                        <Button bsStyle="light" style={{ marginLeft: '15px', marginRight: '15px' }} onClick={() => {
                                this.setState({
                                    show_selected_chat_message: false,
                                    selected_chat_message_id: ''
                                })
                            }} >CANCLE</Button>
                    </div>
                </div>
                <div style={{ height: '200px', backgroundColor: 'white' }}>
                    {
                        this.render_addi_footer()
                    }
                </div>

                <div id="myModal" className={ this.state.selected_image? 'modal-photo show' : 'hide' }>
                    <span className="close" onClick={() => this.setState({ selected_image: '' }) }>&times;</span>
                        <img className="modal-photo-content" id="img01" src={ this.state.selected_image } style={{ width: '300px' }}/>
                    <div id="caption"></div>
                </div>
                <div className="static-modal">
                    <Modal show={this.state.showCamera} onHide={() => {
                            this.setState({
                                showCamera: false,
                                alreadyTaken: false
                            })
                        }}>
                        <Modal.Header>
                            <Modal.Title>Take a photo</Modal.Title>
                        </Modal.Header>

                            <video id="video" className={ !this.state.alreadyTaken? 'show' : 'hide' } width="640" height="480" autoplay></video>
                            <canvas id="canvas" className={ this.state.alreadyTaken? 'show' : 'hide' } width="640" height="480"></canvas>
                            
                        <Modal.Footer>
                            <Button onClick={() => {
                                this.setState({
                                    showCamera: false,
                                    alreadyTaken: false
                                })
                                navigator.getUserMedia({audio: false, video: true},
                                    function(stream) {
                                    // can also use getAudioTracks() or getVideoTracks()
                                    var track = stream.getTracks()[0]  // if only one media track
                                    track.stop()
                                },
                                function(error){
                                    console.log('getUserMedia() error', error)
                                })
                            }}>Close</Button>
                            {
                                this.state.alreadyTaken && <Button bsStyle="warning" 
                                    onClick={() => {
                                        this.setState({
                                            alreadyTaken: false
                                        })
                                    }}
                                >
                                    <i className="fa fa-undo" aria-hidden="true"></i>
                                </Button>
                            }
                            {
                                this.state.alreadyTaken && <Button bsStyle="success" 
                                    onClick={() => {
                                        this._pushPhoto(this.base64, this.base64)
                                        this.setState({
                                            alreadyTaken: false,
                                            showCamera: false
                                        })
                                    }}
                                >Send</Button>
                            }
                            {
                                !this.state.alreadyTaken && <Button bsStyle="primary" 
                                    onClick={() => {
                                        this.takePhoto()
                                    }}
                                >Snapshot</Button>
                            }
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="height-auto">
                    <div className="static-modal">
                        <Modal show={this.state.showContactInfo} onHide={() => {
                                this.setState({
                                    showContactInfo: false
                                })
                            }}>
                            <Modal.Header style={{ backgroundColor: '#eee' }}>
                                <Modal.Title>Contact info</Modal.Title>
                            </Modal.Header>
                            <div>
                                <div style={{ display: 'flex', backgroundColor: '#eee', backgroundSize: 'cover', backgroundImage: `url("${ _.get(this.state.chatInfo, 'friend_wall_pic_url') }")` }}>
                                    <div style={{ display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                                        <div className='avatar-icon' style={{ width: '100px', margin: '20px' }}>
                                            <img src={ _.get(this.state.chatInfo, 'profile_pic_url') } />
                                        </div>
                                        <span style={{ fontSize: '19px', fontWeight: '200', marginTop: '30px', color: 'white' }}>{ _.get(this.state.chatInfo, 'display_name') }</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', paddingTop: '15px', paddingBottom: '15px' }}>
                                    <div style={{ width: '200px', textAlign: 'center'  }}>
                                        <i className="fa fa-user fa-lg" aria-hidden="true" style={{ padding: '10px', paddingLeft: '35px' }}></i>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                            this.setState({
                                                showContactInfo: false,
                                                showInviteFriend: true,
                                                isOpenCase: false
                                            })
                                        }}>Invite</p>
                                        <p className={ !this.is_group()? '' : 'hide' } style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                            this.setState({
                                                showContactInfo: false,
                                                showInviteFriend: true,
                                                isOpenCase: true
                                            })
                                        }}>Open case</p>
                                        <p className={ this.is_group()? '' : 'hide' } style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                            store.dispatch(onExitTheGroup(_.get(this.state.chatInfo, 'chat_room_id')))
                                            this.props.history.push('/')
                                        }}>Leave group</p>
                                        <div style={{ borderBottom: '1px solid #dfdfdf', marginTop: '10px' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', paddingTop: '15px', paddingBottom: '15px' }}>
                                    <div style={{ width: '200px', textAlign: 'center'  }}>
                                        <i className="fa fa-bars fa-lg" aria-hidden="true" style={{ padding: '10px', paddingLeft: '35px' }}></i>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                            store.dispatch(onHideChat())
                                            this.props.history.push('/')
                                        }}>Hide chat</p>

                                        { !this.isMute() && <p style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                            this.setState({
                                                chatInfo: Object.assign({}, this.state.chatInfo, {
                                                    is_mute: '1'
                                                })
                                            }, () => {
                                                store.dispatch(onMuteChat())
                                            })
                                        }}>Mute chat</p> }
                                        { this.isMute() && <p style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                            this.setState({
                                                chatInfo: Object.assign({}, this.state.chatInfo, {
                                                    is_mute: '0'
                                                })
                                            }, () => {
                                                store.dispatch(onUnmuteChat())
                                            })
                                        }}>Unmute chat</p> }

                                        { !this.isBlocked() && <p style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                            this.setState({
                                                chatInfo: Object.assign({}, this.state.chatInfo, {
                                                    is_blocked: '1'
                                                })
                                            }, () => {
                                                store.dispatch(onBlockChat())
                                            })
                                        }}>Block chat</p> }
                                        { this.isBlocked() && <p style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                            this.setState({
                                                chatInfo: Object.assign({}, this.state.chatInfo, {
                                                    is_blocked: '0'
                                                })
                                            }, () => {
                                                store.dispatch(onUnblockChat())
                                            })
                                        }}>Unblock chat</p> }
                                        
                                        <p style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                            store.dispatch(onDeleteChat())
                                            this.props.history.push('/')
                                        }}>Delete chat</p>
                                    </div>
                                </div>
                                <div className={ this.is_group()? '' : 'hide' } style={{ borderTop: '1px solid #dfdfdf', minHeight: '12px', background: '#f5f5f5' }} />
                                <div className={ this.is_group()? '' : 'hide' } style={{ display: 'flex', paddingTop: '15px', paddingBottom: '15px' }}>
                                    <div style={{ width: '200px', textAlign: 'center'  }}>
                                        <i className="fa fa-users fa-lg" aria-hidden="true" style={{ padding: '10px', paddingLeft: '35px' }}></i>
                                    </div>
                                    <div>
                                        {
                                            this.state.member.map((member) => (<div style={{ paddingTop: '8px', paddingBottom: '8px', display: 'flex' }}>
                                                <div className='avatar-icon' style={{ width: 'auto' }} >
                                                    <img src={ _.get(member, 'profile_pic_url') } style={{ width: '40px', height: '40px', marginTop: '5px'}} />
                                                </div>
                                                <div style={{ width: 'auto', flex: '1',  textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    <p style={{ fontSize: '16px', padding: '10px', cursor: 'pointer', flex: '1', display: 'inline-block',  textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ member.display_name }</p>
                                                    
                                                </div>
                                                
                                                <i className="fa fa-close fa-lg" aria-hidden="true" style={{ padding: '10px', marginRight: '20px', marginTop: '8px', cursor: 'pointer' }} onClick={() => {
                                                    store.dispatch(onRemoveFriendFromGroup(this.state.chatInfo.chat_room_id, member.friend_user_id, true))
                                                }}></i>
                                            </div>))
                                        }
                                    </div>
                                </div>
                            </div>
                            <Modal.Footer>
                                <Button onClick={() => {
                                    this.setState({
                                        showContactInfo: false
                                    })
                                }}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                
                <div className="height-auto">
                    <div className="static-modal">
                        <Modal show={this.state.showInviteFriend} onHide={() => {
                                this.setState({
                                    inviteFilter: '',
                                    showInviteFriend: false
                                })
                            }}>
                            <Modal.Header style={{ backgroundColor: '#eee' }}>
                                <Modal.Title>Invite Friend</Modal.Title>
                            </Modal.Header>
                            <div>
                                <form onSubmit={this.onSearchInviteFriend}>
                                    <div className="col-sm-12 searchBox-inner">
                                        <div className="input-group">
                                            <input type="text" style={{ height: '40px' }} className="form-control" placeholder="Search" value={this.state.inviteFilter} aria-describedby="basic-addon1" onChange={(event) => this.setState({inviteFilter: event.target.value})} />
                                            <a className="input-group-addon" style={{ cursor: 'pointer' }} onClick={() =>  store.dispatch(onFetchInviteFriend(this.state.inviteFilter)) }>
                                                <i className='fa fa-search' aria-hidden="true"></i>
                                            </a>
                                        </div>
                                    </div>
                                </form>
                                {
                                    this.state.inviteFriends.filter((friend) => friend.friend_user_id != this.state.chatInfo.friend_user_id).map((friend, key) => {
                                        return (
                                            <div className="box invite-friend-container" key={key} onClick={() => {
                                                if(this.state.isOpenCase) {
                                                    this.setState({
                                                        showInviteFriend: false,
                                                        selected_invite_friend_user_id: friend.friend_user_id,
                                                        isSelectChatForOpenCase: true
                                                    })
                                                } else {
                                                    if(friend.invited) {
                                                        store.dispatch(onRemoveFriendFromGroup(this.state.chatInfo.chat_room_id, friend.friend_user_id, false))
                                                    } else {
                                                        store.dispatch(onInviteFriendToGroup(this.state.chatInfo.chat_room_id, friend.friend_user_id, friend))
                                                    }
                                                }
                                            }}>
                                                <Friend image={friend.profile_pic_url} name={friend.display_name} status={this.is_group()? friend.status_quote : 'Tap to invite'} />
                                            </div>
                                        )
                                    })
                                }
                                <div className={ this.state.inviteFriendsCount > this.state.inviteFriends.length ?  'row message-previous' : 'hide' } >
                                    <div className="col-sm-12 previous">
                                        <a onClick={() => store.dispatch(loadMoreInviteFriends(0, this.state.inviteFilter))} >
                                            Show more friends
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <Modal.Footer>
                                <Button onClick={() => {
                                    this.setState({
                                        inviteFilter: '',
                                        showInviteFriend: false
                                    })
                                }}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                        {
                            <ForwardModal data={_.get(this.props, 'data')} show={this.state.isShowForwardModal} selectedMessageId={this.state.selected_chat_message_id}
                                onHide={() => {
                                    this.setState({
                                        isShowForwardModal: false
                                    })
                                }}

                                onSuccess={() => {
                                    this.setState({
                                        show_selected_chat_message: false,
                                        selected_chat_message_id: ''
                                    })
                                }}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Content
