import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'


class Contact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.navigateToChat = () => {
            props.navigateToChat()
        }
    }

    componentDidMount() {

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
                    <div className="col-sm-12 searchBox-inner">
                        <div className="form-group has-feedback">
                            <input id="searchText" type="text" className="form-control" name="searchText" placeholder="Search" />
                            <span className="glyphicon glyphicon-search form-control-feedback"></span>
                        </div>
                    </div>
                </div>

                <div className="row sideBar">
                    <a className="heading-name-meta" style={{ padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>Favorites</a>
                    <div className="row sideBar-body">
                        <div className="col-sm-3 col-xs-3 sideBar-avatar">
                            <div className="avatar-icon">
                                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" />
                            </div>
                        </div>
                        <div className="col-sm-9 col-xs-9 sideBar-main">
                            <div className="row">
                                <div className="col-sm-8 col-xs-8 sideBar-name">
                                    <span className="name-meta">John Doe
                                    </span>
                                </div>
                                <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                                    <span className="time-meta pull-right">18:18
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row sideBar-body">
                        <div className="col-sm-3 col-xs-3 sideBar-avatar">
                            <div className="avatar-icon">
                                <img src="https://bootdey.com/img/Content/avatar/avatar4.png" />
                            </div>
                        </div>
                        <div className="col-sm-9 col-xs-9 sideBar-main">
                            <div className="row">
                                <div className="col-sm-8 col-xs-8 sideBar-name">
                                    <span className="name-meta">John Doe
                                    </span>
                                </div>
                                <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                                    <span className="time-meta pull-right">18:18
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a className="heading-name-meta" style={{ padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>Groups</a>
                    <div className="row sideBar-body">
                        <div className="col-sm-3 col-xs-3 sideBar-avatar">
                            <div className="avatar-icon">
                                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" />
                            </div>
                        </div>
                        <div className="col-sm-9 col-xs-9 sideBar-main">
                            <div className="row">
                                <div className="col-sm-8 col-xs-8 sideBar-name">
                                    <span className="name-meta">John Doe
                                    </span>
                                </div>
                                <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                                    <span className="time-meta pull-right">18:18
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row sideBar-body">
                        <div className="col-sm-3 col-xs-3 sideBar-avatar">
                            <div className="avatar-icon">
                                <img src="https://bootdey.com/img/Content/avatar/avatar4.png" />
                            </div>
                        </div>
                        <div className="col-sm-9 col-xs-9 sideBar-main">
                            <div className="row">
                                <div className="col-sm-8 col-xs-8 sideBar-name">
                                    <span className="name-meta">John Doe
                                    </span>
                                </div>
                                <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                                    <span className="time-meta pull-right">18:18
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a className="heading-name-meta" style={{ padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>Departments</a>
                    <div className="row sideBar-body">
                        <div className="col-sm-3 col-xs-3 sideBar-avatar">
                            <div className="avatar-icon">
                                <img src="https://bootdey.com/img/Content/avatar/avatar4.png" />
                            </div>
                        </div>
                        <div className="col-sm-9 col-xs-9 sideBar-main">
                            <div className="row">
                                <div className="col-sm-8 col-xs-8 sideBar-name">
                                    <span className="name-meta">John Doe
                                    </span>
                                </div>
                                <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                                    <span className="time-meta pull-right">18:18
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a className="heading-name-meta" style={{ padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>Others</a>
                    <div className="row sideBar-body">
                        <div className="col-sm-3 col-xs-3 sideBar-avatar">
                            <div className="avatar-icon">
                                <img src="https://bootdey.com/img/Content/avatar/avatar4.png" />
                            </div>
                        </div>
                        <div className="col-sm-9 col-xs-9 sideBar-main">
                            <div className="row">
                                <div className="col-sm-8 col-xs-8 sideBar-name">
                                    <span className="name-meta">John Doe
                                    </span>
                                </div>
                                <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                                    <span className="time-meta pull-right">18:18
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Contact
