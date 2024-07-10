const mrModel = require("../Models/MrModel");
const xlsx = require("xlsx");
var nodemailer = require("nodemailer");
const AdminModel = require("../Models/AdminModel");
const flmModel = require("../Models/FlmModel");
const SlmModel = require("../Models/SlmModel");
const TlmModel = require("../Models/TlmModel");
// const ExcelJS = require('exceljs');
// const path = require('path');

const createMr = async (req, res) => {
  try {
    const flmId = req.params.id;
    const flm = await flmModel.findById({ _id: flmId });

    if (!flm) {
      return res.status(400).json({
        msg: "Flm Not Found",
      });
    }

    const {
      USERNAME,
      MRID,
      PASSWORD,
      EMAIL,
      ROLE,
      HQ,
      REGION,
      ZONE,
      BUSINESSUNIT,
      TEAMNAME,
      DOJ,
    } = req.body;

    let mr;

    mr = await mrModel.findOne({ MRID: MRID });

    if (mr) return res.status(400).json({ msg: "MR is already Exists", MRID });

    const mrExistEmail = await mrModel.findOne({ EMAIL: EMAIL });
    if (mrExistEmail) {
      return res.status(501).send({
        message: "MR with same email found in database..!!",
        success: false,
      });
    }

    mr = new mrModel({
      USERNAME,
      MRID,
      PASSWORD,
      EMAIL,
      ROLE,
      HQ,
      REGION,
      ZONE,
      TEAMNAME,
      BUSINESSUNIT,
      DOJ,
    });

    mr.loginLogs.push({
      timestamp: new Date(),
      cnt: 1,
    });

    await mr.save();
    flm.Mrs.push(mr._id);

    await flm.save();
    return res.status(200).json(mr);
  } catch (error) {
    console.log("Error in CreateMr");
    let err = error.message;
    return res.status(500).json({
      msg: "Internal Server Error",
      err,
    });
  }
};

const loginMr = async (req, res) => {
  try {
    const { MRID, PASSWORD } = req.body;

    // console.log("flutter body", req.body);

    if (!PASSWORD || !MRID) {
      return res
        .status(401)
        .send({ message: "Plz fill all credentials..!!", success: false });
    }

    let mr = await mrModel.findOne({ MRID: MRID });

    if (!mr)
      return res.status(400).json({
        msg: "Mr Not Found",
      });

    if (mr.PASSWORD !== PASSWORD) {
      return res
        .status(402)
        .send({ message: "Plz fill correct credentials..!!", success: false });
    }

    //   mr.loginLogs.push({
    //     timestamp: new Date(),
    //     cnt: mr.loginLogs.length + 1,
    //   });

    // console.log(mr.loginLogs);
    await mr.save();

    const ObjmrId = mr._id;
    const mrName = mr.USERNAME;

    return res.status(200).json({
      success: true,
      ObjmrId,
      MRID,
      mrName,
    });
  } catch (error) {
    console.log("Error in Login");
    let err = error.message;
    return res.status(500).json({
      msg: "Internal Server Error",
      err,
    });
  }
};

const getProfileMr = async (req, res) => {
  try {
    const MrId = req.params.id;
    const mr = await mrModel.findOne({ _id: MrId }).select('-MRUploadedData');

    if (!MrId) {
      return res.status(400).json({
        msg: "Mr Not Found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Profile Data Fetched Successfully",
      mr,
    });
  } catch (error) {
    console.log("Error in Login");
    let err = error.message;
    return res.status(500).json({
      msg: "Internal Server Error",
      err,
    });
  }
};

const handleForgetPassword = async (req, res) => {
  try {
    const { MRID } = req.body;
    const mrExist = await mrModel.findOne({ MRID: MRID });

    if (!mrExist) {
      return res
        .status(404)
        .send({ message: "MR Not found...!!!", success: false });
    }

    // Send the password directly via email
    const password = mrExist.PASSWORD;
    const email = mrExist.EMAIL;
    const name = mrExist.USERNAME;

    // NodeMailer Configuration
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "digilateraldev@gmail.com",
        pass: "ohax atcp umht xked",
      },
    });

    // Email content
    var mailOptions = {
      from: "digiLateralQuizPanel@gmail.com",
      to: email,
      subject: "Password API correctly working take your Password...",
      html: `
              <div style="border: 1px solid #000; padding: 10px; text-align: center;">
                <h3 style="text-align: center;">Dear : ${name}</h3>
                <p> Your Password For <span style="background-color: orange; color: white; padding: 3px;">Rxpl</span> : ${password}</p>
                <p>Please keep this information secure.</p>
                <p>If you didn't request this, please ignore this email.</p>
              </div>
            `,
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send({ message: "Error sending email", success: false });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .send({ message: "Password sent successfully", success: true });
      }
    });

    res
      .status(201)
      .json({
        message: `MR NAME : ${name} PASSWORD RESTORE SUCCESSFULLY...`,
        success: true,
      });
  } catch (error) {
    console.log("Error in forgotting password");
    let err = error.message;
    return res.status(500).json({
      msg: "Internal Server Error",
      err,
    });
  }
};

const handleUploadPrescriptionData = async (req, res) =>{
  try {
    const mrId = req.params.id
    console.log('MrId',mrId)

     //Check Mr exist or not...
     const mrExist = await mrModel.findById(mrId);
     if (!mrExist) {
       return res
         .status(501)
         .send({ message: "MR Id Not Found..!!", success: false });
     }
 
    const { Name,Specility,MOBNO,ScCode,BrandName,NoRxns,RxnDuration} = req.body;

    const prescriptionImagePath = req.file ? req.file.path : 'path not found';

    console.log('Upload Data',req.body);

    const MRUploadedData = {
      DrName: Name,
      Specility: Specility,
      MOBNO: MOBNO,
      ScCode: ScCode,
      BrandName: BrandName,
      NoRxns: NoRxns,
      RxnDuration: RxnDuration,
      PrescriptionImage: prescriptionImagePath
    }

    if(!Name || !Specility || !BrandName || !NoRxns || !RxnDuration || !prescriptionImagePath){
      return res.status(400).json({message: "Please fill all required details", success:false})
    }


    mrExist.MRUploadedData.push(MRUploadedData);
       // Save the MR document
       await mrExist.save();

       res.status(200).json({
        message: "Updated Store successfully",
        success: true,
        MRUploadedData: MRUploadedData
      });

  } catch (error) {
    console.log("Error in Login");
    let err = error.message;
    return res.status(500).json({
      msg: "Internal Server Error",
      err,
    }); 
  }
};

module.exports = {
  createMr,
  loginMr,
  getProfileMr,
  handleForgetPassword,
  handleUploadPrescriptionData
};
