import React from 'react';
import { motion } from 'framer-motion';
import './error.css';

export default function ErrorPage() {

    return (
        <div id="errorContainer">
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <div id="error404">404</div>
                <div id="error404message">Oops... On dirait que tu t'es perdu, il n'y a rien ici !</div>
                <div id="btnContainer"></div>
            </motion.div>
        </div>
    );
}