'use strict';

var express = require('express');
var controller = require('./nodepackage.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/new', controller.newIndex);
router.post('/new', controller.newIndex);
router.get('/statistics', controller.statistics);
router.get('/:id', controller.show);


module.exports = router;
