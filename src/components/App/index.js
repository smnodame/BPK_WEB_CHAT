import React, { Component } from 'react'
import Header from '../../layout/Header'
import SideBar from '../../layout/SideBar'
import Content from '../../layout/Content'

const App = () => (
    <div className="container app">
        <div className="row app-one">
            <SideBar />
            <Content />
        </div>
    </div>
)

export default App;
