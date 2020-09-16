const express = require('express');
const router = express.Router();
const auth =require('../middleware/auth');
const middle = require('../middleware/products.js');


router.get('/',middle.showP);

router.get('/add',middle.getAddP);

router.post('/add',middle.postAddP);


module.exports = router;