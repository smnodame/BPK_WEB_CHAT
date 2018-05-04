import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'


class Contact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            is_show_favorite: true,
            is_show_group: true,
            is_show_department: true,
            is_show_other: true
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
                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Favorites</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_favorite? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleFavorite()}></i>
                            <i className={this.state.is_show_favorite? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleFavorite()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_favorite? 'show': 'hide'}>
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
                                        <span className="status-meta">John Doe
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
                    </div>

                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Groups</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_group? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleGroup()}></i>
                            <i className={this.state.is_show_group? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleGroup()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_group? 'show': 'hide'}>
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
                    
                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Departments</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_department? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleDepartment()}></i>
                            <i className={this.state.is_show_department? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleDepartment()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_department? 'show': 'hide'}>
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

                    <div style={{ height: '46px', padding: '10px', borderBottom: '0.5px solid #ccc', backgroundColor: '#fbfbfb' }}>
                        <div className="col-sm-5 col-xs-5 heading-avatar">
                            <a className="heading-name-meta">Others</a>                        
                        </div>
                        <div className="col-sm-2 col-xs-2 heading-compose  pull-right">
                            <i className={!this.state.is_show_other? 'fa fa-toggle-down  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleOther()}></i>
                            <i className={this.state.is_show_other? 'fa fa-toggle-up  pull-right': 'hide'} aria-hidden="true" onClick={() => this.toggleOther()}></i>
                        </div>
                    </div>
                    <div className={this.state.is_show_other? 'show': 'hide'}>
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
            </div>
        )
    }
}

export default Contact
