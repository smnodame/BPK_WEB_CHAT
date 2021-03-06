import React from 'react'
import ReactDOM from 'react-dom'
import { makeMainRoutes } from './routes';

import { store } from './redux'
import { start_app  } from './redux/actions.js'

import 'react-toastify/dist/ReactToastify.css'

const routes = makeMainRoutes();

// call first action that should do
store.dispatch(start_app())

ReactDOM.render(
    routes ,
    document.getElementById('root')
)
