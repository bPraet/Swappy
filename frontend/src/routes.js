import React from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import Finder from './pages/Finder';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Matchs from './pages/Matchs';
import MatchDetails from './pages/Matchs/matchDetails';
import Profile from './pages/Profile';
import AddProduct from './pages/Products/addProduct';
import ModifyProduct from './pages/Products/modifyProduct';
import ProductDetails from './pages/Products/productDetails';
import Proposal from './pages/Finder/proposal';
import Chat from './pages/Chat';
import ErrorPage from './pages/ErrorPage';

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
                <Route path='/match/:consignee/:productId/:isProposition' exact component={MatchDetails} />
                <Route path='/chat/:userId' exact component={Chat} />
                <Route path='/profile' component={Profile} />
                <Route component={ErrorPage} />
            </Switch>
        </HashRouter>
    )
}