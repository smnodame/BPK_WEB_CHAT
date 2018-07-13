import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Contact from '../../components/Contact'
import ChatList from '../../components/ChatList'

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
        
    }

    render = () => {
        return (
            <div className={ this.state.page == 'contact' ? 'col-sm-5 side' : 'col-sm-5 side mobile-hide' }>
                <nav className="main-menu mobile-hide">
                    <ul>
                        <li>
                            <div className="heading-avatar " style={{ width: 'auto' }}>
                                <div className="heading-avatar-icon">
                                    <img src='http://itsmartone.com/bpk_connect/profile_pic_folder/small/974_small.jpg' 
                                    style={{ margin: '12px', border: '0.5px solid black', width: '50px', height: '50px' }} />
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
                        <li>
                            <a style={{ margin: '8px' }}>
                                <i className="fa fa-side-bar fa-sign-out fa-2x" style={{ fontSize: '25px', color: 'white' }}></i>
                            </a>
                        </li>  
                    </ul>
                </nav>

                <div className="side-one" style={{ paddingLeft: '75px' }}>
                    <Contact navigateToChat={this.navigateToChat} openUserModel={this.openUserModel} goToContact={this.goToContact} onRef={ref => (this.child = ref)} navigateToChat={this.navigateToChat} data={this.props.data} history={this.props.history} />
                </div>

                <div className={this.state.is_show_chat_list ? 'side-two chat-list-show': 'side-two chat-list-hide'} style={{ paddingLeft: '75px' }}>
                    <ChatList navigateToChat={this.navigateToChat} openUserModel={this.openUserModel} goToContact={this.goToContact}  goToChatList={this.goToChatList} data={this.props.data} history={this.props.history} />
                </div>
            </div>
        )
    }
}

export default SideBar
