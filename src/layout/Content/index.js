import _ from 'lodash'
import $ from 'jquery'
import React from 'react'
import moment from 'moment'
import download from 'downloadjs'

import { ReactMic } from 'react-mic'
import { Modal, Button } from 'react-bootstrap'
import AudioPlayer from '../../components/AudioPlayer'

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
    onUnmuteChat
} from '../../redux/actions'
import {sendTheMessage, fetchFriendProfile, saveInKeep, sendFileMessage, fetchChatInfo } from '../../redux/api'

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sticker: [],
            collectionKeySelected: 0,
            currentTime: 0.0,
            roundRecording: 0,
            timer: 0,
            member: []
        }
    }

    load_chat = () => {
        const chat_id = location.pathname.replace('/chat/','')
        fetchChatInfo(chat_id).then((res) => {
            this.setState({
                chatInfo: res.data.data
            })
            store.dispatch(selectChat(res.data.data))
            store.dispatch(onFetchFriendInGroup(chat_id))            
        })
    }

    componentDidMount() {
        // start load chat
        this.load_chat()
        this.props.history.listen((location, action) => {
            this.load_chat()
        })
        
    }

    componentDidUpdate() {
        // setTimeout(function(){ 
        //     this.messagesEnd.scrollTop = this.messagesEnd.scrollHeight
        // }, 1000)
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
                // this.messagesEnd.scrollTop = this.messagesEnd.scrollHeight
            })
        }

        if(_.get(this.props.data, 'user.user')) {
            this.setState({
                user: this.props.data.user.user
            })
        }

        if(_.get(this.props.data, 'chat.memberInGroup.data')) {
            this.setState({
                member: _.get(this.props.data, 'chat.memberInGroup.data', []),
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
                <img src={item.url} style={{ width: '145px', padding: '15px', cursor: 'pointer' }}  />
            )
        })
    }

    _image_upload_handler = (e) => {
        console.log(e)
    }

    _file_upload_handler = (e) => {
        console.log(e)
    }

    startRecording = () => {
        this.setState({
            record: true
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
            timer: 0
        })
        clearInterval(this.timer)
        this.setState({stoppedRecording: true, recording: false, paused: false})
    }
    
    onData = (recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    }
    
    onStop = (recordedBlob) => {
        console.log('recordedBlob is: ', recordedBlob);
        this.setState({
            roundRecording: this.state.roundRecording + 1
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
                    <ReactMic
                        record={this.state.record}
                        className="sound-wave"
                        onStop={this.onStop}
                        strokeColor="#000000"
                        backgroundColor="#FF4081" />
                    <button className={ (!this.state.record && this.state.roundRecording == 0) ? 'show' : 'hide' } onClick={this.startRecording} style={{ backgroundColor: '#ff6666', width: '120px', height: '120px', borderRadius: '50%', color: 'white', border: '0px', fontSize: '19px' }} type="button">START</button>
                    <button className={ this.state.record ? 'show' : 'hide' } onClick={this.stopRecording} style={{ backgroundColor: '#ff6666', width: '120px', height: '120px', borderRadius: '50%', color: 'white', border: '0px', fontSize: '19px' }} type="button">
                        STOP <br /> { this.state.timer }
                    </button>
                    <div className={ (!this.state.record && this.state.roundRecording != 0) ? 'show' : 'hide' }>
                        <button onClick={this.startRecording} style={{ backgroundColor: '#edb730', width: '100px', height: '100px', borderRadius: '50%', color: 'white', border: '0px', fontSize: '19px', margin: '10px'  }} type="button">
                            <i className="fa fa-undo" aria-hidden="true" style={{ fontSize: '30px' }}></i>
                        </button>
                        <button onClick={this.stopRecording} style={{ backgroundColor: '#ff6666', width: '100px', height: '100px', borderRadius: '50%', color: 'white', border: '0px', fontSize: '19px', margin: '10px'  }} type="button">SEND</button>
                    </div>
                </div>
            )
        }
    }

    download_file = () => {
        $.ajax({
            url: "http://smnodame.com/public/pictures/11.jpg", 
            type: 'GET',
            headers: {  'Access-Control-Allow-Origin': 'http://localhost:3000' },
            success: () => {
                download.bind(true, "jpg", "file_name.html")
            }
        })
    }

    is_group = () => {
        return _.get(this.state.chatInfo, 'chat_room_type') == 'G' || _.get(this.state.chatInfo, 'chat_room_type') == 'C'
    }

    render_message = () => {
        return _.get(this.state, 'chat', []).map((chat) => {

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

            /* text message */
            if(chat.message_type == '1') {
                return (
                    <div key={chat.chat_message_id} className="row message-body" style={{ marginRight: '10px' }}>
                       
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" }>
                            <div className={ is_show_avatar? 'avatar-icon': 'hide' }  style={{ width: '40px' }}>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } style={{ width: '75px' }}>
                                    { `${moment(chat.create_date).fromNow()}` }
                                    <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                            <div className={ this.state.user.username == chat.username ? "sender": "receiver" }>
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
                    <div key={chat.chat_message_id} className="row message-body">
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" }>
                            <div className={ is_show_avatar? 'avatar-icon': 'hide' }  style={{ width: '40px' }}>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } style={{ width: '75px' }}>
                                { `${moment(chat.create_date).fromNow()}` }
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                            <div className={ this.state.user.username == chat.username ? "sender background-transparent": "receiver background-transparent" }>
                                <img src={ chat.object_url } style={{ width: '200px' }} onClick={() => this.setState({ selected_image: chat.object_url })}  />
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
                    <div key={chat.chat_message_id} className="row message-body">
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" }>
                            <div className={ is_show_avatar? 'avatar-icon': 'hide' }  style={{ width: '40px' }}>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } style={{ width: '75px' }}>
                                { `${moment(chat.create_date).fromNow()}` }
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
                    <div key={chat.chat_message_id} className="row message-body">
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" }>
                            <div className={ is_show_avatar? 'avatar-icon': 'hide' }  style={{ width: '40px' }}>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } style={{ width: '75px' }}>
                                { `${moment(chat.create_date).fromNow()}` }
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                            <div className={ this.state.user.username == chat.username ? "sender background-transparent sticker-right": "receiver background-transparent sticker-left" }>
                                <img src={ chat.object_url } style={{ width: '150px' }}  />
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
                    <div key={chat.chat_message_id} className="row message-body">
                        <div className={ this.state.user.username == chat.username ? "col-sm-12 message-main-sender": "col-sm-12 message-main-receiver" }>
                            <div className={ is_show_avatar? 'avatar-icon': 'hide' }  style={{ width: '40px' }}>
                                <img src={ chat.profile_pic_url } style={{ width: '30px', height: '30px' }} />
                            </div>
                            <span className={ this.state.user.username == chat.username ? "message-time" : "hide" } style={{ width: '75px' }}>
                                { `${moment(chat.create_date).fromNow()}` }
                                <span className={ seenMessage? 'show': 'hide' }><br/>{ seenMessage }</span>
                            </span>
                            <div className={ this.state.user.username == chat.username ? "sender": "receiver"} style={{ height: '64px', padding: '11px' }} onClick={() => this.download_file() }>
                               
                                <div style={{ display: 'flex', cursor: 'pointer' }}>
                                    <i className="fa fa-file" aria-hidden="true" style={{ fontSize: '28px', color: '#3a6d99', backgroundColor: 'rgba(218,228,234,.5)', padding: '5px', textAlign: 'center', paddingTop: '11px', width: '69px', borderRadius: '50%' }}></i>
                                    <div style={{     paddingLeft: '12px' }}>
                                        <p style={{ margin: '0px', fontWeight: 'bold', color: '#3a6d99', whiteSpace: 'nowrap' }}>{ chat.file_name }</p>
                                        <p style={{ margin: '0px', color: '#3a6d99' }}>Download</p>
                                    </div>
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

    render() {
        return (
            <div className="col-sm-8 conversation">
                <div className="row heading header-chat">
                    <div className="col-sm-1 col-md-1 col-xs-1 heading-avatar">
                        <div className="heading-avatar-icon">
                            <img src={ _.get(this.state.chatInfo, 'profile_pic_url') } />
                        </div>
                    </div>
                    <div className="col-sm-5 col-md-5 col-xs-5 heading-name" onClick={() => {
                        this.setState({
                            showContactInfo: true
                        })
                    }}>
                        <a className="heading-name-meta">{ _.get(this.state.chatInfo, 'display_name') }
                        </a>
                        <span className="heading-online">Online</span>
                    </div>
                    <div className={ !this.state.show_search_input ? 'col-sm-1 col-xs-1 heading-dot pull-right' : 'hide' }>
                        <i className="fa fa-search fa-2x  pull-right" aria-hidden="true" onClick={() => this.setState({ show_search_input: true }) }></i>
                    </div>
                    <div className={ this.state.show_search_input ? 'col-sm-5 col-md-5 col-xs-5 pull-right' : 'hide' }>
                        <form onSubmit={this.onSearchMessage}>
                            <div className="input-group">
                                <input type="text" style={{ height: '40px' }} className="form-control" placeholder="Search" value={this.state.filter} aria-describedby="basic-addon1" onChange={(event) => this.setState({filter: event.target.value})} />
                                <a className="input-group-addon" style={{ cursor: 'pointer' }} onClick={() => this.onSearchMessage()}>
                                    <i className='fa fa-search' aria-hidden="true"></i>
                                </a>
                                <a className="input-group-addon" style={{ cursor: 'pointer' }} onClick={() => this.closeSearch()}>
                                    <i className='fa fa-close' aria-hidden="true"></i>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>

                <div onClick={() => this.setState({ footer_selected: '' })} className={!!this.state.footer_selected? 'row message message-small': 'row message' } ref={(el) => { this.messagesEnd = el }}>
                    <div className="row message-previous">
                        <div className="col-sm-12 previous">
                            <a onClick={() => store.dispatch(onLoadMoreMessageLists(this.state.filter))}>
                                Show Previous Message!
                            </a>
                        </div>
                    </div>
                    {
                        this.render_message()
                    }
                </div>
                <input id="image-upload" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this._image_upload_handler} aria-describedby="fileHelp" />
                <input id="file-upload" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this._file_upload_handler} aria-describedby="fileHelp" />

                <div className="row reply">
                    <div style={{ display: 'flex' }}>
                        <i className="fa fa-smile-o fa-2x" style={{ padding: '10px', color: '#93918f' }} onClick={() => {
                            this.setState({
                                footer_selected: 'sticker'
                            })
                        }}></i>
                        <i className="fa fa-file-image-o fa-2x" style={{ padding: '10px', color: '#93918f' }} 
                            onClick={() => {
                                $('#image-upload').trigger('click')
                            }}
                        ></i>
                        <i className="fa fa-file-o fa-2x" style={{ padding: '10px', color: '#93918f' }}
                            onClick={() => {
                                $('#file-upload').trigger('click')
                            }}
                        ></i>
                        <i className="fa fa-camera fa-2x" style={{ padding: '10px', color: '#93918f' }}
                            onClick={() => {
                                this.setState({
                                    showCamera: true
                                }, () => {
                                    this.openCamera()
                                })
                            }}
                        ></i>
                        <textarea className="form-control" rows="1" id="comment" style={{ marginLeft: '10px', marginRight: '10px' }}></textarea>
                        <i className="fa fa-microphone fa-2x" aria-hidden="true" style={{ padding: '10px', color: '#93918f' }} onClick={() => {
                            this.setState({
                                footer_selected: 'record'
                            })
                        }}></i>
                        <i className="fa fa-send fa-2x" aria-hidden="true" style={{ padding: '10px', color: '#93918f' }}></i>
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
                            <div style={{ display: 'flex', backgroundColor: '#eee' }}>
                                <div className='avatar-icon' style={{ width: '100px', margin: '20px' }}>
                                    <img src={ _.get(this.state.chatInfo, 'profile_pic_url') } style={{ width: '80px', height: '80px' }} />
                                </div>
                                <span style={{ fontSize: '23px', fontWeight: '200', padding: '20px', marginTop: '20px' }}>{ _.get(this.state.chatInfo, 'display_name') }</span>
                            </div>
                            <div style={{ display: 'flex', paddingTop: '15px', paddingBottom: '15px' }}>
                                <div style={{ width: '200px', textAlign: 'center'  }}>
                                    <i className="fa fa-user fa-2x" aria-hidden="true" style={{ padding: '10px', paddingLeft: '35px' }}></i>
                                </div>
                                <div>
                                    <p style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }}>Invite</p>
                                    <p className={ this.is_group()? '' : 'hide' } style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }}>Open case</p>
                                    <div style={{ borderBottom: '1px solid #dfdfdf', marginTop: '10px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', paddingTop: '15px', paddingBottom: '15px' }}>
                                <div style={{ width: '200px', textAlign: 'center'  }}>
                                    <i className="fa fa-bars fa-2x" aria-hidden="true" style={{ padding: '10px', paddingLeft: '35px' }}></i>
                                </div>
                                <div>
                                    <p style={{ fontSize: '16px', padding: '5px', cursor: 'pointer' }} onClick={() => {
                                        store.dispatch(onHideChat())
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
                                    }}>Delete chat</p>
                                </div>
                            </div>
                            <div className={ this.is_group()? '' : 'hide' } style={{ borderTop: '1px solid #dfdfdf', minHeight: '12px', background: '#f5f5f5' }} />
                            <div className={ this.is_group()? '' : 'hide' } style={{ display: 'flex', paddingTop: '15px', paddingBottom: '15px' }}>
                                <div style={{ width: '200px', textAlign: 'center'  }}>
                                    <i className="fa fa-users fa-2x" aria-hidden="true" style={{ padding: '10px', paddingLeft: '35px' }}></i>
                                </div>
                                <div>
                                    {
                                        this.state.member.map((member) => (<div style={{ paddingTop: '8px', paddingBottom: '8px', display: 'flex' }}>
                                            <div className='avatar-icon'  style={{ width: '60px' }}>
                                                <img src={ _.get(member, 'profile_pic_url') } style={{ width: '50px', height: '50px' }} />
                                            </div>
                                            <p style={{ fontSize: '16px', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>{ member.display_name }</p>
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
        )
    }
}

export default Content
