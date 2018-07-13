import _ from 'lodash'
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Contact from '../../components/Contact'
import ChatList from '../../components/ChatList'

import { store } from '../../redux'
import {
    onClickChat,
    isShowUserProfile
} from '../../redux/actions'

class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            is_show_chat_list: true,
            page: 'contact'
        }
    }

    navigateToChat = () => {
        this.setState({
            is_show_chat_list: !this.state.is_show_chat_list
        })
    }

    goToContact = () => {
        this.setState({
            is_show_chat_list: false
        })
        this.child.hideUserModal()
    }

    goToChatList = () => {
        this.setState({
            is_show_chat_list: true
        })
        this.child.hideUserModal()
    }

    check_path = () => {
        if(this.props.history.location.pathname == '/') {
            this.setState({
                page: 'contact'
            })
        } else {
            this.setState({
                page: 'content'
            })
        }
    }

    openUserModel = () => {
        this.child.showUserModal()
    }

    componentDidMount() {
        this.check_path()
        this.props.history.listen((location, action) => {
            this.check_path()
        })
    }

    componentWillReceiveProps() {
        if(_.get(this.props.data, 'user.user')) {
            this.setState({
                user: this.props.data.user.user
            })
        }
    }

    signout = () => {
        localStorage.clear()
        location.reload()
    }

    render = () => {
        return (
            <div className={ this.state.page == 'contact' ? 'col-sm-5 side' : 'col-sm-5 side mobile-hide' }>
                {/* { this.props } */}
                <nav className="main-menu mobile-hide">
                    <ul>
                        <li onClick={() => {}}>
                            <div className="heading-avatar " style={{ width: 'auto' }}>
                                <div className="heading-avatar-icon">
                                    <img src={_.get(this.state, 'user.profile_pic_url')}
                                    style={{ margin: '12px', border: '1px solid white', width: '50px', height: '50px' }} />
                                </div>
                            </div>
                        </li>
                        <li onClick={() => this.goToContact() } style={{ cursor: 'pointer' }}>
                            <a style={{ margin: '8px' }}>
                                <i className="fa fa-side-bar fa-users fa-2x" style={{ fontSize: '25px', color: 'white' }}></i>
                            </a>
                        
                        </li>
                        <li className="has-subnav" onClick={() => this.goToChatList() } style={{ cursor: 'pointer' }}>
                            <a style={{ margin: '8px' }}>
                                <i className="fa fa-side-bar fa-comments fa-2x" style={{ fontSize: '25px', color: 'white' }}></i>
                            </a>
                            
                        </li>
                    </ul>

                    <ul className="logout">
                        <li style={{ cursor: 'pointer' }} onClick={() => store.dispatch(onClickChat(this.props.data.user.keepProfile))}>
                            <a style={{ margin: '8px' }}>
                                <i className="fa fa-side-bar fa-cloud-download  fa-2x" style={{ fontSize: '25px', color: 'white' }} ></i>
                            </a>
                        </li>
                        <li style={{ cursor: 'pointer' }} onClick={() => store.dispatch(isShowUserProfile(true))} style={{ cursor: 'pointer' }}>
                            <a style={{ margin: '8px' }}>
                                <i className="fa fa-side-bar fa-cog fa-2x" style={{ fontSize: '25px', color: 'white' }} ></i>
                            </a>
                        </li>  
                        <li style={{ cursor: 'pointer' }} onClick={() => this.signout()}>
                            <a style={{ margin: '8px' }}>
                                <i className="fa fa-side-bar fa-sign-out fa-2x" style={{ fontSize: '25px', color: 'white' }} ></i>
                            </a>
                        </li>  
                    </ul>
                </nav>

                <div className="side-one nav-side-bar">
                    <Contact navigateToChat={this.navigateToChat} openUserModel={this.openUserModel} goToContact={this.goToContact} onRef={ref => (this.child = ref)} navigateToChat={this.navigateToChat} data={this.props.data} history={this.props.history} />
                </div>

                <div className={this.state.is_show_chat_list ? 'side-two nav-side-bar chat-list-show': 'side-two nav-side-bar chat-list-hide'}>
                    <ChatList navigateToChat={this.navigateToChat} openUserModel={this.openUserModel} goToContact={this.goToContact}  goToChatList={this.goToChatList} data={this.props.data} history={this.props.history} />
                </div>
            </div>
        )
    }
}

export default SideBar
