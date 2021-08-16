import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import adress from '../../services/config';

import { FormControl, TextField, Fab, CircularProgress, InputLabel, NativeSelect, Dialog, DialogTitle,
     DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Done, ArrowBack, Delete } from '@material-ui/icons';
import { motion } from 'framer-motion';
import Zoom from 'react-medium-image-zoom';

import './products.css';

export default function ModifyProduct( {history} ){

    const [ transports, setTransports ] = useState([]);
    const [ conditions, setConditions ] = useState([]);
    const [ product, setProduct ] = useState([]);
    const [ message, setMessage ] = useState("");
    const [ open, setOpen ] = useState(false);

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
            conditionId = product.data.condition._id;
        if(transportId === undefined)
            transportId = product.data.transport._id;
        
        const productData = new FormData();
        productData.append("name", name);
        productData.append("description", description);
        productData.append("image", image);
        productData.append("conditionId", conditionId);
        productData.append("transportId", transportId);
        
        try {
            await api.put(`/product/update/${productId}`, productData, { headers: {'userToken': userToken} });
        } catch (error) {
            let message = '';

            if(error.response.status === 400)
                message = 'Champ requis manquant !';
            else
                message = "Veuillez uploader une image de 2Mo ou moins s'il vous plait ! (.jpg, .jpeg)";
                
            setMessage(message);
            console.log(message);
            return;
        }

        history.push('/products');
    };

    const deleteProduct = async () => {
        try {
            await api.delete(`/matchs/delete/${productId}`, { headers: {'userToken': userToken} })
            await api.delete(`/product/delete/${productId}`, { headers: {'userToken': userToken} });
        } catch (error) {
            setMessage("Impossible de supprimer le produit pour le moment...");

            return;
        }

        history.push('/products');
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    return(
        <div id="modifyContainer">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <div id="modifyMessage">
                    {message}
                </div>
                <form id="addProductForm" onSubmit={handleSubmit}>
                    <div id="productImageContainer">
                        <Zoom><img id="productFormImg" src={adress + '/files/' + product.data.image} draggable="false" alt="productImg"></img></Zoom>
                    </div>
                    <FormControl className="productForm">
                        <TextField id="name" label="Nom" defaultValue={product.data.name}
                            onChange={event => setName(event.target.value)} />
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
                            {transports.data.map(transport => <option value={transport._id} key={transport._id}>{transport.name}</option>)}
                        </NativeSelect>
                    </FormControl>
                    <FormControl className="productForm">
                        <TextField id="description" label="Description" defaultValue={product.data.description} multiline
                            rows={2} onChange={event => setDescription(event.target.value)} />
                        <div id="preview" style={{backgroundImage: `url(${preview})`}}></div>
                        <TextField id="image" type="file"
                            onChange={event => setImage(event.target.files[0])} inputProps={{ accept: '.jpg, .jpeg' }}/>
                    </FormControl>
                    
                    <div id="btn">
                        <Fab aria-label="previous" id="backBtn" component={Link} to={'/products'}>
                            <ArrowBack />
                        </Fab>
                        <Fab aria-label="delete" id="delBtn" onClick={ handleClickOpen }>
                            <Delete />
                        </Fab>
                        <Fab aria-label="add" id="addProductBtn" type="submit">
                            <Done />
                        </Fab>
                    </div>
                </form>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Supprimer le produit ?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Êtes-vous sûr de vouloir supprimer ce produit ? Les potentiels 'match' en cours seront annulés par la même occasion.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Non
                        </Button>
                        <Button onClick={deleteProduct} color="primary" autoFocus>
                            Oui
                        </Button>
                    </DialogActions>
                </Dialog>
            </motion.div>
        </div>
    );
}
