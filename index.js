const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const connectDB = require("./Config/Db");



//Configure dotenv file...
dotenv.config();

//Configure Database connectin file...
connectDB();

//Configure Object Files...
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//Setup Middlewares...
app.use(express());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


const AdminRoute = require("./Routes/AdminRoute");
const TlmRoute = require("./Routes/TlmRoute");
const SlmRoute = require("./Routes/SlmRoute");
const FlmRoute = require("./Routes/FlmRoute");
const MrRoute = require("./Routes/MrRoute");

app.use("/api",AdminRoute);
app.use("/api",TlmRoute);
app.use("/api",SlmRoute);
app.use("/api",FlmRoute);
app.use("/api",MrRoute);



//Configure Server Port...
const port = process.env.PORT || 7500;
//Setup Server port...
http.listen(port, () => {
    console.log(
      `Server is successfully running at port no : ${process.env.PORT}`.bgCyan
        .white
    );
  });