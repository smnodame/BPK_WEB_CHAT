import _ from 'lodash'
import React from 'react'
import $ from 'jquery'
import io from 'socket.io-client'

import { store } from '../../redux'
import { callDialog } from '../../redux/actions.js'
import { emit_hangup } from '../../redux/socket.js'

var socket = io('https://192.168.1.39:4443/', {
    transports: ['websocket']
})

export var join_room = null

var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection
var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia

var twilioIceServers = [
        { url: 'stun:global.stun.twilio.com:3478?transport=udp' }
]

var configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]}

var pcPeers = {}
var selfView;
var remoteViewContainer;
var localStream;
var can_start_rct = false
var container;
var countTimer;

function getLocalStream(callback) {
    if(can_start_rct) {
        selfView = document.getElementById("selfView")
        remoteViewContainer = document.getElementById("remoteViewContainer")
        navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
            localStream = stream
            selfView.src = URL.createObjectURL(stream)
            selfView.muted = true;

            callback()
        }, logError)
    }
}

function createPC(socketId, isOffer) {
    var pc = new RTCPeerConnection(configuration)
    pcPeers[socketId] = pc

    pc.onicecandidate = function (event) {
        console.log('onicecandidate', event)
        if (event.candidate) {
            socket.emit('exchange', {'to': socketId, 'candidate': event.candidate })
        }
    }

    function createOffer() {
        pc.createOffer(function(desc) {
            console.log('createOffer', desc)
            pc.setLocalDescription(desc, function () {
                console.log('setLocalDescription', pc.localDescription)
                socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription })
            }, logError)
        }, logError)
    }

    pc.onnegotiationneeded = function () {
        console.log('onnegotiationneeded')
        if (isOffer) {
            createOffer()
        }
    }

    pc.oniceconnectionstatechange = function(event) {
        console.log('oniceconnectionstatechange', event)
        if (event.target.iceConnectionState === 'connected') {
            createDataChannel()
        }
    }

    pc.onsignalingstatechange = function(event) {
        console.log('onsignalingstatechange', event)
    }

    pc.onaddstream = function (event) {
        console.log('onaddstream', event)
        var element = document.createElement('video')
        element.id = "remoteView" + socketId
        element.autoplay = 'autoplay'
        element.src = URL.createObjectURL(event.stream)
        remoteViewContainer.appendChild(element)
    }

    pc.addStream(localStream)

    function createDataChannel() {
    if (pc.textDataChannel) {
        return
    }
    var dataChannel = pc.createDataChannel("text")

    dataChannel.onerror = function (error) {
        console.log("dataChannel.onerror", error)
    }

    dataChannel.onmessage = function (event) {
        console.log("dataChannel.onmessage:", event.data)
    }

    dataChannel.onopen = function () {
        console.log('dataChannel.onopen')
    }

    dataChannel.onclose = function () {
        console.log("dataChannel.onclose")
    }

        pc.textDataChannel = dataChannel
    }
    return pc
}

function exchange(data) {
    var fromId = data.from
    var pc
    if (fromId in pcPeers) {
        pc = pcPeers[fromId]
    } else {
        pc = createPC(fromId, false)
    }

    if (data.sdp) {
        console.log('exchange sdp', data)
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
            if (pc.remoteDescription.type == "offer")
                pc.createAnswer(function(desc) {
                    console.log('createAnswer', desc)
                    pc.setLocalDescription(desc, function () {
                    console.log('setLocalDescription', pc.localDescription)
                    socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription })
                    }, logError)
                }, logError)
            }, logError)
    } else {
        console.log('exchange candidate', data)
        pc.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
}

function leave(socketId) {
    console.log('leave', socketId)
    var pc = pcPeers[socketId]
    pc.close()
    delete pcPeers[socketId]
    var video = document.getElementById("remoteView" + socketId)
    if (video) video.remove()
    stopCamera()
}

function logError(error) {
    console.log("logError", error)
}

function stopCamera() {
    if(_.get(localStream, 'getTracks')) {
        const streams = localStream.getTracks() || []
        streams.forEach((stream) => {
            stream.stop()
        })
    }
    socket.disconnect()
}

function start_calling() {
    
    join_room = function(roomID) {
        socket.connect()

        console.log('join room', roomID)

        can_start_rct = true
        getLocalStream(() => {
            socket.emit('join', roomID, function(socketIds){
                console.log('join', socketIds)
                for (var i in socketIds) {
                    var socketId = socketIds[i]
                    createPC(socketId, true)
                }
            })

            countTimer = setInterval(function(){ 
                container.setState({
                    timer: container.state.timer + 1
                })
            }, 1000)
        })
    }
    
    socket.on('exchange', function(data){
        exchange(data)
    })
    
    socket.on('leave', function(socketId){
        leave(socketId)
    })
    
    socket.on('connect', function(data) {
        console.log('connect')
    })
    
    socket.on('exchange', function(data){
        exchange(data)

        container.setState({
            connected: true
        })
    })
    
    socket.on('leave', function(socketId){
        console.log(' going to leave ')
        
        stopCamera()

        // hide call dialog
        store.dispatch(callDialog(false))

        // clear timer
        clearInterval(countTimer)
        container.setState({
            timer: 0,
            connected: false
        })
        
        leave(socketId)
    })
}

function onMute(kind) {
    const streams = localStream.getTracks() || []
    streams.forEach((stream) => {
        if(stream.kind == kind) {
            stream.enabled = !stream.enabled    
            console.log(stream.enabled)        
        }
    })
}

export class Calling extends React.Component {
    constructor(props) {
        super(props)
        // link container with this
        container = this

        this.state = {
            isShowModal: false,
            timer: 0,
            connected: false
        }
    }

    componentDidMount = () => {
        start_calling()
    }

    join_room = () => {
        this.setState({
            isRinging: false
        }, () => {
            join_room('abc')
        })
    }

    leave_room = () => {
        console.log(' leave room ')
        socket.disconnect()
        stopCamera()
        
        emit_hangup(this.state.callData.sender, this.state.callData.receiver)

        // hide call dialog
        store.dispatch(callDialog(false))

        // clear timer
        clearInterval(countTimer)
        this.setState({
            timer: 0,
            connected: false
        })
    }

    componentWillReceiveProps() {
        if(_.get(this.props.data, 'system')) {
            this.setState({
                isShowModal: this.props.data.system.isShowCallDialog
            })
        }

        if(_.get(this.props.data, 'system.callData')) {
            this.setState({
                callData: this.props.data.system.callData,
                isRinging: this.props.data.system.callData.isRinging
            })
        }
    }

    protectParentOnclick = (e) => {
        e.stopPropagation()
    }

    render() {
        return (
            <div style={{ height: 'auto' }}>
                <div id="textRoom" style={{ display: 'none' }}>
                    <div id="textRoomContent">
                        <h3>Text Room</h3>
                    </div>
                    <input id="textRoomInput" / >
                    <video id="selfView" autoplay></video>
                    <div id="remoteViewContainer"></div>
                </div>
               
                <div className={this.state.isShowModal? 'modal-profile': 'hide' } onClick={() => {}}>
                    <div className="container" onClick={this.protectParentOnclick}>
                        <div className="profile-box">
                            <div className="profile-picture" style={{ marginTop: '60px', position: 'initial', top: '0px', marginLeft: 'auto', textAlign: 'center' }}>
                                <img src={ _.get(this.state, 'callData.photo') } />
                            </div>
                            <div className="profile-content">
                                <h1 style={{ fontSize: '28px' }}>
                                   { _.get(this.state, 'callData.name') }
                                </h1>
                                <p className={!this.state.connected? '': 'hide'} style={{ fontSize: '20px' }}>
                                    { this.state.isRinging ? 'Ringing...' : 'Connecting...' }
                                </p>
                                <p className={this.state.connected? '': 'hide'} style={{ fontSize: '20px' }}>
                                    Connected
                                </p>
                                <div className='socials' style={{ marginTop: '25px' }}>
                                    <div>
                                        <button
                                            onClick={() => onMute('video')}
                                            className={_.get(this.state, 'isRinging')? 'hide' : ''}
                                            style={{
                                                backgroundColor: !this.state.mute? '#D3D3D3' : '#edb730',
                                                width: '70px',
                                                height: '70px',
                                                borderRadius: '50%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: '10px'
                                            }}>
                                            <i className='fa fa-volume-up' style={{ color: 'white', fontSize: 25 }}/>
                                        </button>
                                        <button
                                            onClick={() => onMute('audio')}
                                            className={_.get(this.state, 'isRinging')? 'hide' : ''}
                                            style={{
                                                backgroundColor: !this.state.mute? '#D3D3D3' : '#edb730',
                                                width: '70px',
                                                height: '70px',
                                                borderRadius: '50%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: '10px'
                                            }}>
                                            <i className='fa fa-microphone' style={{ color: 'white', fontSize: 25 }}/>
                                        </button>
                                        <button
                                            className={_.get(this.state, 'isRinging')? 'hide' : ''}
                                            onClick={() => this.leave_room()}
                                            style={{
                                                backgroundColor: '#ff6666',
                                                width: '70px',
                                                height: '70px',
                                                borderRadius: '50%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: '10px'
                                            }}>
                                            <i className='fa fa-phone-hangup' style={{ color: 'white', fontSize: 25 }}  />
                                        </button>

                                        <button
                                            className={_.get(this.state, 'isRinging')? '' : 'hide'}
                                            onClick={() => this.join_room()}
                                            style={{
                                                backgroundColor: 'green',
                                                width: '70px',
                                                height: '70px',
                                                borderRadius: '50%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: '10px'
                                            }}>
                                            <i className='fa fa-phone' style={{ color: 'white', fontSize: 25 }}  />
                                        </button>

                                        <button
                                            className={_.get(this.state, 'isRinging')? '' : 'hide'}
                                            onClick={() => this.leave_room()}
                                            style={{
                                                backgroundColor: '#ff6666',
                                                width: '70px',
                                                height: '70px',
                                                borderRadius: '50%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: '10px'
                                            }}>
                                            <i className='fa fa-phone-hangup' style={{ color: 'white', fontSize: 25 }}  />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}