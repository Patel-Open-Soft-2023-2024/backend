const express = require("express");
const { getHome, getRandom, getSection, getHomeData, getHomeDataForApp } = require("./controllers/homeController");
const { getFullVideoLink, getMovies, getSimilarMovies, addMovieToWatchlist, removeMovieFromWatchlist, getFavoriteMovies, getMovieVideoById } = require("./controllers/moviesController");
const { autoComplete, getSemanticSearch } = require("./controllers/searchController");
const { getHistoryforProfile, getUsers, getUserById, updateUser, createUser, deleteUser, addWatchlistToProfile, addHistoryProfile, getAllProfileofaUser, createProfile } = require("./controllers/userController");
const { signupWithEmailAndPassword, signinWithEmailAndPassword ,registerFromNEXTJS} = require("./controllers/firebaseAuthController");
const { onSubscribe, redeemSubscription } = require("./controllers/paymentController");
const { isAuthenticated, test } = require("./middleware/isAuthenticated");

// const { onSubscribe, redeemSubscription } = require('./controllers/paymentController');
const router = express.Router();

//-------------------------------------------------
router.get("/", async (req, res) => {
  res.status(200).json({
    message:
      "Hello, this message means you have your server up and listening. GET, SET, GO!!",
  });
});
router.post("/", async (req, res) => {
  console.log(req.body);
  res
    .status(200)
    .json({ message: "This is the body you sent.", body: req.body });
});
//------------------------------------------------

// SEARCH ROUTES
router.get("/search", autoComplete);
router.get("/search/semantic", getSemanticSearch);

router.get("/movie/:id", getMovies);
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
router.post("/getmylist", getFavoriteMovies);
// router.post("/publish", publishMessage);
// router.post("/login", login);
// router.post("/signup", signup);
router.post("/signup", signupWithEmailAndPassword);
router.post("/login", signinWithEmailAndPassword);

router.post("/homedataforapp", getHomeDataForApp);
router.post("/addhistory", addHistoryProfile);
router.get("/getmovievideo", getMovieVideoById);
router.post("/getallprofile", getAllProfileofaUser);
router.post("/createprofile", createProfile);


//        **** WEBSITE SPECIFIC ROUTES ****      //

// HOME PAGE
router.post("/homedata", getHomeData);
router.get("/home", getHome);
router.get("/random", getRandom);
router.get("/section/:name", getSection);

// PAYMENT ROUTES
router.post("/subscribe", isAuthenticated, onSubscribe);
router.post("/redeem", redeemSubscription);

// MOVIE LINK
router.post("/getlink", isAuthenticated, getFullVideoLink);
router.post('/register/nextjs',registerFromNEXTJS);

// WATCH LIST
router.post("/addwatchlist", addWatchlistToProfile);  // input-> profile: , movie: ,
router.post("/favourites/next", isAuthenticated,getFavoriteMovies);
router.post("/getallprofile/next",isAuthenticated, getAllProfileofaUser);

// HISTORY
router.get("/history", getHistoryforProfile);

router.get("/private", isAuthenticated, test);

module.exports = router;