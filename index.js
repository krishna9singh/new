const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Create a new Express app
const app = express();

// Set up body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up the MongoDB connection
mongoose
  .connect("mongodb://192.168.1.9:27017/new", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

// Define the schema for the data
const DataSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,

    maxLength: 50,
  },

  role: {
    type: String,
    default: "User",
  },
  resetPasswordLink: {
    data: String,
    default: "",
  },
  fullname: {
    type: String,
    maxLength: 30,
  },
  phone: { type: Number, trim: true, maxLength: 10 },
  DOB: { type: String },
  username: {
    type: String,
    maxLength: 30,
  },

  interest: {
    type: [String],
    default: [],
  },
  puchase_history: {
    type: [String],
    default: [],
  },
  subscriptions: {
    type: [String],
    default: [],
  },
  cart_history: {
    type: [String],
    default: [],
  },
  notifications: {
    type: [String],
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  products: {
    type: [String],
  },
  posts: {
    type: [String],
  },
});

// Define the model for the data
const DataModel = mongoose.model("Data", DataSchema);

// Define the routes for the app
const router = express.Router();

// Create a new data record
router.post("/data", async (req, res) => {
  try {
    const data = new DataModel(req.body);
    await DataModel.createIndexes();
    await data.save();
    res.send(data);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(409).send("Data already exists");
    }
    res.status(500).send(error);
  }
});

// Get all data records
router.get("/data", async (req, res) => {
  try {
    const data = await DataModel.find();
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
app.use("/", router);
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
