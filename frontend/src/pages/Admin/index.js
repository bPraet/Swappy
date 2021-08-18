import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { CircularProgress } from '@material-ui/core';
import { Mail, Block } from '@material-ui/icons';

import './admin.css';

import { motion } from 'framer-motion';
import api from '../../services/api';

export default function Admin({ history }){

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');

        api.get('/admin/users', { headers: { 'userToken': userToken } }).then(result => {
            result.data.forEach((user, i) => {
                user.id = i + 1
                user.actions = <button>coucou</button>
            });
            setUsers(result.data);
        }).catch((err) => {
            history.push('/');
        });
    }, [history]);

    if(users === undefined)
        return <CircularProgress size="100px"/>;

    const renderActions = (params) => {
        return (
        <div id="adminActions">
            <Link to={`/admin/mail/${params.row.email}`}>
                <Mail />
            </Link>
            <Link to={`/admin/block/${params.row._id}`}>
                <Block />
            </Link>
        </div>
        );
    }

    const columns = [
        { field: '_id', headerName: 'ID', width: 220 },
        {
            field: 'firstName',
            headerName: 'Nom',
            width: 200,
        },
        {
            field: 'lastName',
            headerName: 'Prénom',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
        },
        {
            field: 'adress',
            headerName: 'Adresse',
            width: 250,
        },
        {
            field: 'pseudo',
            headerName: 'Pseudo',
            width: 200,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            renderCell: renderActions,
            sortable: false,
            width: 150,
        },
    ];

    return(
       <div id="adminContainer">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <h1>Panneau d'administration</h1>

                <div id="usersGridContainer">
                    <DataGrid
                        rows={users}
                        columns={columns}
                        pageSize={20}
                        rowsPerPageOptions={[20]}
                    />
                </div>
            </motion.div>
            
        </div>
    );
}