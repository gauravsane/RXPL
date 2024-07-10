const express = require("express");
const router = express.Router();

const multer = require('multer');

const fs = require('fs');

const upload = multer({ dest: 'uploads/' });


const {handleAdminCreation,handleAdminLogin,handleExcelsheetUpload,fetchedBrandName,uploadLiveMatches,addNewBrandNames} = require("../Controllers/AdminController")



router.route("/create-admin").post(handleAdminCreation);
router.route("/admin-login").post(handleAdminLogin);


//ExcelSheet upload with new branching(TLM-SLM-FLM-MR)....
router.post("/upload-excelSheet-admin/:id", upload.single('file'), handleExcelsheetUpload);
router.post("/addBrands/:id",addNewBrandNames);
router.post("/liveMatches/:id",uploadLiveMatches);



//All Get Api
router.get("/fetchedBrandName",fetchedBrandName);

module.exports = router