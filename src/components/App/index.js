import React, { Component } from 'react'
import Header from '../../layout/Header'
import SideBar from '../../layout/SideBar'
import Content from '../../layout/Content'

import { store } from '../../redux'
import { start_app  } from '../../redux/actions.js'


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
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
        return (
            <div className="container app">
                <div className="row app-one">
                    <SideBar data={this.state.data} />
                    {/* <Content data={this.state.data} /> */}
                    <div className="col-sm-8 conversation">
                        <div className="row heading">
                            
                        </div>
                        <div>
                            <p style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', fontWeight: 'bold' }}>Please select a chat to start messaging</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App
