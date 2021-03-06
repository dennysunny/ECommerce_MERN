import React from 'react'
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Home from './core/Home'
import Signup from "./user/Signup"
import Signin from "./user/Signin"


export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path = "/" exact component={Home} />
                <Route path = "/signup" component={Signup} />
                <Route path = "/signin" component={Signin} />

            </Switch>
        </BrowserRouter>
    )
}
