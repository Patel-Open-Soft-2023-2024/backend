const { admin } = require("../utils/firebaseUtil");

const isAuthenticated = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ "error": "Unauthorized", "message": "Provide authorization headers" });
    }
    const token = authToken.split(' ')[1];

    if(token.startsWith('NEXTJS')){
        //get email from request
        const email = req.body.email;
        if(!email){
            return res.status(401).json({ "error": "Unauthorized", "message": "Provide email in body" });
        }
        req.nextJS = email;
        return next();
    }
    admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            console.log(decodedToken)
            req.uid = decodedToken.uid;
            next();
        })
        .catch((error) => {
            console.log(error);
            res.status(401).json({ "error": "Unauthorized" });
        });
};

module.exports = { isAuthenticated };