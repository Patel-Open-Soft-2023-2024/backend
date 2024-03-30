const { getUserById,getUserByEmail } = require("../controllers/userController");
const { admin } = require("../utils/firebaseUtil");
const mongoUtil = require("../utils/mongoUtil");
const { ObjectId } = require("mongodb");


const isAuthenticated = async (req, res, next) => {
    console.log("isAuthenticated",req.body);
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ "error": "Unauthorized", "message": "Provide authorization headers" });
    }
    const token = authToken.split(' ')[1];

    if(token.startsWith('NEXTJS')){
        //get email from request
        const email = req.body.email;
        console.log("NXTJS",{email});
        if(!email){
            return res.status(401).json({ "error": "Unauthorized", "message": "Provide email in body" });
        }
        const user=await mongoUtil.getDB().collection("User").findOne({ Email: email });
        req.user=user;
        console.log("NextJS found use:", user, req.user)
        next();
        return;
    }
    admin
        .auth()
        .verifyIdToken(token)
        .then(async(decodedToken) => {
            console.log(decodedToken)
            req.uid = decodedToken.uid;
            const user=await mongoUtil.getDB().collection("users").findOne({ email });
            res.user=user;
            next();
        })
        .catch((error) => {
            console.log(error);
            res.status(401).json({ "error": "Unauthorized" });
        });
};
module.exports = { isAuthenticated };