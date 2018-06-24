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
            <div style={{ height: 'auto', paddingTop: '40px', paddingBottom: '40px' }}>
                <div>
                    <form className="form-signin" onSubmit={this.onSignup}>
                        <h3 style={{ textAlign: 'center', marginBottom: '40px' }}>Register</h3>
                        <label for="inputEmail" className="sr-only">ID</label>
                        <input type="text" id="id" className="form-control" placeholder="ID" required="" autofocus="" style={{ marginBottom: '10px' }} value={this.state.id} onChange={(event) => this.setState({id: event.target.value})} />

                        <label className="sr-only">Password</label>
                        <input type="password" className="form-control" placeholder="Password" required="" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} style={{ borderRadius: '5px' }} />

                        <label className="sr-only">Confirm Password</label>
                        <input type="password" className="form-control" placeholder="Confirm Password" required="" value={this.state.confirm_password} onChange={(event) => this.setState({confirm_password: event.target.value})} style={{ borderRadius: '5px' }} />

                        <label className="sr-only">Display Name</label>
                        <input type="text" className="form-control" placeholder="Display Name" required="" value={this.state.display_name} onChange={(event) => this.setState({display_name: event.target.value})} style={{ borderRadius: '5px', marginBottom: '10px' }} />

                        <label className="sr-only">Mobile No</label>
                        <input type="text" className="form-control" placeholder="Mobile No" required="" value={this.state.mobile_no} onChange={(event) => this.setState({mobile_no: event.target.value})} style={{ borderRadius: '5px', marginBottom: '10px' }} />

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <select className="form-control" style={{ height: '50px' }} value={this.state.language_id} onChange={(event) => this.setState({language_id: event.target.value})}>
                                {
                                    _.get(this.props, 'data.system.languages', []).map((language) => {
                                        return (
                                            <option key={language.user_language_id}  value={language.user_language_id}> { language.detail } </option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <p style={{ marginTop: '10px', textAlign: 'center', marginBottom: '10px' }}>{ _.get(this.props, 'data.user.signupError') }</p>

                        <button className="btn btn-lg btn-primary btn-block" type="submit"  onClick={() => this.onSignup() } >REGISTER</button>
                        <div style={{ paddingTop: '30px', textAlign: 'center' }}>
                            <span >
                                Already have an account?
                            </span>

                            <a  href="/" style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                                Sign in now
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Register
