import React, { useEffect, useState } from 'react';

import './products.css';
import addProduct from '../../assets/addProduct.png';

import { AppBar, BottomNavigation, BottomNavigationAction, Grid } from '@material-ui/core';
import { Favorite, LocalMall, SwapHoriz, Person } from '@material-ui/icons';
import api from '../../services/api';
import adress from '../../services/config';

export default function Products(){

    const [ productsUser, setProductsUser ] = useState([]);
    

    useEffect(() => {
        const userid = localStorage.getItem('user');
        api.get('/productsUser', { headers: { 'userid': userid } }).then( result => {
            setProductsUser(result);
        });
    }, [productsUser]);
    
    if(productsUser.data === undefined)
        return 'loading...';

    return(
        <div id="products">
            <AppBar id="bottomBar">
                <BottomNavigation showLabels>
                    <BottomNavigationAction label="Finder" icon={<SwapHoriz />} />
                    <BottomNavigationAction label="Matchs" icon={<Favorite />} />
                    <BottomNavigationAction label="Produits" icon={<LocalMall />} />
                    <BottomNavigationAction label="Profil" icon={<Person />} />
                </BottomNavigation>
            </AppBar>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    {productsUser.data[0] ? 
                    <img src={adress + '/files/' + productsUser.data[0].images} className="productImg" alt="product1"></img> : 
                    <img src={addProduct} className="productImg" alt="product1"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[1] ? 
                    <img src={adress + '/files/' + productsUser.data[1].images} className="productImg" alt="product2"></img> : 
                    <img src={addProduct} className="productImg" alt="product2"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[2] ? 
                    <img src={adress + '/files/' + productsUser.data[2].images} className="productImg" alt="product3"></img> : 
                    <img src={addProduct} className="productImg" alt="product3"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[3] ? 
                    <img src={adress + '/files/' + productsUser.data[3].images} className="productImg" alt="product4"></img> : 
                    <img src={addProduct} className="productImg" alt="product4"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[4] ? 
                    <img src={adress + '/files/' + productsUser.data[4].images} className="productImg" alt="product5"></img> : 
                    <img src={addProduct} className="productImg" alt="product5"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[5] ? 
                    <img src={adress + '/files/' + productsUser.data[5].images} className="productImg" alt="product6"></img> : 
                    <img src={addProduct} className="productImg" alt="product6"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[6] ? 
                    <img src={adress + '/files/' + productsUser.data[6].images} className="productImg" alt="product7"></img> : 
                    <img src={addProduct} className="productImg" alt="product7"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[7] ? 
                    <img src={adress + '/files/' + productsUser.data[7].images} className="productImg" alt="product8"></img> : 
                    <img src={addProduct} className="productImg" alt="product8"></img>}
                </Grid>
                <Grid item xs={3}>
                    {productsUser.data[8] ? 
                    <img src={adress + '/files/' + productsUser.data[8].images} className="productImg" alt="product9"></img> : 
                    <img src={addProduct} className="productImg" alt="product9"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[9] ? 
                    <img src={adress + '/files/' + productsUser.data[9].images} className="productImg" alt="product10"></img> : 
                    <img src={addProduct} className="productImg" alt="product10"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[10] ? 
                    <img src={adress + '/files/' + productsUser.data[10].images} className="productImg" alt="product11"></img> : 
                    <img src={addProduct} className="productImg" alt="product11"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[11] ? 
                    <img src={adress + '/files/' + productsUser.data[11].images} className="productImg" alt="product12"></img> : 
                    <img src={addProduct} className="productImg" alt="product12"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[12] ? 
                    <img src={adress + '/files/' + productsUser.data[12].images} className="productImg" alt="product13"></img> : 
                    <img src={addProduct} className="productImg" alt="product13"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[13] ? 
                    <img src={adress + '/files/' + productsUser.data[13].images} className="productImg" alt="product14"></img> : 
                    <img src={addProduct} className="productImg" alt="product14"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[14] ? 
                    <img src={adress + '/files/' + productsUser.data[14].images} className="productImg" alt="product15"></img> : 
                    <img src={addProduct} className="productImg" alt="product15"></img>}
                </Grid>
                <Grid item xs={3}>
                {productsUser.data[15] ? 
                    <img src={adress + '/files/' + productsUser.data[15].images} className="productImg" alt="product16"></img> : 
                    <img src={addProduct} className="productImg" alt="product16"></img>}
                </Grid>
            </Grid>
        </div> 
    );
}