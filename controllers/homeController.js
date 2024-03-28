const { ObjectId } = require("mongodb");
const mongoUtil = require("../utils/mongoUtil");
const {insertPreviewLink} = require("../utils/movieLinkUtil");

async function getMovieSection(section) {
    const movieDB = mongoUtil.getDB().collection("embedded_movies");
    const pipeline = [
      {
        '$sample': {
          'size': 5
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
            'directors':1
        }
      }
    ];
    const result = await movieDB.aggregate(pipeline).toArray();
    insertPreviewLink(result);
    return result;
}

const getHome = async (req, res) => {
  const sections = ["Trending", "Top Rated", "Action", "Romance", "Comedy"];
  var moviesJson = {};
  Promise.all(
    sections.map(async (section) => {
      moviesJson[section] = await getMovieSection(section);
    })
  ).then(() => {
    res.status(200).json(moviesJson);
  });
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
          'directors':1
      }
    }
  ];
  const result = await movieDB.aggregate(pipeline).toArray();
  insertPreviewLink(result);
  res.status(200).json(result);
}

module.exports = { getHome,getRandom }