import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import api from '../../services/api'

import { Fab } from '@material-ui/core';
import { Done, ArrowBack } from '@material-ui/icons';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';

export default function Mail({ history }){

    const [ message, setMessage ] = useState('');
    const { email } = useParams();
    const userToken = localStorage.getItem('userToken');

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await api.post('/admin/mail', { email, message },  { headers: { 'userToken': userToken } })
            .catch(err => console.log(err));
        } catch(error){
            console.log(error);
            return;
        }
    }

    return(
        <div id="mailContainer">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <h1>Email</h1>

                <form id="mailForm" onSubmit={handleSubmit}>
                    <Editor
                        initialValue=""
                        apiKey="fl2n810pcohedokvmvejpbtf6xgbaywmf6iky2a6rfaewx1g"
                        init={{
                            branding: false,
                            height: 500,
                            menubar: true,
                            plugins: ['advlist autolink lists link image charmap print preview anchor help searchreplace visualblocks code insertdatetime media table paste wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
                            skin: 'oxide-dark'
                        }}
                        onChange={event => setMessage(event.target.getContent())}
                    />
                    <div id="btn">
                        <Fab aria-label="previous" id="backBtn" onClick={history.goBack}>
                            <ArrowBack />
                        </Fab>
                        <Fab aria-label="send" id="sendBtn" type="submit">
                            <Done />
                        </Fab>
                    </div>
                </form>
            </motion.div> 
        </div>
    );
}