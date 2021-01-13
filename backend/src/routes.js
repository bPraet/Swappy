const express = require('express');
const multer = require('multer');

const routes = express.Router();

const userController = require('./controllers/userController');
const productController = require('./controllers/productController');
const authController = require('./controllers/authController');

const uploadConfig = require('./config/upload');
const upload = multer(uploadConfig);

routes.get("/", (req, res) => {
    res.send("Hello World");
});

//Product
routes.get('/products', productController.getProducts);
routes.get('/productsUser', productController.getProductByUserId);
routes.get('/product/:productId', productController.getProductById);
routes.post('/product/add', upload.single("image"), productController.addProduct);
routes.delete('/product/delete/:productId', productController.delProduct);
routes.put('/product/update/:productId', upload.single("image"), productController.updateProduct);

//Condition
routes.get('/conditions', productController.getConditions);
routes.post('/condition/add', productController.addCondition);

//Transport
routes.get('/transports', productController.getTransports);
routes.post('/transport/add', productController.addTransport);

//User
routes.get('/user/:userId', userController.getUserById);

//Role
routes.post('/role/add', userController.addRole);

//Authentication
routes.post('/user/register', authController.register);
routes.post('/login', authController.login);

module.exports = routes;