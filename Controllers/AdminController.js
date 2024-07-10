const express = require("express");
const AdminModel = require("../Models/AdminModel");
const tlmModel = require("../Models/TlmModel");
const slmModel = require("../Models/SlmModel");
const flmModel = require("../Models/FlmModel");
const Mr = require("../Models/MrModel");
const jwt = require("jsonwebtoken");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const xlsx = require("xlsx");
const path = require("path");

const handleAdminCreation = async (req, res) => {
  try {
    const { Name, AdminId, Password, Gender, MobileNumber } = req.body;

    const admin = await AdminModel.findOne({ AdminId: AdminId });

    if (admin) {
      return res.status(400).json({
        msg: "AdminId Already Exitsts",
        success: false,
      });
    }

    const newAdmin = await new AdminModel({
      Name,
      AdminId,
      Password,
      Gender,
      MobileNumber,
    });

    await newAdmin.save();

    console.log("RegisteredAdmin", newAdmin);

    return res.status(200).json({
      success: true,
      newAdmin,
    });
  } catch (error) {
    console.log("Error in handleTopMrByDoctor");
    let err = error.message;
    return res.status(500).json({
      msg: "Internal Server Error",
      err,
    });
  }
};

const handleAdminLogin = async (req, res) => {
  try {
    const { AdminId, Password } = req.body;
    console.log(req.body);
    const admin = await AdminModel.findOne({ AdminId });
    console.log({ admin });
    if (admin) {
      if (admin.Password === Password) {
        console.log("process.env.SECRETKEY: ", process.env.SECRETKEY);
        const name = admin.Name;

        const token = jwt.sign(
          { id: admin._id, role: admin.role },
          process.env.SECRETKEY
        );
        return res.status(200).json({
          msg: "Login",
          success: true,
          admin,
          token,
          name,
        });
      } else {
        return res.status(400).json({
          msg: "Password is Incorrect",
          success: false,
        });
      }
    } else {
      return res.status(400).json({
        msg: "Admin Not Found",
        success: false,
      });
    }
  } catch (error) {
    const errMsg = error.message;
    console.log({ errMsg });
    return res.status(500).json({
      msg: "Internal Server Error",
      errMsg,
    });
  }
};

const handleExcelsheetUpload = async (req, res) => {
  try {
    // Admin Exist or not checking......
    const AdminId = req.params.id;
    const admin = await AdminModel.findById(AdminId);
    if (!admin) {
      return res.status(400).json({
        msg: "Admin Not Found",
      });
    }

    // EXCEL SHEET Upload file....
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // For loop the sheet data to store in various collections
    for (const row of sheetData) {
      console.log("SheetDataExcel :", row);

      // Check the TLM exists or not
      let existTlm = await tlmModel.findOne({ TLMEmpID: row.TLMID });
      if (existTlm) {
        // Update existing TLM data if it already exists
        existTlm.TLMName = row.TLMNAME;
        existTlm.Password = row.TLMPASSWORD;
        existTlm.HQ = row.TLMHQ;
        existTlm.ZONE = row.TLMZONE;
        await existTlm.save();
      } else {
        // TLM doesn't exist, create new TLM
        existTlm = new tlmModel({
          TLMEmpID: row.TLMID,
          TLMName: row.TLMNAME,
          Password: row.TLMPASSWORD,
          HQ: row.TLMHQ,
          ZONE: row.TLMZONE,
        });
        await existTlm.save();
        admin.Tlm.push(existTlm._id);
        await admin.save();
      }

      // Check the SLM exists or not
      let existSlm = await slmModel.findOne({ SLMEmpID: row.SLMID });
      if (existSlm) {
        // Update existing SLM data if it already exists
        existSlm.SLMName = row.SLMNAME;
        existSlm.Password = row.SLMPASSWORD;
        existSlm.HQ = row.SLMHQ;
        existSlm.REGION = row.SLMREGION;
        existSlm.ZONE = row.SLMZONE;
        await existSlm.save();
      } else {
        // SLM doesn't exist, create new SLM
        existSlm = new slmModel({
          SLMEmpID: row.SLMID,
          SLMName: row.SLMNAME,
          Password: row.SLMPASSWORD,
          HQ: row.SLMHQ,
          REGION: row.SLMREGION,
          ZONE: row.SLMZONE,
        });
        await existSlm.save();
        existTlm.Slm.push(existSlm._id);
        await existTlm.save();
      }

      // Check the FLM exists or not
      let existFlm = await flmModel.findOne({ FLMEmpID: row.FLMID });
      if (existFlm) {
        // Update existing FLM data if it already exists
        existFlm.BDMName = row.FLMNAME;
        existFlm.Password = row.FLMPASSWORD;
        existFlm.HQ = row.FLMHQ;
        existFlm.REGION = row.FLMREGION;
        existFlm.ZONE = row.FLMZONE;
        await existFlm.save();
      } else {
        // FLM doesn't exist, create new FLM
        existFlm = new flmModel({
          FLMEmpID: row.FLMID,
          BDMName: row.FLMNAME,
          Password: row.FLMPASSWORD,
          HQ: row.FLMHQ,
          REGION: row.FLMREGION,
          ZONE: row.FLMZONE,
        });
        await existFlm.save();
        existSlm.Flm.push(existFlm._id);
        await existSlm.save();
      }

      // Check the MR exists or not
      let existingMr = await Mr.findOne({ MRID: row.MRID });
      // const cleanDOJ = row.MRDOJ.replace("`", "");
      const cleanDOJ =
        typeof row.MRDOJ === "string" ? row.MRDOJ.replace("`", "") : row.MRDOJ;
      if (existingMr) {
        // Update existing MR data if it already exists
        existingMr.USERNAME = row.MRNAME;
        existingMr.EMAIL = row.MREMAIL;
        existingMr.PASSWORD = row.MRPASSWORD;
        existingMr.ROLE = row.MRROLE;
        existingMr.HQ = row.MRHQ;
        existingMr.REGION = row.MRREGION;
        existingMr.ZONE = row.MRZONE;
        existingMr.BUSINESSUNIT = row.MRBUSSINESSUNIT;
        existingMr.TEAMNAME = row.TEAMNAME;
        existingMr.DOJ = cleanDOJ;
        await existingMr.save();
      } else {
        // MR doesn't exist, create new MR
        existingMr = new Mr({
          MRID: row.MRID,
          USERNAME: row.MRNAME,
          EMAIL: row.MREMAIL,
          PASSWORD: row.MRPASSWORD,
          ROLE: row.MRROLE,
          HQ: row.MRHQ,
          REGION: row.MRREGION,
          ZONE: row.MRZONE,
          BUSINESSUNIT: row.MRBUSSINESSUNIT,
          TEAMNAME: row.TEAMNAME,
          DOJ: cleanDOJ,
        });
        await existingMr.save();
        existFlm.Mrs.push(existingMr._id);
        await existFlm.save();
      }
    }

    res
      .status(200)
      .json({ message: "Data uploaded successfully", success: true });
  } catch (error) {
    console.error(error);
    const err = error.message;
    res.status(500).json({
      error: "Internal server error",
      err,
    });
  }
};

const BrandName = ["INFIMAB", "HUMIMAB-HC", "TOFASHINE", "HEADON"];

const fetchedBrandName = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "BrandName fetched Success",
      data: BrandName,
    });
  } catch (error) {
    console.error(error);
    const err = error.message;
    res.status(500).json({
      error: "Internal server error",
      err,
    });
  }
};

const addNewBrandNames = async (req,res) =>{
  
}

const uploadLiveMatches = async (req, res) => {
  try {
    const AdminId = req.params.id;
    const admin = await AdminModel.findById(AdminId);

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "AdminId not found" });
    }
    const { teamA, teamB, startDate, endDate } = req.body;

    const match = { teamA, teamB, startDate, endDate };

    // Parse dates correctly
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate.split("-").reverse().join("-"));
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate.split("-").reverse().join("-"));
    end.setHours(0, 0, 0, 0);

    if (start.getTime() === today.getTime()) {
      admin.LiveMatches.push(match);
      io.emit("liveMatch", match);
    } else if (start.getTime() > today.getTime()) {
      admin.UpcomingMatches.push(match);
    } else {
      admin.PastMatches.push(match);
    }
    await admin.save();

    res
      .status(200)
      .json({ success: true, message: "Data Uploaded Successfully", match });
  } catch (error) {
    console.error(error);
    const err = error.message;
    res.status(500).json({
      error: "Internal server error",
      err,
    });
  }
};

module.exports = {
  handleAdminCreation,
  handleAdminLogin,
  handleExcelsheetUpload,
  fetchedBrandName,
  uploadLiveMatches,
  addNewBrandNames
};
