const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const registerController = require('./controllers/registerController');

const PORT = process.env.PORT || 8000;

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post('/register', registerController.store);

try {
    mongoose.connect(
        process.env.MONGO_DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
    console.log('MongoDB connected');
} catch (error) {
    
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});