const express = require("express");
const controller = require('../controllers/storyController')

const router = express.Router();

router.get('/',controller.home)

router.get('/contact', controller.contact);

router.get('/about', controller.about);

module.exports=router; 