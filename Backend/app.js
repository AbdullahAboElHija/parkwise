const express = require("express");
const morgan = require("morgan");

const parkingRouter = require("./routes/parkingRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// 3) ROUTES
app.use("/api/v1/parkings", parkingRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
