const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const { chatInit } = require("./chat");

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

try {
  mongoose.connect(process.env.MONGO_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
} catch (error) {}

app.use("/files", express.static(path.resolve(__dirname, "..", "files")));
app.use(routes);

chatInit(server);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
