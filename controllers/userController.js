const mongoUtil = require("../utils/mongoUtil");
const { ObjectId } = require("mongodb");
const { auth } = require("../utils/firebaseUtil.js");
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
const Razorpay = require("razorpay");
const {
  validatePaymentVerification,
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils.js");

// razorpay credentials

// TODO - uncomment after hosting
// const key_id = process.env.KEY_ID;
// const key_secret = process.env.KEY_SECRET;

const key_id = "rzp_test_J03FGVGxMcgSmP";
const key_secret = "0fTBPksPGbrj7nWh8WSr";

const createUser = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const newUser = req.body;
    newUser._id = new ObjectId();
    const result = await users.insertOne(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const result = await users.find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const userId = req.params.id;
    // console.log(userId);
    const result = await users.findOne({ _id: new ObjectId(userId) });
    // console.log(result);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const updatedUser = req.body;
    updatedUser._id = new ObjectId(updatedUser._id);
    // HERE ADD NEW PARAMETER TO USER/ UPDATE A SINGLE PARAMETER OF USER
    const result = await users.updateOne(
      { _id: new ObjectId(updatedUser._id) },
      { $set: updatedUser }
    );
    if (result.matchedCount) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const userId = req.params.id;
    const result = await users.findOneAndDelete({ _id: new ObjectId(userId) });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//ADD MOVIE TO USER'S WATCHLIST
const addMovieToWatchlist = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const userId = req.params.id;
    const movie = req.body.movie;
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { watchlist: movie } }
    );
    if (result.matchedCount) {
      res
        .status(200)
        .json({ message: "Movie added to watchlist successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//REMOVE MOVIE FROM USER'S WATCHLIST
const removeMovieFromWatchlist = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const userId = req.params.id;
    const movie = req.body.movie;
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { watchlist: movie } }
    );
    if (result.matchedCount) {
      res
        .status(200)
        .json({ message: "Movie removed from watchlist successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  console.log(req.body);
  await signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    });
};

const signup = async (req, res) => {
  createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user);
      try {
        const newUser = {
          _id: new ObjectId(),
          uid: user.uid,
          Name: req.body.name,
          Email: req.body.email,
          Subscription: "None",
        };
        const result = await mongoUtil
          .getDB()
          .collection("User")
          .insertOne(newUser);
        // const result = await users.insertOne(newUser);
        console.log(result.insertedId);
        const newProfile = {
          _id: new ObjectId(),
          uid: result.insertedId,
          Profile_name: req.body.name,
        };
        const default_profile = await mongoUtil
          .getDB()
          .collection("Profile")
          .insertOne(newProfile);
        // add profile id to headers
        // req.headers.profile_name = default_profile.Profile_name;
        // req.headers.profile_id = default_profile.insertedId;
        login(req, res);
        // const users_ = await mongoUtil.getDB().collection('User').find({}).toArray();
        // console.log(users_);
        res.status(201).json(result);
      } catch (error) {
        console.log(error);
        // return res;
      }
      // req.uid = user.uid;
      // createUser(req, res);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    });
};

const logout = async (req, res) => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
      res.status(200).json({ message: "User signed out" });
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const googleLogin = async (req, res) => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorMessage);
    });
};

function generateUniqueString() {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substr(2);
  return timestamp + randomSuffix;
}

// payment functions
const createOrder = async (req, res) => {
  // creating a razorpay instance
  const razorpay = new Razorpay({ key_id, key_secret });

  // create random
  const receipt_id = generateUniqueString();

  // setting up options for razorpay order
  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: `receipt-${receipt_id}`,
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    res.status(400).send("Not able to create order. Please try again!");
  }
};

const verifyOrder = (req, res) => {
  // do a validation
  const paymentValidation = validatePaymentVerification(
    { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
    signature,
    secret
  );

  if (razorpay_signature === generated_signature) {
    res.json({ success: true, message: "Payment has been verified" });
  } else {
    res.json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  login,
  signup,
  logout,
  googleLogin,
  createOrder,
  verifyOrder,
};
