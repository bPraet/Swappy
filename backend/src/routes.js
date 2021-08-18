const express = require('express');
const multer = require('multer');
const verifyToken = require('./config/verifyToken');
const verifyImageSize = require('./config/verifyImageSize');

const routes = express.Router();

const userController = require('./controllers/userController');
const productController = require('./controllers/productController');
const authController = require('./controllers/authController');
const trackingController = require('./controllers/trackingController');
const matchController = require('./controllers/matchController');

const uploadConfig = require('./config/upload');
const swapController = require('./controllers/swapController');
const messageController = require('./controllers/messageController');
const adminController = require('./controllers/adminController');
const upload = multer(uploadConfig);

routes.get("/", (req, res) => {
    res.send("Hello World");
});

//Product
routes.get('/products', verifyToken, productController.getProducts);
routes.get('/productsUser', verifyToken, productController.getProductsByUserId);
routes.get('/product/:productId', verifyToken, productController.getProductById);
routes.get('/products/notSeen', verifyToken, productController.getNotSeenProductsByUserId);
routes.post('/product/add', verifyToken, verifyImageSize,upload.single("image"), productController.addProduct);
routes.delete('/product/delete/:productId', verifyToken, productController.delProduct);
routes.put('/product/update/:productId', verifyImageSize, verifyToken, upload.single("image"), productController.updateProduct);

//Condition
routes.get('/conditions', verifyToken, productController.getConditions);
routes.get('/condition/:conditionId', verifyToken, productController.getConditionById);
routes.post('/condition/add', verifyToken, productController.addCondition);

//Transport
routes.get('/transports', verifyToken, productController.getTransports);
routes.get('/transport/:transportId', verifyToken, productController.getTransportById);
routes.post('/transport/add', verifyToken, productController.addTransport);

//User
routes.get('/user', verifyToken, userController.getProfile);
routes.get('/user/:userId', verifyToken, userController.getUserById);
routes.put('/user/update', verifyToken, userController.updateProfile);

//Role
routes.post('/role/add', verifyToken, userController.addRole);

//Tracking
routes.post('/track/add', verifyToken, trackingController.addAlreadySeen);
routes.delete('/track/reset', verifyToken, trackingController.resetAlreadySeen);

//Match
routes.get('/matchs', verifyToken, matchController.getMatchsByUser);
routes.get('/propositions', verifyToken, matchController.getPropositionsByUser);
routes.post('/match/add', verifyToken, matchController.addMatch);
routes.get('/match/:owner/:consignee/:productId', verifyToken, matchController.getMatchDetails);
routes.delete('/matchs/delete/:productId', verifyToken, matchController.delMatchesByProductId);
routes.delete('/matchs/deleteProposition/:productId/:consigneeId', verifyToken, matchController.delMatchesByProductIdAndConsignee);

//Swap
routes.post('/swap/add', verifyToken, swapController.addSwap);
routes.get('/swaps', verifyToken, swapController.getSwapsByUser);

//Message
routes.post('/message/add', verifyToken, messageController.addMessage);
routes.get('/messages/:user', verifyToken, messageController.getMessagesByUser);

//Authentication
routes.post('/user/register', authController.register);
routes.post('/login', authController.login);

//Admin
routes.get('/admin/users', verifyToken, adminController.getUsers);
routes.post('/admin/mail', verifyToken, adminController.sendEmail);

module.exports = routes;