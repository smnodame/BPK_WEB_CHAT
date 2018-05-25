import _ from 'lodash'
import $ from 'jquery'
import React, { Component } from 'react'

import { onUpdateProfile, isShowUserProfile } from '../../redux/actions.js'
import { store } from '../../redux'
import { Modal, Button } from 'react-bootstrap'

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

class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    
    componentDidMount() {
        this.load_data()
    }

    load_data = () => {
        if(_.get(this.props.data, 'user.user')) {
            this.setState({
                display_name: _.get(this.props.data, 'user.user.display_name', ''),
                username: _.get(this.props.data, 'user.user.username', ''),
                hn: _.get(this.props.data, 'user.user.hn', ''),
                status_quote: _.get(this.props.data, 'user.user.status_quote', ''),
                wall_pic_url: _.get(this.props.data, 'user.user.wall_pic_url', ''),
                profile_pic_url: _.get(this.props.data, 'user.user.profile_pic_url', ''),
                user_id: _.get(this.props.data, 'user.user.user_id', ''),
                profile_pic_base64: '',
                wall_pic_base64: ''
            })
        }

        if(_.get(this.props.data, 'system')) {
            this.setState({
                isShowUserProfile: _.get(this.props.data, 'system.isShowUserProfile')
            })
        }
    }

    componentWillReceiveProps() {
        this.load_data()
    }

    saveProfile = (e) => {
        if(e) {
            e.preventDefault()            
        }

        this.setState({
            errorMessage: ''
        })

        const profile = {
            user_id: this.state.user_id,
            display_name: this.state.display_name,
            status_quote: this.state.status_quote,
            hn: this.state.hn,
            password: this.state.newPassword
        }
        
        if(this.state.newPassword === this.state.confirmPassword) {
            if(!_.get(this.state, 'newPassword') || _.get(this.state, 'newPassword.length', 0) >= 6) {
                store.dispatch(onUpdateProfile(
                    profile,
                    {
                        user_id: this.state.user_id,
                        wall_pic_base64: this.state.wall_pic_base64,
                        profile_pic_base64: this.state.profile_pic_base64
                    }
                ))
            } else {
                this.setState({
                    errorMessage: '* Password should has at least 6 charactors'
                })
            }
        } else {
            this.setState({
                errorMessage: '* Password is not matched'
            })
        }
  
    }
    
    profileImageChangeHandler = (e) => {
        getBase64(e.target.files[0]).then(res => {
            this.setState({
                profile_pic_base64: res || ''
            })
        })
    }

    coverImageChangeHandler = (e) => {
        getBase64(e.target.files[0]).then(res => {
            this.setState({
                wall_pic_base64: res || ''
            })
        })
    }

    render = () => {
        return (
            <div className="static-modal">
            <Modal show={this.state.isShowUserProfile} onHide={() => {
                    store.dispatch(isShowUserProfile(false))
                }}>
                <Modal.Header style={{ backgroundColor: '#eee' }}>
                    <Modal.Title>User Profile</Modal.Title>
                </Modal.Header>
                <div>
                    <input id="profile-image" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this.profileImageChangeHandler} aria-describedby="fileHelp" />
                    <input id="cover-image" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this.coverImageChangeHandler} aria-describedby="fileHelp" />
                    
                    <div style={{ display: 'flex', backgroundColor: '#eee', backgroundImage: `url("${ this.state.wall_pic_base64 || this.state.wall_pic_url }")` }}>
                        <div style={{ display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                            <div className='avatar-icon' style={{ width: '100px', margin: '20px' }} >
                                <button type="button" className="btn btn-default" style={{ right: '5px',
                                    position: 'absolute',
                                    top: '5px',
                                    backgroundColor: '#FFFD'}} 
                                    onClick={() => {
                                        $('#cover-image').trigger('click')
                                    }}>
                                        Change Cover Image
                                </button>
                                <img src={this.state.profile_pic_base64 || this.state.profile_pic_url} style={{ width: '80px', height: '80px' }} onClick={() => {
                                    $('#profile-image').trigger('click')
                                }} />
                            </div>
                            <span style={{ fontSize: '19px', fontWeight: 'bold', padding: '20px', marginTop: '20px', color: '#fff', width: 'auto !important' }}>{ _.get(this.state, 'display_name') }</span>
                        </div>
                    </div>    
                    <div style={{ display: 'flex', paddingTop: '15px', paddingBottom: '15px' }}>
                        <div style={{ width: '200px', textAlign: 'center'  }}>
                            <i className="fa fa-user fa-2x" aria-hidden="true" style={{ padding: '10px', paddingLeft: '35px' }}></i>
                        </div>
                        <div>
                            <div className="form-group col-md-12">
                                <label>Display Name</label>
                                <input type="text" className="form-control" placeholder="Display Name" value={this.state.display_name}  onChange={(event) => this.setState({display_name: event.target.value})} />
                            </div>
                            <div className="form-group col-md-12">
                                <label>HN</label>
                                <input type="text" className="form-control"  placeholder="HN" value={this.state.hn}  onChange={(event) => this.setState({hn: event.target.value})} />
                            </div>
                            <div className="form-group col-md-12">
                                <label>Status</label>
                                <input type="text" className="form-control" placeholder="Status"  value={this.state.status_quote}  onChange={(event) => this.setState({status_quote: event.target.value})} />
                            </div>
                            <div style={{ borderBottom: '1px solid #dfdfdf', marginTop: '10px' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', paddingTop: '15px', paddingBottom: '15px' }}>
                        <div style={{ width: '200px', textAlign: 'center'  }}>
                            <i className="fa fa-lock fa-2x" aria-hidden="true" style={{ padding: '10px', paddingLeft: '35px' }}></i>
                        </div>
                        <div>
                            <div className="form-group col-md-6">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Password" value={this.state.newPassword}  onChange={(event) => this.setState({newPassword: event.target.value})} />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Confirm Password</label>
                                <input type="password" className="form-control"  placeholder="Confirm Password" value={this.state.confirmPassword}  onChange={(event) => this.setState({confirmPassword: event.target.value})} />
                            </div>
                            
                            <div style={{ borderBottom: '1px solid #dfdfdf', marginTop: '10px' }} />
                        </div>
                    </div>
                </div>
                <Modal.Footer>
                    <small  className="form-text text-muted" style={{ marginRight: '15px' }}> { this.state.errorMessage || '* leave the passwords empty, if you do not want to change' }</small>
                    
                    <Button onClick={() => {
                        store.dispatch(isShowUserProfile(false))
                    }}>Close</Button>
                    <Button className="btn btn-primary" onClick={() => {
                        this.saveProfile()
                    }}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
        )
    }
}

export default UserProfile