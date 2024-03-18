const { admin } = require("../utils/firebaseAdminUtil");

const isAuthenticated = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({ "error": "Unauthorized", "message": "Provide authorization headers" });
    }
    const token = authToken.split(' ')[1];
    // console.log(token);
    admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            console.log(decodedToken)
            req.user = decodedToken.uid;
            next();
        })
        .catch((error) => {
            console.log(error);
            res.status(401).json({ "error": "Unauthorized" });
        });
};

module.exports = { isAuthenticated }