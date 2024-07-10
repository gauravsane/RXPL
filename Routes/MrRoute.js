const express = require("express")
const router = express.Router();
const multer = require('multer');
const fs = require("fs");

const { createMr, loginMr,getProfileMr,handleForgetPassword,handleUploadPrescriptionData} = require("../Controllers/MrController");

// Multer configuration for file uploads....
const PrescriptionImage = 'uploads';
if (!fs.existsSync(PrescriptionImage)) {
    fs.mkdirSync(PrescriptionImage);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PrescriptionImage);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });



//All Post Api here
router.post("/create-mr/:id", createMr);
router.post("/login-mr", loginMr);
router.post("/forget-mr-password", handleForgetPassword);
router.post("/uploadPrescriptionData/:id", upload.single('PrescriptionImage'),handleUploadPrescriptionData)


//All Get Api here
router.get("/profile/:id",getProfileMr)



module.exports = router