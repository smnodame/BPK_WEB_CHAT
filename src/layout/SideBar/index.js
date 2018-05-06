import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Contact from '../../components/Contact'
import ChatList from '../../components/ChatList'

class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            is_show_chat_list: false
        }
    }

    navigateToChat = () => {
        this.setState({
            is_show_chat_list: !this.state.is_show_chat_list
        })
    }

    componentDidMount() {

    }

    componentWillReceiveProps() {
        
    }

    render = () => {
        return (
            <div className="col-sm-4 side">
                <div className="side-one">
                    <Contact navigateToChat={this.navigateToChat} data={this.props.data} />
                </div>

                <div className={this.state.is_show_chat_list ? 'side-two chat-list-show': 'side-two chat-list-hide'}>
                    <ChatList navigateToChat={this.navigateToChat} data={this.props.data}  />
                </div>
            </div>
        )
    }
}

export default SideBar
