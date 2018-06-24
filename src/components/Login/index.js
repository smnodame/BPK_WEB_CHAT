import _ from 'lodash'
import $ from 'jquery'

import React, { Component } from 'react'
import { Switch, Route, Redirect, BrowserRouter as Router, Link, browserHistory } from 'react-router-dom'

import { store } from '../../redux'
import { signin, start_app, navigate, isLoading  } from '../../redux/actions.js'

import '../../css/login/main.css'
import '../../css/login/util.css'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        $('body').css("background-color","#3b5998")
    }

    componentDidMount() {
    }
    
    onLogin = (e) => {
        if(e) {
            e.preventDefault()
        }
		store.dispatch(signin(this.state.username, this.state.password))
    }
    
    componentWillReceiveProps() {
        if(_.get(this.props, 'data.user.error')) {
            this.setState({
                password: ''
            })
        }
    }

    render = () => {
        return (
            <div style={{ height: 'auto', paddingTop: '40px', paddingBottom: '40px' }}>
                <nav className="navbar navbar-default" style={{ textAlign: 'center', backgroundColor: '#3b5998', border: '0px' }}>
                    <div className="container-fluid">
                    <h3 className="form-signin-heading" style={{ color: 'white' }}>Authentication</h3>
                    </div>
                </nav>
                <div>
                    <form className="form-signin" onSubmit={this.onLogin}>
                        
                        <label for="inputEmail" className="sr-only">Username</label>
                        <input type="text" id="inputEmail" className="form-control" placeholder="Username" required="" autofocus="" style={{ marginBottom: '10px', border: '1px solid white' }} value={this.state.username} onChange={(event) => this.setState({username: event.target.value})} />

                        <label for="inputPassword" className="sr-only">Password</label>
                        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} style={{ marginBottom: '20px', border: '1px solid white', borderRadius: '5px' }} />

                        <p style={{ color: 'white', marginTop: '10px', textAlign: 'center', marginBottom: '10px' }}>{ _.get(this.props, 'data.user.error') }</p>
                        <button className="btn btn-lg btn-primary btn-block" type="submit" style={{ backgroundColor: '#8e90c5', border: '1px solid #ccc' }}>Sign in</button>
                        <div style={{ paddingTop: '30px', textAlign: 'center' }}>
                            <span style={{ color: 'white' }}>
                                Don’t have an account?
                            </span>

                            <a  href="/register" style={{ marginLeft: '10px', fontWeight: 'bold', color: 'white' }}>
                                Sign Up now
                            </a>
                        </div>
                    </form>
                </div>
        </div>
        )
    }
}

export default Login
