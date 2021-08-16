import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

import './products.css';

import { CircularProgress } from '@material-ui/core';
import Zoom from 'react-medium-image-zoom';
import { motion } from 'framer-motion';
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
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <div id='productDetails'>
                <div id="productName" className="productDetail">{product.data.name}</div>
                <Zoom>
                    <img alt="productImg" id="productImg" src= {adress + '/files/' + product.data.image} draggable="false"/>
                </Zoom>
                <div id="productDetailsContainer">
                    <div id="productDescription" className="productDetail">{product.data.description}</div>  
                    <div id="productCondition" className="productDetail">{product.data.condition.name}, {product.data.condition.description}</div>
                    <div id="productTransportDescription" className="productDetail">{product.data.transport.description}</div>
                </div>
            </div>
        </motion.div>
    );
}
