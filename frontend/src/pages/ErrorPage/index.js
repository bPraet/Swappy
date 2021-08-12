import React from 'react';
import { motion } from 'framer-motion';
import './error.css';

export default function ErrorPage() {

    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <div>ERROR 404</div>
        </motion.div>
    );
}