import React from 'react'
import $ from 'jquery'
import io from 'socket.io-client'


var socket = io('http://192.168.1.39:4443/', {
    transports: ['websocket']
})

var join_room = null

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

function getLocalStream() {
    selfView = document.getElementById("selfView")
    remoteViewContainer = document.getElementById("remoteViewContainer")
    navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
        localStream = stream
        selfView.src = URL.createObjectURL(stream)
        selfView.muted = true;
    }, logError)
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
    const streams = localStream.getTracks() || []
    streams.forEach((stream) => {
        stream.stop()
    })
    socket.disconnect()
}

function start_calling() {
    
    join_room = function(roomID) {
        socket.emit('join', roomID, function(socketIds){
            console.log('join', socketIds)
            for (var i in socketIds) {
                var socketId = socketIds[i]
                createPC(socketId, true)
            }
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
        getLocalStream()
    })
    
    socket.on('exchange', function(data){
        exchange(data)
    });
    
    socket.on('leave', function(socketId){
        leave(socketId)
    })
}

class Calling extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount = () => {
        start_calling()
    }

    join_room = () => {
        socket.connect()
        join_room('abc')
    }

    leave_room = () => {
        socket.disconnect()
        stopCamera()
    }

    render() {
        return (
            <div style={{ height: 'auto' }}>
                <div>
                    <input id="roomID" value="abc" />
                    <button onClick={() => this.join_room()}>Join room</button>
                    <button onClick={() => this.leave_room()}>Leave room</button>
                </div>
                <div id="textRoom">
                    <div id="textRoomContent">
                        <h3>Text Room</h3>
                    </div>
                    <input id="textRoomInput" / >
                    <video id="selfView" autoplay></video>
                <div id="remoteViewContainer"></div>
                </div>
               
                
            </div>
        )
    }
}
  export default Calling