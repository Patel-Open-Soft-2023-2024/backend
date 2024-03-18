const express = require('express');
const { getMovies, getSimilarMovies } = require('./controllers/moviesController');
const { autoComplete, getSemanticSearch } = require('./controllers/searchController');

const router = express.Router();

//-------------------------------------------------
router.get("/", async(req, res) => {
    res.status(200).json({"message": "Hello, this message means you have your server up and listening. GET, SET, GO!!"})
})
router.post("/", async(req, res)=>{
    console.log(req.body);
    res.status(200).json({"message": "This is the body you sent.", "body":req.body})
})
//------------------------------------------------

router.get("/movie/:id", getMovies);
router.get("/search", autoComplete);
router.post("/search/semantic", getSemanticSearch);
router.get("/movie/similar/:id", getSimilarMovies);

module.exports = router;