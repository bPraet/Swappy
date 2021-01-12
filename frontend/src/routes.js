import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Finder from './pages/Finder';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Matchs from './pages/Matchs';
import Profil from './pages/Profil';
import AddProduct from './pages/Products/addProduct';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Login} />
                <Route path='/register' exact component={Register} />
                <Route path='/finder' component={Finder} />
                <Route path='/products' component={Products} />
                <Route path='/addProduct' component={AddProduct} />
                <Route path='/matches' component={Matchs} />
                <Route path='/profile' component={Profil} />
            </Switch>
        </BrowserRouter>
    )
}