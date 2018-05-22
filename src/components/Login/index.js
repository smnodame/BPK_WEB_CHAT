import React, { Component } from 'react'
import { Switch, Route, Redirect, BrowserRouter as Router, Link, browserHistory } from 'react-router-dom'

import '../../css/login/main.css'
// import '../../css/login/util.css'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
    }
    
    render = () => {
        return (
            <div className="limiter" style={{ height: 'auto' }}>
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form className="login100-form validate-form">
                            <span className="login100-form-title p-b-26">
                                Welcome
                            </span>
                            <span className="login100-form-title p-b-48">
                                <i className="zmdi zmdi-font"></i>
                            </span>
        
                            <div className="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c" style={{ marginTop: '75px' }}>
                                <input className="input100" type="text" name="email" />
                                <span className="focus-input100" data-placeholder="Email"></span>
                            </div>
        
                            <div className="wrap-input100 validate-input" data-validate="Enter password">
                                <input className="input100" type="password" name="pass" />
                                <span className="focus-input100" data-placeholder="Password"></span>
                            </div>
        
                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button className="login100-form-btn">
                                        Login
                                    </button>
                                </div>
                            </div>
        
                            <div className="text-center p-t-115" style={{ paddingTop: '80px' }}>
                                <span className="txt1">
                                    Don’t have an account?
                                </span>
        
                                <a className="txt2" href="#" style={{ marginLeft: '10px' }}>
                                    Sign Up
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
