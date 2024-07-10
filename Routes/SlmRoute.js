const express = require('express');
const router = express.Router();

const { slmRegister, slmLogin } = require('../Controllers/SlmController');

//SLM register route.....
router.post("/slm-create/:id", slmRegister);

//SLM Login route....
router.post("/slm-login", slmLogin);



module.exports = router;