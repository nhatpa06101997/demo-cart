const express = require('express');
const router = express.Router();
const middle = require('../middleware/cate');

router.get('/',middle.showCate);

router.get('/add',middle.getAddCate);

router.post('/add',middle.postAddCate);

router.get('/edit/:id',middle.getEditCate);

router.post('/edit/:id',middle.postEditCate);

module.exports = router;