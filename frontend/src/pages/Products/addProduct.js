import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';

import { FormControl, TextField, Fab, CircularProgress, InputLabel, NativeSelect } from '@material-ui/core';
import { Done } from '@material-ui/icons';

import './products.css';

export default function AddProduct( {history} ){

    const [ transports, setTransports ] = useState([]);
    const [ conditions, setConditions ] = useState([]);

    const [ name, setName ] = useState();
    const [ description, setDescription ] = useState();
    const [ image, setImage ] = useState();
    const [ conditionId, setConditionId ] = useState();
    const [ transportId, setTransportId ] = useState();

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
    }, [history, userToken]);
    
    if(transports.data === undefined || conditions.data === undefined)
        return <CircularProgress size="100px"/>;

    const handleSubmit = async event => {
        event.preventDefault();
        
        const productData = new FormData();
        productData.append("name", name);
        productData.append("description", description);
        productData.append("image", image);
        productData.append("conditionId", conditionId);
        productData.append("transportId", transportId);

        try {
            await api.post('/product/add', productData, { headers: { 'userToken': userToken} });

        } catch (error) {
            console.log(error);
        }
        
        history.push('/products');
    };
    
    return(
        <form id="addProductForm" onSubmit={handleSubmit}>
            <FormControl className="productForm">
                <TextField id="name" label="Nom"
                    onChange={event => setName(event.target.value)} />
                <TextField id="description" label="Description"
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
