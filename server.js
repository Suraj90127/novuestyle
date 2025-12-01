const express = require("express");
const { dbConnect } = require("./utiles/db");
const app = express();
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const socket = require("socket.io");
const path = require("path");

const server = http.createServer(app);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://printkalvin.in",
    ],
    credentials: true,
  })
);

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

var allCustomer = [];
var allSeller = [];

const addUser = (customerId, socketId, userInfo) => {
  const checkUser = allCustomer.some((u) => u.customerId === customerId);
  if (!checkUser) {
    allCustomer.push({
      customerId,
      socketId,
      userInfo,
    });
  }
};

const addSeller = (sellerId, socketId, userInfo) => {
  const chaeckSeller = allSeller.some((u) => u.sellerId === sellerId);
  if (!chaeckSeller) {
    allSeller.push({
      sellerId,
      socketId,
      userInfo,
    });
  }
};

const findCustomer = (customerId) => {
  return allCustomer.find((c) => c.customerId === customerId);
};
const findSeller = (sellerId) => {
  return allSeller.find((c) => c.sellerId === sellerId);
};

const remove = (socketId) => {
  allCustomer = allCustomer.filter((c) => c.socketId !== socketId);
  allSeller = allSeller.filter((c) => c.socketId !== socketId);
};

let admin = {};

const removeAdmin = (socketId) => {
  if (admin.socketId === socketId) {
    admin = {};
  }
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes/chatRoutes"));

app.use("/api", require("./routes/paymentRoutes"));
app.use("/api", require("./routes/dashboard/dashboardIndexRoutes"));

app.use("/api/home", require("./routes/home/homeRoutes"));
app.use("/api", require("./routes/order/orderRoutes"));
app.use("/api", require("./routes/home/cardRoutes"));
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/home/customerAuthRoutes"));
app.use("/api", require("./routes/dashboard/sellerRoutes"));
app.use("/api", require("./routes/dashboard/categoryRoutes"));
app.use("/api", require("./routes/dashboard/productRoutes"));
app.use("/api", require("./routes/dashboard/blogRoute"));
app.use("/api", require("./routes/dashboard/couponRoute"));
app.use("/api", require("./routes/dashboard/bannerRoutes"));
app.use("/api", require("./routes/dashboard/giftRoutes"));
app.use("/api", require("./routes/dashboard/designRoute"));
app.use("/api", require("./routes/dashboard/discountRoute"));
app.use("/api", require("./routes/dashboard/heading1routes"));
app.use("/api", require("./routes/dashboard/heading2Routes"));
app.use("/api", require("./routes/dashboard/heading3Routes"));
app.use("/api", require("./routes/dashboard/heading4Routes"));
app.use("/api", require("./routes/dashboard/heading5Routes"));
app.use("/api", require("./routes/metaRoutes"));

// app.get("/", (req, res) => res.send("Hello World!"));

// app.use(express.static(path.join(__dirname, "./client/dist")));
// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/dist/index.html"));
// });

// app.use(express.static(path.join(__dirname, "./dashboard/build")));
// app.get("*/app", function (req, res) {
//   res.sendFile(path.join(__dirname, "./dashboard/build/index.html"));
// });

const port = process.env.PORT;
dbConnect();
server.listen(port, () => console.log(`Server is running on port ${port}!`));

// maxify ecommerce medixfy		https://65.21.2.60:17751/a26f6e2c onkqwnoq	3079ca13
