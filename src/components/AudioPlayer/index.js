import React from 'react'
import $ from 'jquery'
  
class AudioPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <audio controls className="player" preload="false">
                <source src="http://www.nihilus.net/soundtracks/Static%20Memories.mp3" />
            </audio>
        )
    }
}
  export default AudioPlayer