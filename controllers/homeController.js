const { ObjectId } = require("mongodb");
const mongoUtil = require("../utils/mongoUtil");
const {insertPreviewLink} = require("../utils/movieLinkUtil");
const { getWatchlistOfProfile, getProfileHistory } = require("./userController");
const { getLatestMovie, getBestMovies, getBestMovieByTomato, getBestEnglishMovie, getBestHindiMovie, getSimilarMovies, getSimilarMoviesForApp } = require("./moviesController");

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


//Getting all home page data
const getHomeDataForApp = async (req, res) => {
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
      const similar_movies = await getSimilarMoviesForApp(movie_id);
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


const getMoviesBasedOnGenre = async (genre) => {
  const genresPipeline = [
    {
      $search: {
        index: "default",
        compound: {
          should: [
            {
              equals: {
                path: "genres",
                value: `${genre}`,
                score: { boost: { value: 5 } },
              },
            },
            {
              phrase: {
                query: `${genre}`,
                path: "genres",
                score: { boost: { value: 5 } },
              },
            },
            {
              text: {
                query: `${genre}`,
                path: "generes",
                fuzzy: {
                  maxEdits: 2,
                },
              },
            },
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        poster: 1,
        languages: 1,
        imdb: 1,
        year: 1,
        genres: 1,
        plot: 1,
        directors: 1,
        cast: 1,
        runtime: 1,
        fullplot: 1,
        score: { $meta: "searchScore" },
      },
    },
    { $sort: { score: -1 } },
    {
      $limit: 20,
    },
  ];
  const movies = mongoUtil.getDB().collection("movies");
  return movies.aggregate(genresPipeline).toArray();
}




const getHome = async (req, res) => {
  const sections = ["Top Rated", "Romance", "Comedy", "Action"];
  if(!req.query.profileId){
    res.status(200).json(sections);
    return;
  }

  const profile = req.query.profileId;
  const hist = await getProfileHistory(profile);

  console.log("Calls /Home, profile", profile, "History len: ", hist.length)

  if(hist.length == 0){
    res.status(200).json(sections);
    return;
  }

  
  
  if(hist[0].genres.length > 0){
    const recommended_genre = hist[0].genres[0];
    if(recommended_genre=="Comedy"){
      sections[1] = "Comedy";
      sections[2] = "Romance";
    }
    else if(recommended_genre!="Romance"){
      sections.splice(1, 0, recommended_genre);
      sections.pop();
    }

  }
  
  const movie_id = hist[0]._id;
  const movie_name = hist[0].title;
  sections.push("#Similar to " + movie_name + " #id: "+movie_id);
  


  res.status(200).json(sections);
}


const getSection = async (req, res) => {
  const section = req.params.name;
  console.log("GET /section/"+ section);
  var movies;
  if(section == "Top Rated"){
    movies = await getBestMovies();
  }
  else if(section.startsWith("SimilarTo")){
    const movie_id =  section.substring("SimilarTo".length);
    console.log("For similar movies in /section: ", movie_id);
    const _id = ObjectId.createFromHexString(movie_id);
    movies = await getSimilarMoviesForApp(_id);
  }
  else{
    // Genre based
    movies = await getMoviesBasedOnGenre(section);
  }
  insertPreviewLink(movies);
  res.status(200).json(movies);
}

module.exports = { getHome,getRandom, getSection, getHomeData, getHomeDataForApp }