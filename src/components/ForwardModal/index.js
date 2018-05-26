import _ from 'lodash'
import $ from 'jquery'
import React, { Component } from 'react'

import { onUpdateProfile, isShowUserProfile } from '../../redux/actions.js'
import { store } from '../../redux'
import { Modal, Button } from 'react-bootstrap'


class ForwardModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    
    componentDidMount() {
    }

    componentWillReceiveProps() {
    }

    render = () => {
        return (
            <div className="static-modal">
            <Modal show={true} onHide={() => {
                    
                }}>
                <Modal.Header style={{ backgroundColor: '#eee' }}>
                    <Modal.Title>Forward Message To</Modal.Title>
                </Modal.Header>
                <div>
                    
                </div>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
        )
    }
}

export default ForwardModal