import _ from 'lodash'
import $ from 'jquery'
import React, { Component } from 'react'

import { onUpdateProfile } from '../../redux/actions.js'
import { store } from '../../redux'

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
                user_id: _.get(this.props.data, 'user.user.user_id', '')
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
            <div className="col-sm-8 conversation">
                <div className="row heading">
                    <a className="heading-name-meta">USER PROFILE
                    </a>
                </div>
                <div style={{ overflowY: 'scroll' }}>
                    <form onSubmit={this.saveProfile}>
                        <div className="col-md-12">
                            <div className="setting-profile">
                                <div className="container">
                                    <div className="profile-box">
                                        <div className="profile-cover-image" >
                                            <button type="button" className="btn btn-default" style={{ right: '5px',
                                                position: 'absolute',
                                                top: '5px',
                                                backgroundColor: '#FFFD'}} 
                                                onClick={() => {
                                                    $('#cover-image').trigger('click')
                                            }}>
                                                    Change Cover Image
                                            </button>
                                            <img src={this.state.wall_pic_base64 || this.state.wall_pic_url} onClick={() => {
                                                $('#cover-image').trigger('click')
                                            }} />
                                        </div>
                                        <div className="profile-picture">
                                            <img src={this.state.profile_pic_base64 || this.state.profile_pic_url} onClick={() => {
                                                $('#profile-image').trigger('click')
                                            }} />
                                        </div>
                                        <div className="profile-content">
                                            <h1 style={{ fontSize: '28px' }}>
                                                {this.state.display_name}
                                            </h1>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-6" style={{ marginBottom: '20px' }}>
                                <div class="form-group">
                                    <input id="profile-image" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this.profileImageChangeHandler} aria-describedby="fileHelp" />
                                </div>
                            </div>
                            <div className="col-md-6" style={{ marginBottom: '20px' }}>
                                <div class="form-group">
                                    <input id="cover-image" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this.coverImageChangeHandler} aria-describedby="fileHelp" />
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Display Name</label>
                                <input type="text" className="form-control" placeholder="Display Name" value={this.state.display_name}  onChange={(event) => this.setState({display_name: event.target.value})} />
                            </div>
                            <div className="form-group col-md-6">
                                <label>HN</label>
                                <input type="text" className="form-control"  placeholder="HN" value={this.state.hn}  onChange={(event) => this.setState({hn: event.target.value})} />
                            </div>
                        </div>
                        <div className="form-group col-md-12">
                            <label>Status</label>
                            <input type="text" className="form-control" placeholder="Status"  value={this.state.status_quote}  onChange={(event) => this.setState({status_quote: event.target.value})} />
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Password" value={this.state.newPassword}  onChange={(event) => this.setState({newPassword: event.target.value})} />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Confirm Password</label>
                                <input type="password" className="form-control"  placeholder="Confirm Password" value={this.state.confirmPassword}  onChange={(event) => this.setState({confirmPassword: event.target.value})} />
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginBottom: '10px' }}>
                            <small  className="form-text text-muted" > { this.state.errorMessage || '* leave the passwords empty, if you do not want to change' }</small>
                        </div>
                        <div className="col-md-6">
                            <button type="submit" className="btn btn-primary" onClick={() => this.saveProfile()}>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default UserProfile