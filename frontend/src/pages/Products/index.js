import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './products.css';
import addProduct from '../../assets/addProduct.png';

import { AppBar, BottomNavigation, BottomNavigationAction, Grid, CircularProgress, Button } from '@material-ui/core';
import { Favorite, LocalMall, SwapHoriz, Person, Add } from '@material-ui/icons';
import api from '../../services/api';
import adress from '../../services/config';

export default function Products({ history }){

    const [ productsUser, setProductsUser ] = useState([]);
    

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        api.get('/productsUser', { headers: { 'userToken': userToken } }).then(result => {
            setProductsUser(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history]);
    
    if(productsUser.data === undefined)
        return <CircularProgress size="100px"/>;

    return(
        <div id="products">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction label="Finder" icon={<SwapHoriz />} component={Link} to="/finder"/>
                    <BottomNavigationAction label="Matchs" icon={<Favorite />} component={Link} to="/matches"/>
                    <BottomNavigationAction disabled label="Produits" icon={<LocalMall />} component={Link} to="/products"/>
                    <BottomNavigationAction label="Profil" icon={<Person />} component={Link} to="/profile"/>
                </BottomNavigation>
            </AppBar>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    {productsUser.data[0] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[0]._id}><img src={adress + '/files/' + productsUser.data[0].image} className="productImg" alt="product1" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product1" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[1] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[1]._id}><img src={adress + '/files/' + productsUser.data[1].image} className="productImg" alt="product2" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product2" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[2] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[2]._id}><img src={adress + '/files/' + productsUser.data[2].image} className="productImg" alt="product3" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product3" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[3] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[3]._id}><img src={adress + '/files/' + productsUser.data[3].image} className="productImg" alt="product4" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product4" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[4] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[4]._id}><img src={adress + '/files/' + productsUser.data[4].image} className="productImg" alt="product5" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product5" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[5] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[5]._id}><img src={adress + '/files/' + productsUser.data[5].image} className="productImg" alt="product6" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product6" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[6] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[6]._id}><img src={adress + '/files/' + productsUser.data[6].image} className="productImg" alt="product7" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product7" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[7] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[7]._id}><img src={adress + '/files/' + productsUser.data[7].image} className="productImg" alt="product8" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product8" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                    {productsUser.data[8] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[8]._id}><img src={adress + '/files/' + productsUser.data[8].image} className="productImg" alt="product9" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product9" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[9] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[9]._id}><img src={adress + '/files/' + productsUser.data[9].image} className="productImg" alt="product10" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product10" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[10] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[10]._id}><img src={adress + '/files/' + productsUser.data[10].image} className="productImg" alt="product11" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product11" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[11] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[11]._id}><img src={adress + '/files/' + productsUser.data[11].image} className="productImg" alt="product12" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product12" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[12] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[12]._id}><img src={adress + '/files/' + productsUser.data[12].image} className="productImg" alt="product13" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product13" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[13] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[13]._id}><img src={adress + '/files/' + productsUser.data[13].image} className="productImg" alt="product14" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product14" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[14] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[14]._id}><img src={adress + '/files/' + productsUser.data[14].image} className="productImg" alt="product15" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product15" draggable="false"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[15] ? 
                    <Link to={"/modifyProduct/" + productsUser.data[15]._id}><img src={adress + '/files/' + productsUser.data[15].image} className="productImg" alt="product16" draggable="false"></img></Link> : 
                    <img src={addProduct} className="productImg" alt="product16" draggable="false"></img>}
                </Grid>
            </Grid>
            <Button id="addBtn" variant="contained" color="default" startIcon={<Add />} component={Link} to="/addProduct">
                Ajouter un produit
            </Button>
        </div> 
    );
}