// const { admin } = require("../utils/firebaseUtil");

// const isAuthenticated = async (req, res, next) => {
//     const authToken = req.headers.authorization;
//     if (!authToken) {
//         return res.status(401).json({ "error": "Unauthorized", "message": "Provide authorization headers" });
//     }
//     const token = authToken.split(' ')[1];
//     // console.log(token);
//     admin
//         .auth()
//         .verifyIdToken(token)
//         .then((decodedToken) => {
//             console.log(decodedToken)
//             req.user = decodedToken.uid;
//             next();
//         })
//         .catch((error) => {
//             console.log(error);
//             res.status(401).json({ "error": "Unauthorized" });
//         });
// };

// module.exports = { isAuthenticated }

const { onAuthStateChanged } = require("firebase/auth")
const { auth } =  require('../utils/firebaseUtil.js')


function isAuthenticated(req,res,next){
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    req.user = uid;
    console.log(user);
    next();
  } else {
    // User is signed out
    // ...
    res.status(401).json({ "error": "Unauthorized" });
  }
});
}

module.exports =  { isAuthenticated };