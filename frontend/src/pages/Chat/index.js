import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../../services/api';

import './chat.css';

import { CircularProgress } from '@material-ui/core';

export default function Chat({ history }) {
    const [user, setUser] = useState();
    const [consignee, setConsignee] = useState();
    const { userId } = useParams();
    const userToken = localStorage.getItem('userToken');
    
    useEffect(() => {
        let reloadCount = sessionStorage.getItem('reloadCount');
        if(reloadCount < 2) {
            sessionStorage.setItem('reloadCount', String(reloadCount + 1));
            window.location.reload();
        } else {
            sessionStorage.removeItem('reloadCount');
        }

        api.get('/user', { headers: {'userToken': userToken} }).then( result => {
            setUser(result);
        }).catch((err) => {
            history.push('/');
        });

        api.get(`/user/${userId}`, { headers: {'userToken': userToken} }).then( result => {
            setConsignee(result);
        }).catch((err) => {
            history.push('/');
        });
    }, [history, userToken, userId]);

    if(user === undefined || consignee === undefined)
        return <CircularProgress size="100px"/>;

    const socket = io("http://localhost:8000");

    socket.emit('join', `${user.data._id},${userId}`);

    socket.on('onMessage', (message) => {
        let li = document.createElement('li');

        li.textContent = message;
        li.className = 'from';
        document.getElementById('messages').appendChild(li);
        li.scrollIntoView();
    });

    socket.on('isWriting', (message) => {
        const isWriting = document.getElementById('isWriting');
        let id = window.setTimeout(function() {}, 0);

        while (id--) {
            window.clearTimeout(id);
        }

        isWriting.innerText = message;
        id = setTimeout(() => isWriting.innerText = '', 3000);
    });

    const sendMessage = (event, message) => {
        event.preventDefault();
        let li = document.createElement('li');
        
        li.textContent = message;
        li.className = 'to';
        document.getElementById('messages').appendChild(li);
        socket.emit('emitMessage', message);
        li.scrollIntoView();
    }

    return (
        <div className="chat">
            <div id="chatName">Conversation avec {consignee.data.pseudo}</div>
            <ul id="messages"></ul>
            <div id="isWriting"></div>
            <form id="form" action="">
                <input id="message" autoComplete="off" onChange={ () => socket.emit('isWriting', user.data.pseudo) }/>
                <button onClick={ (event) => sendMessage(event, document.getElementById('message').value) }>Envoyer</button>
            </form>
        </div> 
    );
}