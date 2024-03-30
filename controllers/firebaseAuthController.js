require("dotenv").config({ path: "../config.env" });
const mongoUtil = require("../utils/mongoUtil");
const { ObjectId } = require("mongodb");
const signupWithEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;
  const body = {
    email: email,
    password: password,
    returnSecureToken: true,
  };
  try {
    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (response) => {
        if (response.error) {
          res
            .status(response.error.code)
            .json({ status: "failure", message: response.error.message });
        } else {
          //CREATE A USER DATABASE AND STORE THE USER DETAILS AND TOKEN
          try {
            // console.log(response);
            const newUser = {
              _id: new ObjectId(),
              uid: response.localId,
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
            const added_profile = await mongoUtil
              .getDB()
              .collection("Profile")
              .insertOne(newProfile);
              //CREATE A DEFAULT PROFILE
              res.status(200).json({
                status: "success",
                message: "User logged in successfully.",
                token: response.idToken,
                uid: response.localId,
                Subscription: newUser.Subscription,
              });
          } catch (error) {
            console.log(error);
            res
              .status(401)
              .json({ message: "Cannot Create Data.", error: error });
          }
        }
      });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ message: "Cannot signup at this moment.", error: error });
  }
};

const signinWithEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;
  const body = {
    email: email,
    password: password,
    returnSecureToken: true,
  };
  try {
    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then((resp) => {
        return resp.json();
      })
      .then(async (response) => {
        console.log(response);
        if (response.error) {
          res
            .status(response.error.code)
            .json({ status: "failure", message: response.error.message });
        } else {
          //EXTRACT THE UID FROM USER having email
          const user = mongoUtil.getDB().collection("User");
          console.log(email);
          const u1 = await user.findOne({ Email: email });
          console.log(u1);
          res.status(200).json({
            status: "success",
            message: "User logged in successfully.",
            token: response.idToken,
            uid: u1.uid,
            Subscription: u1.Subscription,
          });
        }
      });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ message: "Cannot signup at this moment.", error: error });
  }
};

const registerFromNEXTJS=async (req,res)=>{
    //CREATE A USER DATABASE AND STORE THE USER DETAILS AND TOKEN
    try {
      console.log("registerFromNEXTJS");
      // console.log(response);
      const newUser = {
        _id: new ObjectId(),
        uid: "NEXTJS",
        Name: req.body.name,
        Email: req.body.email,
        Subscription: "None",
      };
      const result = await mongoUtil
        .getDB()
        .collection("User")
        .insertOne(newUser);

      console.log("nextjs inserted",result.insertedId);
      const newProfile = {
        _id: new ObjectId(),
        uid: result.insertedId,
        Profile_name: req.body.name,
      };
      const added_profile = await mongoUtil
        .getDB()
        .collection("Profile")
        .insertOne(newProfile);
        //CREATE A DEFAULT PROFILE
        res.status(200).json({
          status: "success",
          message: "User logged in successfully.",
          Subscription: newUser.Subscription,
        });
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .json({ message: "Cannot Create Data.", error: error });
  }
}

module.exports = { signupWithEmailAndPassword, signinWithEmailAndPassword,registerFromNEXTJS };
