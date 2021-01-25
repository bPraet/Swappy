import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './proposal.css';

import { Grid, CircularProgress, FormControlLabel, Checkbox, Fab, FormControl } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import api from '../../services/api';
import adress from '../../services/config';

export default function Proposal({ history }) {

    const [productsUser, setProductsUser] = useState([]);
    const { productId } = useParams();

    const [state, setState] = React.useState({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
        15: false
    });

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        api.get('/productsUser', { headers: { 'userToken': userToken } }).then(result => {
            setProductsUser(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history]);

    if (productsUser.data === undefined)
        return <CircularProgress size="100px" />;

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const userToken = localStorage.getItem('userToken');
        let product;
        try{
            product = await api.get(`/product/${productId}`, { headers: {'userToken': userToken} });
            history.push('/finder');
        }catch(error){
            console.log(error);
        };
        for(const checked in state){
            if(state[checked]){
                try {
                    await api.post(`/match/add`, {owner: product.data.user._id, productOwner: productId, productConsignee: productsUser.data[checked]}, { headers: {'userToken': userToken} });

                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    return (
        <div id="products">
            <form id="proposalForm" onSubmit={handleSubmit}>
                <FormControl>
                    <Grid container spacing={1}>
                        {productsUser.data[0] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[0]} onChange={handleChange} name="0" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[0].image} className="productImg" alt="product1" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[1] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[1]} onChange={handleChange} name="1" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[1].image} className="productImg" alt="product2" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[2] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[2]} onChange={handleChange} name="2" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[2].image} className="productImg" alt="product3" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[3] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[3]} onChange={handleChange} name="3" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[3].image} className="productImg" alt="product4" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[4] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[4]} onChange={handleChange} name="4" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[4].image} className="productImg" alt="product5" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[5] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[5]} onChange={handleChange} name="5" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[5].image} className="productImg" alt="product6" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[6] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[6]} onChange={handleChange} name="6" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[6].image} className="productImg" alt="product7" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[7] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[7]} onChange={handleChange} name="7" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[7].image} className="productImg" alt="product8" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[8] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[8]} onChange={handleChange} name="8" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[8].image} className="productImg" alt="product9" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[9] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[9]} onChange={handleChange} name="9" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[9].image} className="productImg" alt="product10" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[10] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[10]} onChange={handleChange} name="10" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[10].image} className="productImg" alt="product11" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[11] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[11]} onChange={handleChange} name="11" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[11].image} className="productImg" alt="product12" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[12] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[12]} onChange={handleChange} name="12" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[12].image} className="productImg" alt="product13" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[13] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[13]} onChange={handleChange} name="13" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[13].image} className="productImg" alt="product14" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[14] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[14]} onChange={handleChange} name="14" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[14].image} className="productImg" alt="product15" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }
                        {productsUser.data[15] ?
                            <Grid item xs={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={state[15]} onChange={handleChange} name="15" />
                                    }
                                    label={
                                        <img src={adress + '/files/' + productsUser.data[15].image} className="productImg" alt="product16" draggable="false"></img>
                                    } className="productImgContainer">
                                </FormControlLabel>
                            </Grid>
                        : '' }


                        
                    </Grid>
                </FormControl>
                <FormControl>
                    <Fab aria-label="add" id="addProductBtn" type="submit">
                        <Done />
                    </Fab>
                </FormControl>

            </form>

        </div>
    );
}