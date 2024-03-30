const express = require("express");
const { getHome, getRandom, getSection, getHomeData, getHomeDataForApp } = require("./controllers/homeController");
const { getMovies, getSimilarMovies, addMovieToWatchlist, removeMovieFromWatchlist, getFavoriteMovies, getMovieVideoById } = require("./controllers/moviesController");
const { autoComplete, getSemanticSearch } = require("./controllers/searchController");
const { getUsers, getUserById, updateUser, createUser, deleteUser, addWatchlistToProfile, addHistoryProfile, getAllProfileofaUser, createProfile, onSubscribe } = require("./controllers/userController");
const { signupWithEmailAndPassword, signinWithEmailAndPassword } = require("./controllers/firebaseAuthController");
const { getLink } = require("./utils/movieLinkUtil");
const { redeemSubscription } = require("./controllers/paymentController");
const { isAuthenticated } = require("./middleware/isAuthenticated");

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

router.get("/home", getHome);
router.get("/random", getRandom);
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
router.get("/favourites", isAuthenticated,getFavoriteMovies);
router.post("/getmylist", getFavoriteMovies);
// router.post("/publish", publishMessage);
// router.post("/login", login);
// router.post("/signup", signup);
router.post("/signup", signupWithEmailAndPassword);
router.post("/login", signinWithEmailAndPassword);

router.post("/addwatchlist", addWatchlistToProfile);
router.post("/homedata", getHomeData);
router.post("/homedataforapp", getHomeDataForApp);
router.post("/addhistory", addHistoryProfile);
router.get("/getmovievideo", getMovieVideoById);
router.post("/getallprofile", getAllProfileofaUser);
router.post("/createprofile", createProfile);
// PAYMENT ROUTES
// router.post("/payment/createOrder", createOrder);
// router.post("/payment/verifyOrder", verifyOrder);
router.post("/subscribe", onSubscribe);

//MOVIE LINK
router.post("/getlink", isAuthenticated,getLink);
router.post("/redeem", redeemSubscription);

router.get("/private", isAuthenticated, (req, res) => {
  res.json(req.user);
});

module.exports = router;