import _ from 'lodash'

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
            // <div className="limiter" style={{ height: 'auto' }}>
            //     <div className="container-login100">
            //         <div className="wrap-login100">
            //             <form className="login100-form validate-form" onSubmit={this.onLogin}>
            //                 <span className="login100-form-title p-b-26">
            //                     Welcome
            //                 </span>
            //                 <span className="login100-form-title p-b-48">
            //                     <i className="zmdi zmdi-font"></i>
            //                 </span>
                            
            //                 <div className="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c" style={{ marginTop: '75px' }}>
            //                     <input placeholder="Username" className="input100" type="text" name="email" value={this.state.username} onChange={(event) => this.setState({username: event.target.value})} />
            //                 </div>
        
            //                 <div className="wrap-input100 validate-input" data-validate="Enter password">
            //                     <input placeholder="Password" className="input100" type="password" name="pass" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} />
                           
            //                 </div>
        
            //                 <div className="container-login100-form-btn">
            //                     <div className="wrap-login100-form-btn">
            //                         <div className="login100-form-bgbtn"></div>
            //                         <button className="login100-form-btn" onClick={() => this.onLogin() }>
            //                             Login
            //                         </button>
            //                     </div>
            //                 </div>
            //                 <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{ _.get(this.props, 'data.user.error') }</p>
            //                 <div className="text-center p-t-115" style={{ paddingTop: '80px' }}>
            //                     <span className="txt1">
            //                         Don’t have an account?
            //                     </span>
        
            //                     <a className="txt2" href="/register" style={{ marginLeft: '10px' }}>
            //                         Sign Up
            //                     </a>
            //                 </div>
            //             </form>
            //         </div>
            //     </div>
            // </div>
            <div style={{ height: 'auto', paddingTop: '40px', paddingBottom: '40px' }}>
                <div>
                    <form className="form-signin" onSubmit={this.onLogin}>
                        <h2 className="form-signin-heading">Please sign in</h2>

                        <label for="inputEmail" className="sr-only">Username</label>
                        <input type="text" id="inputEmail" className="form-control" placeholder="Username" required="" autofocus="" style={{ marginBottom: '10px' }} value={this.state.username} onChange={(event) => this.setState({username: event.target.value})} />

                        <label for="inputPassword" className="sr-only">Password</label>
                        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} />

                        <div className="checkbox">
                            <label>
                                <input type="checkbox" value="remember-me" /> Remember me
                            </label>
                        </div>
                        <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{ _.get(this.props, 'data.user.error') }</p>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                        <div style={{ paddingTop: '30px', textAlign: 'center' }}>
                            <span >
                                Don’t have an account?
                            </span>

                            <a  href="/register" style={{ marginLeft: '10px' }}>
                                Sign Up
                            </a>
                        </div>
                    </form>
                </div>
        </div>
        )
    }
}

export default Login
