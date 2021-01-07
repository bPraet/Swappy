const express = require('express');
const multer = require('multer');

const routes = express.Router();

const userController = require('./controllers/userController');
const productController = require('./controllers/productController');

const uploadConfig = require('./config/upload');
const upload = multer(uploadConfig);

routes.get("/", (req, res) => {
    res.send("Hello World");
});

//Product
routes.post('/product/add', upload.single("images"), productController.addProduct);
routes.get('/product/:productId', productController.getProductById);

//User
routes.post('/user/register', userController.register);
routes.get('/user/:userId', userController.getUserById);

module.exports = routes;