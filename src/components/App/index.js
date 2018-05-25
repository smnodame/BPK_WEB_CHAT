import React, { Component } from 'react'
import { Switch, Route, Redirect, BrowserRouter as Router, Link, browserHistory } from 'react-router-dom'

import Header from '../../layout/Header'
import SideBar from '../../layout/SideBar'
import Content from '../../layout/Content'
import UserProfile from '../UserProfile'
import GroupSetting from '../GroupSetting'
import Register from '../Register'
import Login from '../Login'

import { store } from '../../redux'
import { start_app  } from '../../redux/actions.js'

import { ToastContainer, toast } from 'react-toastify'

const DefaultPage = () => {
    return (
        <div className="col-sm-8 conversation">
            <div className="row heading"></div>
            <div>
                <p style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', fontWeight: 'bold' }}>Please select a chat to start messaging</p>
            </div>
        </div>
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }

        // this.isAuthorization = localStorage.getItem('user_id')? true : false
        this.isAuthorization = true
    }

    componentDidMount() {
        store.subscribe(() => {
            const state = store.getState()
            console.log(' state was updated ')
            console.log(state)
            this.setState({
                data: state
            })
        })
    }
    
    render = () => {
        if(this.isAuthorization ) {
            return (
                <div className="container app">
                    <div className="row app-one">
                        <div className="toast-custom">
                            <ToastContainer autoClose={3000} />
                        </div>
                        <Switch>
                            <Route path="/" render={routeProps => <SideBar {...routeProps} data={this.state.data}/>} />
                        </Switch>
                        <Switch>
                            <Route path='/chat/:id' render={routeProps => <Content {...routeProps} data={this.state.data} />} />
                            <Route exact path='/' component={DefaultPage} />
                        </Switch>
                    </div>
                    <UserProfile data={this.state.data} />
                    <GroupSetting  data={this.state.data} />
                </div>
            )
        } else {
            return (
                
                <Switch>
                    <Route path='/register' render={routeProps => <Register {...routeProps} data={this.state.data} />} />
                    <Route render={routeProps => <Login {...routeProps} data={this.state.data} />} />
                </Switch>
            )
        }
    }
}

export default App
