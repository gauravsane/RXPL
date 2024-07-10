const express = require('express');
const router = express.Router();
const multer = require("multer");
const { flmRegister, flmLogin } = require('../Controllers/FlmController');

//FLM register route.....
router.post("/flm-create/:id", flmRegister);

//FLM Login route....
router.post("/flm-login", flmLogin);



module.exports = router;