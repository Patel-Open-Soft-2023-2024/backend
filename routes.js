const express = require('express');
const { getMovies } = require('./controllers/moviesController');
const { autoComplete2 } = require('./controllers/searchController');

const router = express.Router();

router.get("/movie/:id", getMovies);
router.get("/search", autoComplete2);

router.post("/", (req, res)=>{
    console.log(req.body);
    res.status(200).json(req.body)
})

module.exports = router;