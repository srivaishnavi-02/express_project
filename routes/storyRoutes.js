const express = require("express");
const controller = require('../controllers/storyController')
const {isLoggedIn, isHost, isNotHost} = require('../middleware/auth');
const { validateId, validateResult, validateRSVP, validateStory } = require('../middleware/validator');

const {fileUpload} = require('../middleware/fileUpload.js');

const router = express.Router();

// get /stories
router.get('/',controller.index);

// get /stories/new
router.get('/newEvents',  isLoggedIn, controller.new);

router.post('/', fileUpload, isLoggedIn, validateStory, validateResult, controller.create);

//get /stories/id get stories by id
router.get('/:id',validateId, controller.show);

//update /stories/:id/edit update form by id
router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit);

//update /stories/:id/edit update story identified by id
router.put('/:id', fileUpload, validateId, isLoggedIn, isHost, validateStory, validateResult, controller.update);

//delete /stories/:id delete existing story by id
router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);

router.post('/:id/rsvp', validateId, isLoggedIn, controller.editrsvp);

router.delete('/rsvp/:id', validateId, isLoggedIn, controller.deletersvp);


module.exports = router;


