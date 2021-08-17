import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import { FormControl, TextField, Fab, CircularProgress, InputLabel, NativeSelect, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { Done, ArrowBack } from '@material-ui/icons';
import { motion } from 'framer-motion';

import './products.css';

export default function AddProduct( {history} ){

    const [ transports, setTransports ] = useState([]);
    const [ conditions, setConditions ] = useState([]);
    const [ name, setName ] = useState();
    const [ description, setDescription ] = useState();
    const [ image, setImage ] = useState();
    const [ conditionId, setConditionId ] = useState();
    const [ transportId, setTransportId ] = useState();
    const [ message, setMessage ] = useState("");
    const [ openMessage, setOpenMessage ] = useState(false);

    const userToken = localStorage.getItem('userToken');

    const preview = useMemo(() => {
        return image ? URL.createObjectURL(image) : null;
    }, [image])

    useEffect(() => {
        api.get('/transports', { headers: {'userToken': userToken} }).then( result => {
            setTransports(result);
            setTransportId(result.data[0]._id);
        }).catch((err) => {
            history.push('/');
        });
        api.get('/conditions', { headers: {'userToken': userToken} }).then(result => {
            setConditions(result);
            setConditionId(result.data[0]._id);
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
        } catch(error){
            const message = error.response.data;
            
            setMessage(message);
            setOpenMessage(true);
            return;
        }
        
        history.push('/products');
    };

    const handleCloseMessage = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenMessage(false);
      };

    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    
    return(
        <div id="modifyContainer">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <Snackbar open={openMessage} autoHideDuration={6000} onClose={handleCloseMessage}>
                    <Alert onClose={handleCloseMessage} severity="error">
                        {message}
                    </Alert>
                </Snackbar>
                <form id="addProductForm" onSubmit={handleSubmit}>
                    <FormControl className="productForm">
                        <TextField id="name" label="Nom"
                            onChange={event => setName(event.target.value)} />
                    </FormControl>
                    <FormControl className="productForm">
                        <InputLabel htmlFor="conditions">Etat</InputLabel>
                        <NativeSelect
                            required
                            value={conditionId}
                            onChange={event => setConditionId(event.target.value)}
                            name="conditions"
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
                        >
                            {transports.data.map(transport => <option value={transport._id} key={transport._id}>{transport.name}</option>)}
                        </NativeSelect>
                    </FormControl>
                    <FormControl className="productForm">
                        <TextField id="description" label="Description" multiline
                                rows={4} onChange={event => setDescription(event.target.value)} />
                        <div id="preview" style={{backgroundImage: `url(${preview})`}}></div>
                            
                        <TextField id="image" type="file"
                                onChange={event => setImage(event.target.files[0])} inputProps={{ accept: '.jpg, .jpeg' }}/>
                    </FormControl>
                    
                    <div id="btn">
                        <Fab aria-label="previous" id="backBtn" component={Link} to={'/products'}>
                            <ArrowBack />
                        </Fab>
                        <Fab aria-label="add" id="addProductBtn" type="submit">
                            <Done />
                        </Fab>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
