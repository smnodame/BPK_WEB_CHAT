import _ from 'lodash'
import $ from 'jquery'
import React, { Component } from 'react'

import { updatePicture, updateGroupSetting } from '../../redux/api'
import { onUpdateGroupLists, onUpdateGroupSetting } from '../../redux/actions'
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

class GroupSetting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }
    
    componentDidMount() {
        this.load_data()
    }

    load_data = () => {
        if(_.get(this.props.history, 'location.state.selectedFriend')) {
            const group = this.props.history.location.state.selectedFriend
            this.setState({
                display_name: _.get(group, 'display_name', ''),
                wall_pic_url: _.get(group, 'wall_pic_url', ''),
                profile_pic_url: _.get(group, 'profile_pic_url', ''),
                patient_name: _.get(group, 'c_patient_name', ''),
                hn: _.get(group, 'c_hn', ''),
                description: _.get(group, 'c_description', ''),
                chat_room_id: _.get(group, 'chat_room_id', ''),
                chat_room_type: _.get(group, 'chat_room_type', 'Z')
            })
        }
    }

    componentWillReceiveProps() {
        this.load_data()
    }

    saveProfile = async (e) => {
        if(e) {
            e.preventDefault()            
        }

        this.setState({
            errorMessage: ''
        })
        
        if(!this.state.display_name) {
            this.setState({
                errorMessage: '* Display name should not be empty'
            })
        }
        
        const oldSetting = this.props.history.location.state.selectedFriend
        if (
            this.props.history.location.state.selectedFriend.wall_pic_url != this.state.wall_pic_url ||
            this.props.history.location.state.selectedFriend.profile_pic_url != this.state.profile_pic_url
        ) {
            const data = {
                chat_room_id: this.state.chat_room_id
            }
            if(this.state.profile_pic_base64) {
                data.profile_pic_base64 = this.state.profile_pic_base64
            }
            if(this.state.wall_pic_base64) {
                data.wall_pic_base64 = this.state.wall_pic_base64
            }
            const resUpdatePicture = await updatePicture(data)
        }
  
        const groupData = {
            chat_room_id: this.state.chat_room_id,
            display_name: this.state.display_name,
            patient_name: this.state.patient_name,
            hn: this.state.hn,
            description: this.state.description
        }
  
        await updateGroupSetting(groupData)

        store.dispatch(onUpdateGroupSetting({
            wall_pic_url: this.state.wall_pic_url,
            profile_pic_url: this.state.profile_pic_url,
            hn: this.state.hn,
            patient_name: this.state.patient_name,
            description: this.state.description,
            display_name: this.state.display_name,
            chat_room_id: this.state.chat_room_id,
            chat_room_type: this.state.chat_room_type
        }))
    }
    
    profileImageChangeHandler = (e) => {
        getBase64(e.target.files[0]).then(res => {
            this.setState({
                profile_pic_url: res,
                profile_pic_base64: res || ''
            })
        })
    }

    coverImageChangeHandler = (e) => {
        getBase64(e.target.files[0]).then(res => {
            this.setState({
                wall_pic_url: res,
                wall_pic_base64: res || ''
            })
        })
    }

    render = () => {
        return (
            <div className="col-sm-8 conversation">
                <div className="row heading">
                    <a className="heading-name-meta">GROUP SETTING
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
                            <div className="form-group col-md-12">
                                <label>Display Name</label>
                                <input type="text" className="form-control" placeholder="Display Name" value={this.state.display_name}  onChange={(event) => this.setState({display_name: event.target.value})} />
                            </div>
                        </div>
                        <div className={this.state.chat_room_type=='C'? 'form-row' : 'hide'}>
                            <div className="form-group col-md-6">
                                <label>Patient Name</label>
                                <input type="text" className="form-control" placeholder="Patient Name" value={this.state.patient_name}  onChange={(event) => this.setState({patient_name: event.target.value})} />
                            </div>
                            <div className="form-group col-md-6">
                                <label>HN</label>
                                <input type="text" className="form-control"  placeholder="HN" value={this.state.hn}  onChange={(event) => this.setState({hn: event.target.value})} />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Description</label>
                                <input type="text" className="form-control"  placeholder="Description" value={this.state.description}  onChange={(event) => this.setState({description: event.target.value})} />
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginBottom: '10px' }}>
                            <small  className="form-text text-muted" > { this.state.errorMessage || '' }</small>
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

export default GroupSetting