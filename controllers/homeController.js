const { ObjectId } = require("mongodb");
const mongoUtil = require("../utils/mongoUtil");
const {insertPreviewLink} = require("../utils/movieLinkUtil");

async function getMovieSection(section) {
    console.log(section);
    const movieDB = mongoUtil.getDB().collection("embedded_movies");
    const pipeline = [
      {
        '$sample': {
          'size': 8
        }
      }, {
        '$project': {
          '_id': 1,
          'title': 1,
          'plot': 1,
          'genres':1,
            'poster':1,
            'languages':1,
            'imdb':1,
            'year':1,
          'directors': 1,
          'cast': 1,
          'runtime': 1,
          'fullplot': 1,
        }
      }
    ];
    const result = await movieDB.aggregate(pipeline).toArray();
    insertPreviewLink(result);
    return result;
}

const getSection = async (req, res) => {
  const section = req.params.name;
  const movies = await getMovieSection(section);
  res.status(200).json(movies);
}

const getHome = async (req, res) => {
  const sections = ["Trending", "Top Rated", "Action", "Romance", "Comedy"];
  res.status(200).json(sections);
}

const getRandom = async (req, res) => {

  const movieDB = mongoUtil.getDB().collection("embedded_movies");
  const pipeline = [
    {
      '$sample': {
        'size': 1
      }
    }, {
      '$project': {
        '_id': 1,
        'title': 1,
        'plot': 1,
        'genres':1,
          'poster':1,
          'languages':1,
          'imdb':1,
          'year':1,
        'directors': 1,
        'cast': 1,
        'runtime': 1,
        'fullplot': 1,
      }
    }
  ];
  const result = await movieDB.aggregate(pipeline).toArray();
  insertPreviewLink(result);
  res.status(200).json(result);
}


/*
  {
    "_id": "6603437b952f9a35d3c999d7",
    "uid": "6603437b952f9a35d3c999d6",
    "Profile_name": "Dev"
  },

*/

//Getting all home page data
const getHomeData = async (req, res) => {
  try {
    const profile = req.body.profileId;
    console.log(
      "====================================================================",
      profile
    );
    const results=await Promise.all([
      getWatchlistOfProfile(profile),
      getProfileHistory(profile),
      getLatestMovie(),
      getBestMovies(),
      getBestMovieByTomato(),
      getBestEnglishMovie(),
      getBestHindiMovie(),
    ]);
      const result = results[0];
      const result2 = results[1];
      const result3 =  results[2];
      const result4 =  results[3];
      const result5 =  results[4];
      const result6 =  results[5];
      const result7 =  results[6];
      //GET _id of first movie of history
    if (result2.length != 0) {
      const movie_id = result2[0]._id;
      const movie_name = result2[0].title;
      //Get similar movies
      const similar_movies = await getSimilarMovies(movie_id);
      res.status(200).json({
        watchlist: result,
        history: result2,
        similar_movie: { [movie_name]: similar_movies },
        latest_movie: result3,
        best_imdb_movie: result4,
        best_tomato_movie: result5,
        best_english_movie: result6,
        best_hindi_movie: result7,
      });
    }
    else{
      //ADD MOVIE_NAME AS KEY TO SIMILAR MOVIES
      res.status(200).json({
        latest_movie: result3,
        best_imdb_movie: result4,
        best_tomato_movie: result5,
        best_english_movie: result6,
        best_hindi_movie: result7,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getHome,getRandom, getSection, getHomeData }