const express = require('express');
const router = express.Router();

const { tlmRegister,tlmLogin } = require('../Controllers/TlmController');

//TLM register route.....
router.post("/tlm-create/:id", tlmRegister);

//TLM Login route....
router.post("/tlm-login", tlmLogin);


module.exports = router;