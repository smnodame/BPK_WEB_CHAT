import _ from 'lodash'
import React from 'react'
import moment from 'moment'

import { Switch, Route, Redirect } from 'react-router-dom'


class ChatList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chatLists: []
        }

        this.navigateToChat = () => {
            props.navigateToChat()
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps() {
        if(_.get(this.props.data, 'chat.chatLists')) {
            this.setState({
                chatLists: this.props.data.chat.chatLists,
                chatListsClone: this.props.data.chat.chatLists
            })
        }
    }

    renderChatLists = () => {
        const chatLists = this.state.chatLists.map((info) => {
            return (
                <div key={info.chat_room_id} className="row compose-sideBar">
                    <div className="row sideBar-body">
                        <div className="col-sm-3 col-xs-3 sideBar-avatar">
                            <div className="avatar-icon">
                                <img src={info.profile_pic_url} />
                            </div>
                        </div>
                        <div className="col-sm-9 col-xs-9 sideBar-main">
                            <div className="row">
                                <div className="col-sm-8 col-xs-8 sideBar-name">
                                    <span className="name-meta"> { info.display_name }
                                    </span>
                                    <span className="status-meta"> { info.last_message }
                                    </span>
                                </div>
                                <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                                    <span className="time-meta pull-right"> {moment(info.last_chat).fromNow()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
        return chatLists
    }

    onFilter = (event) => {
        if(event.target.value) {
            const chatLists = this.state.chatListsClone.filter((info) => {
                const str = info.display_name
                return str.includes(event.target.value)
            })
    
            this.setState({
                chatLists
            })
        } else {
            this.setState({
                chatLists: this.state.chatListsClone
            })
        }
    }

    render = () => {
        return (
            <div style={{ backgroundColor: 'white'}}>
                <div className="row newMessage-heading">
                    <div className="row newMessage-main">
                        <div className="col-sm-2 col-xs-2 newMessage-back">
                            <i className="fa fa-arrow-left" aria-hidden="true" onClick={() => this.navigateToChat()}></i>
                        </div>
                        <div className="col-sm-10 col-xs-10 newMessage-title">
                            BACK TO CONTACT
                        </div>
                    </div>
                </div>

                <div className="row composeBox">
                    <div className="col-sm-12 composeBox-inner">
                        <div className="form-group has-feedback">
                            <input id="composeText" type="text" className="form-control" name="searchText" placeholder="Search" value={this.state.filter} aria-describedby="basic-addon1" onChange={(event) => this.onFilter(event)} />
                            <span className="glyphicon glyphicon-search form-control-feedback"></span>
                        </div>
                    </div>
                </div>
                <div className="row sideBar">
                    {
                        this.renderChatLists()
                    }
                </div>
            </div>
        )
    }
}

export default ChatList
