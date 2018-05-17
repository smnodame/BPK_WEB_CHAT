import _ from 'lodash'
import React from 'react'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import Friend from '../Friend'

import { enterContacts, removeFavorite, addFavorite, showOrHideFriendLists, onLoadMore, onSearchFriend, selectChat, onSelectKeep } from '../../redux/actions.js'
import { store } from '../../redux'

class Contact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            is_show_favorite: true,
            is_show_group: true,
            is_show_department: true,
            is_show_other: true,
            numberOfFriendLists: {
                favorite: 0,
                other: 0,
                group: 0,
                department: 0
            },
            friends: {
                favorite: [],
                other: [],
                group: [],
                department: []
            }
        }

        this.navigateToChat = () => {
            props.navigateToChat()
        }
    }

    componentDidMount() {
        
    }

    toggleFavorite = () => {
        this.setState({
            is_show_favorite: !this.state.is_show_favorite
        })
    }

    toggleGroup = () => {
        this.setState({
            is_show_group: !this.state.is_show_group
        })
    }

    toggleDepartment = () => {
        this.setState({
            is_show_department: !this.state.is_show_department
        })
    }

    toggleOther = () => {
        this.setState({
            is_show_other: !this.state.is_show_other
        })
    }
    
    componentWillReceiveProps() {
        if(_.get(this.props.data, 'friend.numberOfFriendLists')) {
            this.setState({
                numberOfFriendLists: this.props.data.friend.numberOfFriendLists
            })
        }

        if(_.get(this.props.data, 'friend.friends')) {
            this.setState({
                friends: this.props.data.friend.friends
            })
        }

        if(_.get(this.props.data, 'user.user')) {
            this.setState({
                user: this.props.data.user.user
            })
        }
    }
    
    loadmore = (group) => {
        store.dispatch(onLoadMore(group))
    }

    renderFriend = (friends) => {
        return friends.map((friend, key) => {
            return (
                <div className="box" key={key} onClick={() => this.setState({ selectedFriend: friend, isShowModal: true })}>
                    <Friend image={friend.profile_pic_url} name={friend.display_name} status={friend.status_quote} />
                </div>
            )
        })
    }

    onSearchFriend = (e) => {
        e.preventDefault()
        store.dispatch(onSearchFriend(this.state.filter))
    }

    protectParentOnclick = (e) => {
        e.stopPropagation()
    }

    isInFavorite = () => {
        if(_.get(this.state, 'friends') && _.get(this.state, 'selectedFriend')) {
            const obj = this.state.friends.favorite.find((friend) => {
                return friend.friend_user_id == this.state.selectedFriend.friend_user_id
            })
            return !!obj
        }
        return false
    }
    
    _removeFavorite = () => {
        const selectedFriend = this.state.selectedFriend
        selectedFriend.is_favorite = 'F'
        this.setState({
            selectedFriend
        })
        console.log(this.state.numberOfFriendLists)
        store.dispatch(removeFavorite(this.state.user.user_id, this.state.selectedFriend.friend_user_id))
    }

    _addFavorite = () => {
        const selectedFriend = this.state.selectedFriend
        selectedFriend.is_favorite = 'T'
        this.setState({
            selectedFriend
        })
        console.log(this.state.numberOfFriendLists)
        store.dispatch(addFavorite(this.state.user.user_id, this.state.selectedFriend.friend_user_id, this.state.selectedFriend))
    }

    _toggleFavorite = () => {
        if(this.state.selectedFriend.is_favorite == 'T') {
            this._removeFavorite()
        } else {
            this._addFavorite()
        }
    }

    _go_to_group_setting = () => {
        this.setState({
            isShowModal: false
        }, () => {
            this.props.history.push({
                pathname: '/group-setting/' + this.state.selectedFriend.chat_room_id,
                state: { selectedFriend: this.state.selectedFriend }
            })
        })
    }

    render = () => {
        return (
            <div>
                <div className="row heading">
                    <div className="col-sm-2 col-xs-2 heading-avatar">
                        <div className="heading-avatar-icon" onClick={() => this.props.history.push('/user-profile') }>
                            <img src={ _.get(this.state, 'user.profile_pic_url') } />
                        </div>
                    </div>
                    <div className="col-sm-6 col-xs-6 heading-name">
                        <a className="heading-name-meta">{ _.get(this.state, 'user.display_name') }
                        </a>
                        <span className="heading-online">Online</span>
                    </div>
                    <div className="col-sm-1 col-xs-1  heading-dot  pull-right">
                        <i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
                    </div>
                    <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                        <i className="fa fa-comments fa-2x  pull-right" aria-hidden="true" onClick={() => this.navigateToChat()}></i>
                    </div>
                </div>
                <div className={this.state.isShowModal? 'modal-profile': 'hide'} onClick={() => this.setState({ isShowModal: false })}>
                    <div className="container" onClick={this.protectParentOnclick}>
                        <div className="profile-box">
                            <div className="profile-cover-image">
                                <img src={ _.get(this.state, 'selectedFriend.wall_pic_url')} />
                            </div>
                            <div className="profile-picture">
                                <img src={ _.get(this.state, 'selectedFriend.profile_pic_url')} />
                            </div>
                            <div className="profile-content">
                                <h1 style={{ fontSize: '28px' }}>
                                    { _.get(this.state, 'selectedFriend.display_name')}
                                </h1>
                                <p style={{ fontSize: '20px' }}>
                                    { _.get(this.state, 'selectedFriend.friend_username') }
                                </p>
                                <div className={ _.get(this.state, 'selectedFriend.chat_room_type') == 'C'? 'show': 'hide' } style={{ height: 'auto !important' }}>
                                    <p style={{ fontSize: '15px' }}>
                                        Patient Name : { _.get(this.state, 'selectedFriend.c_patient_name') || '-' }
                                    </p>
                                    <p style={{ fontSize: '15px' }}>
                                        HN : { _.get(this.state, 'selectedFriend.c_hn') || '-' }
                                    </p>
                                    <p style={{ fontSize: '15px' }}>
                                        Description : { _.get(this.state, 'selectedFriend.c_description') || '-' }
                                    </p>
                                </div>   
                                <div className={ _.get(this.state, 'selectedFriend.chat_room_type') == 'N'? 'socials': 'hide' } style={{ marginTop: '20px' }}>
                                    <a>
                                        <i className="fa fa-comments" style={{ fontSize: '35px' }} onClick={() => {
                                            this.setState({
                                                isShowModal: false
                                            }, () => {
                                                this.props.history.push('/chat/' + this.state.selectedFriend.chat_room_id)
                                            })
                                        }}></i></a><a>
                                        <i className="fa fa-phone-square" style={{ fontSize: '35px' }}></i></a><a>
                                        <i className="fa fa-heart" style={{ fontSize: '35px', color: this.isInFavorite()? '#ff6666': '#d2d2d2' }} onClick={() => this._toggleFavorite() }></i>
                                    </a>
                                </div>
                                <div className={ _.get(this.state, 'selectedFriend.chat_room_type') != 'N'? 'socials': 'hide' } style={{ marginTop: '20px' }}>
                                    <a>
                                        <i className="fa fa-comments" style={{ fontSize: '35px' }} onClick={() => {
                                            this.setState({
                                                isShowModal: false
                                            }, () => {
                                                this.props.history.push('/chat/'  + this.state.selectedFriend.chat_room_id)
                                            })
                                        }}></i></a><a>
                                        <i className="fa fa-cog" style={{ fontSize: '35px' }} onClick={() => this._go_to_group_setting() }></i></a><a>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row searchBox">
                    <form onSubmit={this.onSearchFriend}>
                    <div className="col-sm-12 searchBox-inner">
                        <div className="input-group">
                            <input type="text" style={{ height: '40px' }} className="form-control" placeholder="Search" value={this.state.filter} aria-describedby="basic-addon1" onChange={(event) => this.setState({filter: event.target.value})} />
                            <a className="input-group-addon" style={{ cursor: 'pointer' }} onClick={() =>  store.dispatch(onSearchFriend(this.state.filter)) }>
                                <i className='fa fa-search' aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    </form>
                </div>

                <div className="row sideBar">
                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Favorites ({this.state.numberOfFriendLists.favorite})</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_favorite? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleFavorite()}></i>
                            <i className={this.state.is_show_favorite? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleFavorite()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_favorite? 'show': 'hide'}>
                        {
                            this.renderFriend(this.state.friends.favorite)
                        }
                        <div onClick={() => this.loadmore('favorite')}  className={this.state.numberOfFriendLists.favorite > this.state.friends.favorite.length? 'row message-previous': 'hide'}>
                            <div className="col-sm-12 previous">
                                <a name="20">
                                    LOAD MORE
                                </a>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Groups ({this.state.numberOfFriendLists.group})</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_group? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleGroup()}></i>
                            <i className={this.state.is_show_group? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleGroup()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_group? 'show': 'hide'}>
                        {
                            this.renderFriend(this.state.friends.group)
                        }
                        <div onClick={() => this.loadmore('group')} className={this.state.numberOfFriendLists.group > this.state.friends.group.length? 'row message-previous': 'hide'}>
                            <div className="col-sm-12 previous">
                                <a name="20">
                                    LOAD MORE
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Departments ({this.state.numberOfFriendLists.department})</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_department? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleDepartment()}></i>
                            <i className={this.state.is_show_department? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleDepartment()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_department? 'show': 'hide'}>
                        {
                            this.renderFriend(this.state.friends.department)
                        }
                        <div onClick={() => this.loadmore('department')} className={this.state.numberOfFriendLists.department > this.state.friends.department.length? 'row message-previous': 'hide'}>
                            <div className="col-sm-12 previous">
                                <a name="20">
                                    LOAD MORE
                                </a>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Others ({this.state.numberOfFriendLists.other})</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_other? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleOther()}></i>
                            <i className={this.state.is_show_other? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleOther()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_other? 'show': 'hide'}>
                        {
                            this.renderFriend(this.state.friends.other)
                        }
                        <div onClick={() => this.loadmore('other')} className={this.state.numberOfFriendLists.other > this.state.friends.other.length? 'row message-previous': 'hide'}>
                            <div className="col-sm-12 previous">
                                <a name="20">
                                    LOAD MORE
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Contact
