const { ObjectId } = require("mongodb");
const mongoUtil = require("../utils/mongoUtil");
const { insertPreviewLink } = require("../utils/movieLinkUtil");
const { getWatchlistOfProfile } = require("./userController");
// const { checkMovie, getMovie, storeMovie } = require("./redisController");

const getMovies = async (req, res) => {
  const { id } = req.params;
  const _id = ObjectId.createFromHexString(id);
  const movies = mongoUtil.getDB().collection("movies");
  const movieDetails = await movies.find(_id).toArray();
  insertPreviewLink(movieDetails);
  res.status(200).json({ data: movieDetails });
}

const getSimilarMovies = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const _id = ObjectId.createFromHexString(id);
  const movieDB = mongoUtil.getDB().collection("movies");
  const embed_movieDB = mongoUtil.getDB().collection("embedded_movies");
  const movie_plot = await movieDB.find({ _id }).project({ "fullplot": 1, "_id": 0 }).toArray();
  console.log(movie_plot);
  const body = {
    input: movie_plot[0].fullplot,
    model: "text-embedding-ada-002",
  };
  try {
    await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPEN_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .then(async (response) => {
        // console.log(response);
        const embeddings = response.data[0].embedding;
        // console.log(embeddings);

        const pipeline = [
          {
            '$vectorSearch': {
              'index': 'vector_inde',
              'path': 'plot_embedding',
              'queryVector': embeddings,
              'numCandidates': 150,
              'limit': 10
            }
          }, {
            '$project': {
              '_id': 1,
              'plot': 1,
              'title': 1,
              'score': {
                '$meta': 'vectorSearchScore'
              },
              'genres': 1,
              'poster': 1,
              'languages': 1,
              'imdb': 1,
              'year': 1,
              'directors': 1,
              'cast': 1,
              'runtime': 1,
              'fullplot': 1,
            }
          }
        ];
        const result = await embed_movieDB.aggregate(pipeline).toArray();
        console.log(result);
        const string_id = _id.toString();
        // remove the movie with the same id
        const filteredResult = result.filter((movie) => {
          return movie._id.toString() !== string_id;
        });
        insertPreviewLink(filteredResult);
        res.status(200).json(filteredResult);
      })
  } catch (error) {
    console.log(error);
  }
}

const getSimilarMoviesForApp = async (_id) => {
  const movieDB = mongoUtil.getDB().collection("movies");
  const embed_movieDB = mongoUtil.getDB().collection("embedded_movies");
  const movie_plot = await movieDB.find({ _id }).project({ "fullplot": 1, "_id": 0 }).toArray();
  console.log(movie_plot);
  const body = {
    input: movie_plot[0].fullplot,
    model: "text-embedding-ada-002",
  };
  try {
    const data = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPEN_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .then(async (response) => {
        // console.log(response);
        const embeddings = response.data[0].embedding;
        // console.log(embeddings);

        const pipeline = [
          {
            '$vectorSearch': {
              'index': 'vector_inde',
              'path': 'plot_embedding',
              'queryVector': embeddings,
              'numCandidates': 150,
              'limit': 10
            }
          }, {
            '$project': {
              '_id': 1,
              'plot': 1,
              'title': 1,
              'score': {
                '$meta': 'vectorSearchScore'
              },
              'genres': 1,
              'poster': 1,
              'languages': 1,
              'imdb': 1,
              'year': 1,
              'directors': 1,
              'cast': 1,
              'runtime': 1,
              'fullplot': 1,
            }
          }
        ];
        const result = await embed_movieDB.aggregate(pipeline).toArray();
        console.log(result);
        const string_id = _id.toString();
        // remove the movie with the same id
        const filteredResult = result.filter((movie) => {
          return movie._id.toString() !== string_id;
        });
        return filteredResult;
      })
      return data;
  } catch (error) {
    console.log(error);
  }
}

//ADD MOVIE TO USER'S WATCHLIST
const addMovieToWatchlist = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const userId = req.params.id;
    const movie = req.body.movie;
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { watchlist: movie } }
    );
    if (result.matchedCount) {
      res
        .status(200)
        .json({ message: "Movie added to watchlist successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//REMOVE MOVIE FROM USER'S WATCHLIST
const removeMovieFromWatchlist = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const userId = req.params.id;
    const movie = req.body.movie;
    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { watchlist: movie } }
    );
    if (result.matchedCount) {
      res
        .status(200)
        .json({ message: "Movie removed from watchlist successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//Get the Latest Movie by year attribute
const getLatestMovie = async () => {
  try {
    const movie = mongoUtil.getDB().collection("embedded_movies");
    const result = await movie.find().sort({ year: -1 }).limit(15).toArray();
    const movieDetailsFiltered = result.map((movie) => {
      return {
        _id: movie._id,
        title: movie.title,
        plot: movie.plot,
        genres: movie.genres,
        poster: movie.poster,
        languages: movie.languages,
        imdb: movie.imdb,
        year: movie.year,
        directors: movie.directors,
        runtime: movie.runtime,
        fullplot: movie.fullplot,
        cast: movie.cast,
      };
    });
    return movieDetailsFiltered;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//Get best movies by imdb rating
const getBestMovies = async () => {
  try {
    const movie = mongoUtil.getDB().collection("embedded_movies");
    const result = await movie
      .find()
      .sort({ "imdb.rating": -1 })
      .limit(15)
      .toArray();
    const movieDetailsFiltered = result.map((movie) => {
      return {
        _id: movie._id,
        title: movie.title,
        plot: movie.plot,
        genres: movie.genres,
        poster: movie.poster,
        languages: movie.languages,
        imdb: movie.imdb,
        year: movie.year,
        directors: movie.directors,
        runtime: movie.runtime,
        fullplot: movie.fullplot,
        cast: movie.cast,
      };
    });
    return movieDetailsFiltered;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//BEST ENGLISH MOVIE BY IMDB RATING
const getBestEnglishMovie = async () => {
  try {
    const movie = mongoUtil.getDB().collection("embedded_movies");
    const result = await movie
      .find({ languages: "English" })
      .sort({ "imdb.rating": -1 })
      .limit(15)
      .toArray();
    const movieDetailsFiltered = result.map((movie) => {
      return {
        _id: movie._id,
        title: movie.title,
        plot: movie.plot,
        genres: movie.genres,
        poster: movie.poster,
        languages: movie.languages,
        imdb: movie.imdb,
        year: movie.year,
        directors: movie.directors,
        runtime: movie.runtime,
        fullplot: movie.fullplot,
        cast: movie.cast,
      };
    });
    return movieDetailsFiltered;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//BEST HINDI MOVIE BY IMDB RATING
const getBestHindiMovie = async () => {
  try {
    const movie = mongoUtil.getDB().collection("embedded_movies");
    const result = await movie
      .find({ languages: "Hindi" })
      .sort({ "imdb.rating": -1 })
      .limit(15)
      .toArray();
    const movieDetailsFiltered = result.map((movie) => {
      return {
        _id: movie._id,
        title: movie.title,
        plot: movie.plot,
        genres: movie.genres,
        poster: movie.poster,
        languages: movie.languages,
        imdb: movie.imdb,
        year: movie.year,
        directors: movie.directors,
        runtime: movie.runtime,
        fullplot: movie.fullplot,
        cast: movie.cast,
      };
    });
    return movieDetailsFiltered;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
//BEST TOMATO MOVIE
const getBestMovieByTomato = async () => {
  try {
    const movie = mongoUtil.getDB().collection("embedded_movies");
    const result = await movie
      .find()
      .sort({ "tomatoes.critic.rating": -1 })
      .limit(15)
      .toArray();
    const movieDetailsFiltered = result.map((movie) => {
      return {
        _id: movie._id,
        title: movie.title,
        plot: movie.plot,
        genres: movie.genres,
        poster: movie.poster,
        languages: movie.languages,
        imdb: movie.imdb,
        year: movie.year,
        directors: movie.directors,
        runtime: movie.runtime,
        fullplot: movie.fullplot,
        cast: movie.cast,
      };
    });
    return movieDetailsFiltered;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMoviesByGenres = async (genres) => {
  const movieDB = mongoUtil.getDB().collection("movies");
  const result = {};
  await Promise.all(
    genres.map(async (genre) => {
      const data = await movieDB
        .aggregate([
          {
            $search: {
              index: "default",
              text: {
                query: `${genre}`,
                path: "genres",
              },
            },
          },
          {
            $project: {
              _id: 1,
              plot: 1,
              title: 1,
              score: {
                $meta: "searchScore",
              },
              genres: 1,
              poster: 1,
              languages: 1,
              imdb: 1,
              year: 1,
              directors: 1,
              cast: 1,
              runtime: 1,
              fullplot: 1,
            },
          },
          { $sort: { score: -1 } },
          { $limit: 1 },
        ])
        .toArray();
      result[genre] = data;
    })
  );
  console.log(result);
  return result;
};

const getMovieVideoById = async (req, res) => {
  movie_video_urls_list = {
    1: {
      previewLink:
        "https://dge8ab9n7stt8.cloudfront.net/Oppenheimer/Oppenheimer_preview.mp4",
      premiumLink:
        "https://dge8ab9n7stt8.cloudfront.net/Oppenheimer/Oppenheimer _1080p.m3u8",
      standardLink:
        "https://dge8ab9n7stt8.cloudfront.net/Oppenheimer/Oppenheimer _720p.m3u8",
      basicLink:
        "https://dge8ab9n7stt8.cloudfront.net/Oppenheimer/Oppenheimer _540p.m3u8",
    },
    2: {
      previewLink:
        "https://dge8ab9n7stt8.cloudfront.net/BigBuckBunny/BigBuckBunny_preview.mp4",
      premiumLink:
        "https://dge8ab9n7stt8.cloudfront.net/BigBuckBunny/BigBuckBunny1080p.m3u8",
      standardLink:
        "https://dge8ab9n7stt8.cloudfront.net/BigBuckBunny/BigBuckBunny720p.m3u8",
      basicLink:
        "https://dge8ab9n7stt8.cloudfront.net/BigBuckBunny/BigBuckBunny540p.m3u8",
    },
    3: {
      previewLink:
        "https://dge8ab9n7stt8.cloudfront.net/Video/preview_Road_House.mp4",
      premiumLink:
        "https://dge8ab9n7stt8.cloudfront.net/Video/sample_1080p.m3u8",
      standardLink:
        "https://dge8ab9n7stt8.cloudfront.net/Video/sample_720p.m3u8",
      basicLink: "https://dge8ab9n7stt8.cloudfront.net/Video/sample_540p.m3u8",
    },
  };
  try {
    var movie_id = req.body.movie_id;
    const sub = req.body.video_type;
    movie_id = hexToDecimalUsingMap(movie_id);
    const movie = movie_video_urls_list[movie_id][sub];
    res.status(200).json({ movie: movie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getFavoriteMovies = async (req, res) => {
  try {
    console.log("fav" ,res.user);
    const profile = req.body.profileId;
    console.log(req);
    const result = await getWatchlistOfProfile(profile);
    res.status(200).json(result);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getSimilarMovies, getMovies, getSimilarMoviesForApp, addMovieToWatchlist, removeMovieFromWatchlist, getLatestMovie, getBestEnglishMovie, getBestMovieByTomato, getBestMovies, getBestHindiMovie, getMoviesByGenres, getMovieVideoById, getFavoriteMovies }