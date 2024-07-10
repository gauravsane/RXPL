const mongoose = require("mongoose");

//Configure MR schema...
const mrSchema = new mongoose.Schema({
  MRID: {
    type: String,
    required: true,
    unique: true,
  },
  USERNAME: {
    type: String,
    required: false,
  },
  PASSWORD: {
    type: String,
    required: false,
  },
  EMAIL: {
    type: String,
    required: false,
  },
  HQ: {
    type: String,
    required: false,
  },
  REGION: {
    type: String,
    required: false,
  },
  ZONE: {
    type: String,
  },
  BUSINESSUNIT: {
    type: String,
    required: false,
  },
  TEAMNAME: {
    type: String,
    required: false,
  },
  DOJ: {
    type: String,
    required: false,
  },
  MRUploadedData: [
    {
      DrName: String,
      Specility: String,
      MOBNO: String,
      ScCode: String,
      BrandName: String,
      NoRxns: String,
      RxnDuration: String,
      PrescriptionImage: String,
      DateOfCreation: {
        type: String,
        default: () => {
          const currentDate = new Date();
          const day = currentDate.getDate().toString().padStart(2, "0");
          const month = (currentDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const year = currentDate.getFullYear();
          return `${day}-${month}-${year}`;
        },
      },
    },
  ],
});

const mrModel = mongoose.model("Mr", mrSchema);

module.exports = mrModel;
