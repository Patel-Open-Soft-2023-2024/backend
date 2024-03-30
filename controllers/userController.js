const mongoUtil = require("../utils/mongoUtil");
const { ObjectId } = require("mongodb");

// razorpay credentials

// TODO - uncomment after hosting
// const key_id = process.env.KEY_ID;
// const key_secret = process.env.KEY_SECRET;

const key_id = "rzp_test_J03FGVGxMcgSmP";
const key_secret = "0fTBPksPGbrj7nWh8WSr";


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
    const users = mongoUtil.getDB().collection("User");
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
    const result = await history.find({ Profile_id: profileId }, {$sort: {_id: -1}}).toArray();
    if (result) {
      //RETURNING THE MOVIE DETAIL FROM MOVIE COLLECTION
      const movie = mongoUtil.getDB().collection("movies");
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

// ADDING WATCHLIST TO PROFILE
const addWatchlistToProfile = async (req, res) => {
  try {
    const watchlist = mongoUtil.getDB().collection("Watch_list");
    console.log("---------------");
    console.log(req.body.profile);
    const profileId = req.body.profile;
    const movieId = req.body.movie;
    // const result = await profile.insertOne({
    //   _id: new ObjectId(),
    //   Profile_id: profileId,
    //   Movie_id: movieId,
    // });
    const result = await watchlist.updateOne(
      {
        Movie_id: movie_id,
        Profile_id: profileId,
      },
      {
        $set: {
          Movie_id: movie_id,
          Profile_id: profileId,
        }
      },
      {
        upsert: true
      }
    );
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

//get profile of a user
const getAllProfileofaUser = async (req, res) => {
  try {
    const idToken = req.body.uid;
    console.log(idToken);

    var u_id;
    if (!req.user) {
      const user = mongoUtil.getDB().collection("User");
      const r1 = await user.find({ uid: idToken }).toArray();
      u_id = r1[0]._id;
    }
    else {
      u_id = req.user._id;
    }
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


const getHistoryforProfile = async (req, res) => {  // input-> profile:
  const profile = req.query.profileId;
  if(!profile){
    res.status(400).json({ error: "Profile not provided" });
  }
  const result = await getProfileHistory(profile);
  res.status(200).json(result);
}



//EXPORTING ALL FUNCTIONS
module.exports = { getHistoryforProfile, createUser, getUsers, getUserById, updateUser, getWatchlistOfProfile, getProfileHistory, hexToDecimalUsingMap, deleteUser, addHistoryProfile, addWatchlistToProfile, getAllProfileofaUser, createProfile };
