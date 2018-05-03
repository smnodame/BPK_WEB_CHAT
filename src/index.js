import React from 'react'
import ReactDOM from 'react-dom'
import { makeMainRoutes } from './routes';

import { store } from './redux'
import { start_app  } from './redux/actions.js'

const routes = makeMainRoutes();

// call first action that should do
store.dispatch(start_app())

store.subscribe(() => {
    const state = store.getState()
    console.log('state was updated')
    console.log(state)
})

ReactDOM.render(
    routes ,
    document.getElementById('root')
)
