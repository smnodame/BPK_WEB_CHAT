import _ from 'lodash'

import React, { Component } from 'react'
import { Switch, Route, Redirect, BrowserRouter as Router, Link, browserHistory } from 'react-router-dom'

import { store } from '../../redux'

class Checkbox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false
        }
    }

    componentDidMount() {
    }
    
    componentWillReceiveProps() {
        
    }

    render = () => {
        return (
            <i className={ this.state.checked ? "fa fa-check-circle selected-message" : "fa fa-check-circle" } 
                aria-hidden="true" style={{ fontSize: '28px', marginLeft: '15px', color: 'rgb(200, 200, 200)', cursor: 'pointer' }}
                onClick={() => {
                    this.setState({
                        checked: !this.state.checked
                    }, () => {
                        this.props.onChange({
                            target: {
                                checked: this.state.checked
                            }
                        })
                    })
                }}
            ></i>    
        )
    }
}

export default Checkbox
