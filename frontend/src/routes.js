import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Finder from './pages/Finder';
import Login from './pages/Login';
import Products from './pages/Products';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Login} />
                <Route path='/finder' component={Finder} />
                <Route path='/products' component={Products} />
            </Switch>
        </BrowserRouter>
    )
}