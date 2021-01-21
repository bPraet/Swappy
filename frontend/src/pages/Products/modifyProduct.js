import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

import { FormControl, TextField, Fab, CircularProgress, InputLabel, NativeSelect } from '@material-ui/core';
import { Done } from '@material-ui/icons';

import './products.css';

export default function ModifyProduct( {history} ){

    const [ transports, setTransports ] = useState([]);
    const [ conditions, setConditions ] = useState([]);
    const [ product, setProduct ] = useState([]);

    let [ name, setName ] = useState();
    let [ description, setDescription ] = useState();
    let [ image, setImage ] = useState();
    let [ conditionId, setConditionId ] = useState();
    let [ transportId, setTransportId ] = useState();

    const { productId } = useParams();
    const userToken = localStorage.getItem('userToken');

    const preview = useMemo(() => {
        return image ? URL.createObjectURL(image) : null;
    }, [image])

    useEffect(() => {
        api.get('/transports', { headers: {'userToken': userToken} }).then( result => {
            setTransports(result);
        }).catch((err) => {
            history.push('/');
        });
        api.get('/conditions', { headers: {'userToken': userToken} }).then(result => {
            setConditions(result);
        }).catch((err) => {
            history.push('/');
        });
        api.get(`/product/${productId}`, { headers: {'userToken': userToken} }).then(result => {
            setProduct(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [productId, userToken, history]);
    
    if(transports.data === undefined || conditions.data === undefined || product.data === undefined)
        return <CircularProgress size="100px"/>;

    const handleSubmit = async event => {
        event.preventDefault();

        if(name === undefined)
            name = product.data.name;
        if(description === undefined)
            description = product.data.description;
        if(conditionId === undefined)
            conditionId = product.data.condition;
        if(transportId === undefined)
            transportId = product.data.transport;
        
        const productData = new FormData();
        productData.append("name", name);
        productData.append("description", description);
        productData.append("image", image);
        productData.append("conditionId", conditionId);
        productData.append("transportId", transportId);
        
        try {
            await api.put(`/product/update/${productId}`, productData, { headers: {'userToken': userToken} });
        } catch (error) {
            console.log(error);
        }
        
        history.push('/products');
    };
    
    return(
        <form id="addProductForm" onSubmit={handleSubmit}>
            <FormControl className="productForm">
                <TextField id="name" label="Nom" defaultValue={product.data.name}
                    onChange={event => setName(event.target.value)} />
                <TextField id="description" label="Description" defaultValue={product.data.description}
                    onChange={event => setDescription(event.target.value)} />
                <div id="preview" style={{backgroundImage: `url(${preview})`}}></div>
                
                <TextField id="image" helperText="Insérez l'image représentant le mieux votre produit !" type="file"
                    onChange={event => setImage(event.target.files[0])} inputProps={{ accept: '.jpg, .jpeg' }}/>
            </FormControl>
            <FormControl className="productForm">
                <InputLabel htmlFor="conditions">Etat</InputLabel>
                <NativeSelect
                    required
                    value={conditionId}
                    onChange={event => setConditionId(event.target.value)}
                    name="conditions"
                    defaultValue={product.data.condition._id}
                >
                    <option aria-label="" />
                    {conditions.data.map(condition => <option value={condition._id} key={condition._id}>{condition.name}</option>)}
                </NativeSelect>
            </FormControl>
            <FormControl className="productForm">
            <InputLabel htmlFor="transports">Transport</InputLabel>
                <NativeSelect
                    required
                    value={transportId}
                    onChange={event => setTransportId(event.target.value)}
                    name="transports"
                    defaultValue={product.data.transport._id}
                >
                    <option aria-label="" />
                    {transports.data.map(transport => <option value={transport._id} key={transport._id}>{transport.name}</option>)}
                </NativeSelect>
            </FormControl>
            <Fab aria-label="add" id="addProductBtn" type="submit">
                <Done />
            </Fab>
        </form>
    );
}
