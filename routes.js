const express = require('express');
const { getSimilarMovies,getMovies} = require('./controllers/moviesController');
const { autoComplete, getSemanticSearch } = require('./controllers/searchController');
const { isAuthenticated } = require('./middleware/isAuthenticated');
const { getUsers, getUserById, updateUser, createUser, deleteUser, addMovieToWatchlist, removeMovieFromWatchlist, login, googleLogin, logout, signup, createOrder, verifyOrder,onSubscribe,addHistoryProfile,getHomeData,addWatchlistToProfile, getMovieVideoById } = require('./controllers/userController');
const { publishMessage } = require('./controllers/redisController');
const { getHome,getRandom, getSection } = require('./controllers/homeController');
const { signupWithEmailAndPassword, signinWithEmailAndPassword } = require('./controllers/firebaseAuthController');

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
router.get("/random" ,getRandom);
router.get("/section/:name", getSection);
router.get("/movie/:id", getMovies);
router.get("/search", autoComplete);
router.get("/search/semantic", getSemanticSearch);
router.get("/movie/similar/:id", getSimilarMovies);
// router.post("/moresearch", getMoreResults);

// USER ROUTES
router.get("/getalluser", getUsers);
router.get("/getuser:id", getUserById);
router.post("/updateuser", updateUser);
router.post("/createuser", createUser);
router.delete("/deleteuser:id", deleteUser);
router.post("/addmovie:id", addMovieToWatchlist);
router.post("/removemovie:id", removeMovieFromWatchlist);
router.get("/favourites",/* my list of users*/);

// router.post("/publish", publishMessage);
// router.post("/login", login);
// router.post("/signup", signup);
router.post("/signup", signupWithEmailAndPassword);
router.post("/signin", signinWithEmailAndPassword);

router.get("/logout", logout);
router.get("/googlelogin", googleLogin);
router.post("/addwatchlist", addWatchlistToProfile);
router.get("/homedata", getHomeData);
router.post("/addhistory", addHistoryProfile);
router.get("/getmovievideo", getMovieVideoById);
// PAYMENT ROUTES
router.post("/payment/createOrder", createOrder);
router.post("/payment/verifyOrder", verifyOrder);
router.post("/subscribe",onSubscribe)

router.get("/private", isAuthenticated, (req, res) => {
    res.json(req.user);
})
module.exports = router;