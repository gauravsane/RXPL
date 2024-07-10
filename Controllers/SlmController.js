const tlmModel = require("../Models/TlmModel");
const slmModel = require("../Models/SlmModel");
const AdminModel = require("../Models/AdminModel");

//Register Slm controller...
const slmRegister = async (req, res) => {
    try {
        const { ID, NAME, PASSWORD, HQ, ZONE, REGION } = req.body;
        const slm = await slmModel.findOne({ ID: ID });

        const Id = req.params.id;
        const tlm = await tlmModel.findById({ _id: Id });

        if (slm) {
            return res.status(400).json({
                msg: "Slm Already Exists",
                success: false
            })
        }

        const format = {
            SLMEmpID: ID,
            SLMName: NAME,
            Password: PASSWORD,
            HQ: HQ,
            ZONE: ZONE,
            REGION: REGION
        }

        const newSlm = new slmModel(format);

        // Save the new MR to the database
        await newSlm.save();
        tlm.Slm.push(newSlm._id);
        await tlm.save();
        return res.status(201).json({
            msg: 'Slm created successfully',
            success: true,
            Slm: newSlm,
        });
    } catch (error) {
        const errMsg = error.message
        console.log("Error in slm Create..!!");
        return res.status(500).json({
            success: false,
            errMsg
        })
    }
}

//Login Slm controller....
const slmLogin = async (req, res) => {
    try {
        const { ID, PASSWORD } = req.body;
        const slm = await slmModel.findOne({ SLMEmpID: ID });
        if (!slm) {
            return res.status(400).json({
                msg: "Slm not Found",
                success: false
            })
        } else {
            if (PASSWORD == slm.Password) {
                slm.loginLogs.push({
                    timestamp: new Date(),
                    cnt: slm.loginLogs.length + 1
                });
                await slm.save();
                return res.status(200).json({
                    msg: "Login Done",
                    success: true,
                    slm
                })
            } else {
                return res.status(400).json({
                    msg: "Password is not correct",
                    success: false
                })
            }
        }
    }
    catch (error) {
        const errMsg = error.message
        console.log("Error in loginTlm");
        return res.status(500).json({
            success: false,
            errMsg
        })
    }
}


module.exports = { slmRegister, slmLogin }