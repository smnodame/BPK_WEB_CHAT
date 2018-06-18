import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Contact from '../../components/Contact'
import ChatList from '../../components/ChatList'

class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            is_show_chat_list: false,
            page: 'contact'
        }
    }

    navigateToChat = () => {
        this.setState({
            is_show_chat_list: !this.state.is_show_chat_list
        })
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
            <div className={ this.state.page == 'contact' ? 'col-sm-4 side' : 'col-sm-4 side mobile-hide' }>
                <div className="side-one">
                    <Contact navigateToChat={this.navigateToChat} data={this.props.data} history={this.props.history} />
                </div>

                <div className={this.state.is_show_chat_list ? 'side-two chat-list-show': 'side-two chat-list-hide'}>
                    <ChatList navigateToChat={this.navigateToChat} data={this.props.data} history={this.props.history} />
                </div>
            </div>
        )
    }
}

export default SideBar
