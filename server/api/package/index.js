'use strict';

var express = require('express');
var controller = require('./package.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/byKeyword/:keyword', controller.byKeyword);
router.get('/:id', controller.show);


module.exports = router;
