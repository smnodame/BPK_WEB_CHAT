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
                <source src={this.props.src} />
            </audio>
        )
    }
}
  export default AudioPlayer