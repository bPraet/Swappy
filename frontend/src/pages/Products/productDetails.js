import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

import './products.css';

import { Card, CardMedia, CardContent, Typography, CardActions, Button, CircularProgress } from '@material-ui/core';
import adress from '../../services/config';


export default function ProductDetails({ history }) {

    const [ product, setProduct ] = useState();
    const { productId } = useParams();
    const userToken = localStorage.getItem('userToken');

    useEffect(() => {
        
        api.get(`/product/${productId}`, { headers: { 'userToken': userToken } }).then(result => {
            setProduct(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history, productId, userToken]);

    if(product === undefined)
        return <CircularProgress size="100px"/>;

    return (
        <Card id='productDetails'>
                <CardMedia
                    component="img"
                    alt="productImg"
                    id="productImg"
                    image= {adress + '/files/' + product.data.image}
                    title={product.data.name}
                    draggable="false"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {product.data.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {product.data.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {product.data.condition.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {product.data.condition.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {product.data.transport.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {product.data.transport.description}
                    </Typography>
                </CardContent>
            <CardActions>
                <Button size="small" color="primary" component={ Link } to="/finder">
                    Retour
                </Button>
            </CardActions>
        </Card>
    );
}
