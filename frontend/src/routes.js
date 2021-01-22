import React from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import Finder from './pages/Finder';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Matchs from './pages/Matchs';
import Profile from './pages/Profile';
import AddProduct from './pages/Products/addProduct';
import ModifyProduct from './pages/Products/modifyProduct';
import ProductDetails from './pages/Products/productDetails';
import Proposal from './pages/Finder/proposal';

export default function Routes(){
    return(
        <HashRouter>
            <Switch>
                <Route path='/' exact component={Login} />
                <Route path='/register' exact component={Register} />
                <Route path='/finder' component={Finder} />
                <Route path='/products' component={Products} />
                <Route path='/addProduct' component={AddProduct} />
                <Route path='/modifyProduct/:productId' exact component={ModifyProduct} />
                <Route path='/productDetails/:productId' exact component={ProductDetails} />
                <Route path='/proposal/:productId' exact component={Proposal} />
                <Route path='/matches' component={Matchs} />
                <Route path='/profile' component={Profile} />
            </Switch>
        </HashRouter>
    )
}