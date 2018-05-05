
import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'

import App from '../components/App'

export const makeMainRoutes = () => {
    return (
        <BrowserRouter history={history} >
            <App history={history} />
        </BrowserRouter>
    )
}
