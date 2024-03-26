const express = require('express');
const { getSimilarMovies} = require('./controllers/moviesController');
const { autoComplete, getSemanticSearch } = require('./controllers/searchController');
const { isAuthenticated } = require('./middleware/isAuthenticated');
const { getUsers, getUserById, updateUser, createUser, deleteUser, addMovieToWatchlist, removeMovieFromWatchlist, login, googleLogin, logout, signup, createOrder, verifyOrder,addHistoryProfile,getProfileHistory,addWatchlistToProfile,getWatchlistOfProfile } = require('./controllers/userController');
const { publishMessage } = require('./controllers/redisController');
const { getHome } = require('./controllers/homeController');

const router = express.Router();

//-------------------------------------------------
router.get("/", async (req, res) => {
    res.status(200).json({ "message": "Hello, this message means you have your server up and listening. GET, SET, GO!!" })
})
router.post("/", async (req, res) => {
    console.log(req.body);
    res.status(200).json({ "message": "This is the body you sent.", "body": req.body })
})
//------------------------------------------------

router.get("/home" ,getHome);
// router.get("/movie/:id", getMovies);
router.get("/search", autoComplete);
router.post("/search/semantic", getSemanticSearch);
// router.get("/movie/similar/:id", getSimilarMovies);

// USER ROUTES
router.get("/getalluser", getUsers);
router.get("/getuser:id", getUserById);
router.post("/updateuser", updateUser);
router.post("/createuser", createUser);
router.delete("/deleteuser:id", deleteUser);
router.post("/addmovie:id", addMovieToWatchlist);
router.post("/removie:id", removeMovieFromWatchlist);
// router.post("/publish", publishMessage);
router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);
router.get("/googlelogin", googleLogin);
router.get("/getprofilehistory", getProfileHistory);
router.post("/addwatchlist", addWatchlistToProfile);
router.get("/getwatchlist", getWatchlistOfProfile);
router.post("/addhistory", addHistoryProfile);
// PAYMENT ROUTES
router.post("/payment/createOrder", createOrder);
router.post("/payment/verifyOrder", verifyOrder);

router.get("/private", isAuthenticated, (req, res) => {
    res.json(req.user);
})
module.exports = router;