import React, { Component } from 'react'
import Header from '../../layout/Header'
import SideBar from '../../layout/SideBar'
import Content from '../../layout/Content'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }


    }

    componentDidMount() {

    }
    
    render = () => {
        return (
            <div className="container app">
                <div className="row app-one">
                    <SideBar />
                    <Content />
                </div>
            </div>
        )
    }
}

export default App
