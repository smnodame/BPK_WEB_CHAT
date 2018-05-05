import _ from 'lodash'
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
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
    }
    
    loadmore = (group) => {
        store.dispatch(onLoadMore(group))
    }

    renderFriend = (friends) => {
        return friends.map((friend, key) => {
            return (
                <div className="box" key={key}>
                    <Friend image={friend.profile_pic_url} name={friend.display_name} status={friend.status_quote} />
                </div>
            )
        })
    }

    onSearchFriend = (e) => {
        e.preventDefault()
        store.dispatch(onSearchFriend(this.state.filter))
    }

    render = () => {
        return (
            <div>
                <div className="row heading">
                    <div className="col-sm-3 col-xs-3 heading-avatar">
                        <div className="heading-avatar-icon">
                            <img src="https://bootdey.com/img/Content/avatar/avatar1.png" />
                        </div>
                    </div>
                    <div className="col-sm-1 col-xs-1  heading-dot  pull-right">
                        <i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
                    </div>
                    <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                        <i className="fa fa-comments fa-2x  pull-right" aria-hidden="true" onClick={() => this.navigateToChat()}></i>
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
