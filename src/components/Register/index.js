import _ from 'lodash'

import React, { Component } from 'react'
import { Switch, Route, Redirect, BrowserRouter as Router, Link, browserHistory } from 'react-router-dom'

import { store } from '../../redux'
import { signup  } from '../../redux/actions.js'

import '../../css/login/main.css'
import '../../css/login/util.css'

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            languages: [],
			language_id: 1
        }
    }

    componentDidMount() {
    }

    
    componentWillReceiveProps() {
        
    }

    onSignup = (e) => {
        if(e) {
            e.preventDefault()
        }
		store.dispatch(
			signup(
				this.state.id,
				this.state.password,
				this.state.confirm_password,
				this.state.display_name,
				this.state.mobile_no,
				this.state.language_id
			)
		)
	}


    render = () => {
        return (
            <div className="limiter" style={{ height: 'auto' }}>
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form className="login100-form validate-form" onSubmit={this.onSignup}>
                            <span className="login100-form-title p-b-26">
                                Register
                            </span>
                            <div className="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c" >
                                <input placeholder="Username" className="input100" type="text" name="email" value={this.state.id} onChange={(event) => this.setState({id: event.target.value})} />
                            </div>
        
                            <div className="wrap-input100 validate-input" data-validate="Enter password">
                                <input placeholder="Password" className="input100" type="password" name="pass" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} />
                           
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Enter password">
                                <input placeholder="Confirm Password" className="input100" type="password" value={this.state.confirm_password} onChange={(event) => this.setState({confirm_password: event.target.value})} />
                           
                            </div>

                            <div className="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c" >
                                <input placeholder="Display Name" className="input100" type="text" value={this.state.display_name} onChange={(event) => this.setState({display_name: event.target.value})} />
                            </div>

                            <div className="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c" >
                                <input placeholder="Mobile No" className="input100" type="text" value={this.state.mobile_no} onChange={(event) => this.setState({mobile_no: event.target.value})} />
                            </div>
                            <div className="form-group">
                                <label for="sel1">Language:</label>
                                <select className="form-control" value={this.state.language_id} onChange={(event) => this.setState({language_id: event.target.value})}>
                                    {
                                        _.get(this.props, 'data.system.languages', []).map((language) => {
                                            return (
                                                <option key={language.user_language_id}  value={language.user_language_id}> { language.detail } </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button className="login100-form-btn" onClick={() => this.onSignup() }>
                                        Register
                                    </button>
                                </div>
                            </div>
                            <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{ _.get(this.props, 'data.user.signupError') }</p>
                            <div className="text-center p-t-115" style={{ paddingTop: '20px' }}>
                                <span className="txt1">
                                    Already have an account?
                                </span>
        
                                <a className="txt2" href="#" style={{ marginLeft: '10px' }}>
                                    Sign in now 
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register
