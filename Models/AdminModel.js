const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  teamA: String,
  teamB: String,
  startDate: String,
  endDate: String,
  DateOfCreation: {
    type: String,
    default: () => {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      return `${day}-${month}-${year}`;
    },
  },
});

const adminSchema = new mongoose.Schema({
  Name: String,
  AdminId: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum: ["SUPER_ADMIN", "CONTENT_ADMIN", "REPORT_ADMIN", 1],
    default: 1,
  },
  SUPER_ADMIN_COUNT: {
    type: Number,
    default: 0,
  },
  LiveMatches: [matchSchema],
  UpcomingMatches: [matchSchema],
  PastMatches: [matchSchema],
  Password: String,
  Gender: String,
  MobileNumber: String,

  Tlm: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tlm" }],
});

module.exports = mongoose.model("Admin", adminSchema);
