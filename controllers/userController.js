const mongoUtil = require("../utils/mongoUtil");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { auth } = require("../utils/firebaseUtil.js");
const Razorpay = require("razorpay");
const {
  validatePaymentVerification,
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils.js");

// razorpay credentials

// TODO - uncomment after hosting
// const key_id = process.env.KEY_ID;
// const key_secret = process.env.KEY_SECRET;

const key_id = "rzp_test_J03FGVGxMcgSmP";
const key_secret = "0fTBPksPGbrj7nWh8WSr";

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const createUser = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const newUser = req.body;
    newUser._id = new ObjectId();
    const result = await users.insertOne(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("Profile");
    const result = await users.find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const userId = req.params.id;
    // console.log(userId);
    const result = await users.findOne({ _id: new ObjectId(userId) });
    // console.log(result);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const updatedUser = req.body;
    updatedUser._id = new ObjectId(updatedUser._id);
    // HERE ADD NEW PARAMETER TO USER/ UPDATE A SINGLE PARAMETER OF USER
    const result = await users.updateOne(
      { _id: new ObjectId(updatedUser._id) },
      { $set: updatedUser }
    );
    if (result.matchedCount) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const users = mongoUtil.getDB().collection("users");
    const userId = req.params.id;
    const result = await users.findOneAndDelete({ _id: new ObjectId(userId) });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

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

function generateUniqueString() {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substr(2);
  return timestamp + randomSuffix;
}

// payment functions
const createOrder = async (req, res) => {
  // creating a razorpay instance
  const razorpay = new Razorpay({ key_id, key_secret });

  // create random
  const receipt_id = generateUniqueString();

  // setting up options for razorpay order
  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: `receipt-${receipt_id}`,
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    res.status(400).send("Not able to create order. Please try again!");
  }
};

const verifyOrder = (req, res) => {
  // do a validation
  const paymentValidation = validatePaymentVerification(
    { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
    signature,
    secret
  );

  if (razorpay_signature === generated_signature) {
    res.json({ success: true, message: "Payment has been verified" });
  } else {
    res.json({ success: false, message: "Payment verification failed" });
  }
};

// stripe payment (2)

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "Rs 59",
    priceInPaise: 59 * 100,
    benefits: ["Standard Definition (SD)", "1 screen"],
  },
  {
    id: "standard",
    name: "Standard",
    price: "Rs 199",
    priceInPaise: 199 * 100,
    benefits: ["High Definition (HD)", "2 screens"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "Rs 349",
    priceInPaise: 349 * 100,
    benefits: ["Ultra High Definition (UHD)", "4 screens"],
  },
];

// use 4000003560000008 as card number for testing
const onSubscribe = async (req, res) => {
  try {
    const planID = req.query.plan;
    //find match of plan with id in plans
    const planMatch = plans.find((plan) => plan.id === planID);
    if (!planMatch) throw Error("plan not found");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: planMatch.id,
            },
            unit_amount: planMatch.priceInPaise,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//FOR PROFILE HISTORY
const addHistoryProfile = async (req, res) => {
  try {
    const profile = mongoUtil.getDB().collection("History");
    const profileId = req.body.profile;
    const movieId = req.body.movie;
    const result = await profile.insertOne({
      _id: new ObjectId(),
      Profile_id: profileId,
      Movie_id: movieId,
    });
    res.status(200).json({ message: "History added to profile successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get Profile History
const getProfileHistory = async (profileId) => {
  try {
    const history = mongoUtil.getDB().collection("History");
    const result = await history.find({ Profile_id: profileId }).toArray();
    if (result) {
      //RETURNING THE MOVIE DETAIL FROM MOVIE COLLECTION
      const movie = mongoUtil.getDB().collection("embedded_movies");
      // Get all the movie ids from the result and then get the movie details from the movie collection
      const movieIds = result.map((item) => new ObjectId(item.Movie_id));
      const movieDetails = await movie
        .find({ _id: { $in: movieIds } })
        .toArray();
      const movieDetailsFiltered = movieDetails.map((movie) => {
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
        };
      });
      return movieDetailsFiltered;
    } else {
      return None;
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

// ADDING WATCHLIST TO PROFILE
const addWatchlistToProfile = async (req, res) => {
  try {
    const profile = mongoUtil.getDB().collection("Watch_list");
    const profileId = req.body.profile;
    const movieId = req.body.movie;
    const result = await profile.insertOne({
      _id: new ObjectId(),
      Profile_id: profileId,
      Movie_id: movieId,
    });
    res
      .status(200)
      .json({ message: "Watchlist added to profile successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GETTING WATCHLIST OF PROFILE
const getWatchlistOfProfile = async (profileId) => {
  try {
    const profile = mongoUtil.getDB().collection("Watch_list");
    const result = await profile.find({ Profile_id: profileId }).toArray();
    if (result) {
      const movie = mongoUtil.getDB().collection("embedded_movies");
      // Get all the movie ids from the result and then get the movie details from the movie collection
      const movieIds = result.map((item) => new ObjectId(item.Movie_id));
      const movieDetails = await movie
        .find({ _id: { $in: movieIds } })
        .toArray();
      const movieDetailsFiltered = movieDetails.map((movie) => {
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
        };
      });
      return movieDetailsFiltered;
    } else {
      return None;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSimilarMovies = async (movie_id) => {
  const _id = movie_id;
  const movieDB = mongoUtil.getDB().collection("embedded_movies");
  const vector_embeddings = await movieDB
    .find({ _id })
    .project({ plot_embedding: 1, _id: 0 })
    .toArray();
  // console.log(vector_embeddings)

  const pipeline = [
    {
      $vectorSearch: {
        index: "vector_inde",
        path: "plot_embedding",
        queryVector: vector_embeddings[0].plot_embedding,
        numCandidates: 150,
        limit: 10,
      },
    },
    {
      $project: {
        _id: 0,
        plot: 1,
        title: 1,
        score: {
          $meta: "vectorSearchScore",
        },
        genres: 1,
        poster: 1,
        languages: 1,
        imdb: 1,
        year: 1,
        directors: 1,
      },
    },
  ];

  const result = await movieDB.aggregate(pipeline).toArray();
  return result;
};

//GET

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
    const profile = await req.body.profileId;
    console.log(
      "====================================================================",
      profile
    );
    const result = await getWatchlistOfProfile(profile);
    const result2 = await getProfileHistory(profile);
    const result3 = await getLatestMovie();
    const result4 = await getBestMovies();
    const result5 = await getBestMovieByTomato();
    const result6 = await getBestEnglishMovie();
    const result7 = await getBestHindiMovie();
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
    //ADD MOVIE_NAME AS KEY TO SIMILAR MOVIES
    res.status(200).json({
      latest_movie: result3,
      best_imdb_movie: result4,
      best_tomato_movie: result5,
      best_english_movie: result6,
      best_hindi_movie: result7,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function hexToDecimalUsingMap(hexString) {
  const hexCharacters = "0123456789ABCDEF";
  let decimal = 0;
  hexString
    .toUpperCase()
    .split("")
    .forEach((char, index) => {
      const value = hexCharacters.indexOf(char);
      if (value === -1) {
        throw new Error("Invalid hexadecimal character found");
      }
      decimal += value;
      decimal = decimal % 3;
    });

  return decimal;
}

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

//get profile of a user
const getAllProfileofaUser = async (req, res) => {
  try {
    const idToken = req.body.uid;
    console.log(idToken);
    const user = mongoUtil.getDB().collection("User");
    const r1 = await user.find({ uid: idToken }).toArray();
    const u_id = r1[0]._id;
    const profile = mongoUtil.getDB().collection("Profile");
    const r2 = await profile.find({ uid: u_id }).toArray();
    res.status(200).json(r2);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createProfile = async (req, res) => {
  try {
    const idToken = req.body.uid;
    const pname = req.body.pname;
    const user = mongoUtil.getDB().collection("User");
    const r1 = await user.find({ uid: idToken }).toArray();
    const u_id = r1[0]._id;
    const newProfile = { _id: new ObjectId(), uid: u_id, Profile_name: pname };
    const default_profile = await mongoUtil
      .getDB()
      .collection("Profile")
      .insertOne(newProfile);
    const profile = mongoUtil.getDB().collection("Profile");
    const r2 = await profile.find({ uid: u_id }).toArray();
    res.status(200).json(r2);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//EXPORTING ALL FUNCTIONS
module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  createOrder,
  verifyOrder,
  onSubscribe,
  addHistoryProfile,
  getHomeData,
  addWatchlistToProfile,
  getMovieVideoById,
  getAllProfileofaUser,
  createProfile,
};
