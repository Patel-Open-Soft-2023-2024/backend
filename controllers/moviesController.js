const { ObjectId } = require("mongodb");
const mongoUtil = require("../utils/mongoUtil");
const {storeMovie, getMovie , checkMovie}=require('./store')

const getMovies = async (req, res) => {
    const { id } = req.params;
    const _id = ObjectId.createFromHexString(id);
    console.log(id);
    const result = await checkMovie(id);
    if (result) {
        console.log("From Cache");
        const result2 = await getMovie(id);
        res.status(200).json({ data: result2 });
    }
    else {
        const movies = mongoUtil.getDB().collection("movies");
        const movieDetails = await movies.find(_id).toArray();
        await storeMovie(id, movieDetails);
        console.log("From DB");
        res.status(200).json({ data: movieDetails });
    }
}

const getSimilarMovies = async (req, res) => {
    const { id } = req.params; 
    const _id = ObjectId.createFromHexString(id);
    const movieDB = mongoUtil.getDB().collection("embedded_movies");
    const vector_embeddings = await movieDB.find({_id}).project({"plot_embedding":1, "_id":0}).toArray();
    console.log(vector_embeddings[0].plot_embedding)
    
    const pipeline = [
        {
          '$vectorSearch': {
            'index': 'vector_inde', 
            'path': 'plot_embedding', 
            'queryVector': vector_embeddings[0].plot_embedding,
            'numCandidates': 150, 
            'limit': 10
          }
        }, {
          '$project': {
            '_id': 0, 
            'plot': 1, 
            'title': 1, 
            'score': {
              '$meta': 'vectorSearchScore'
            }
          }
        }
      ];

      const result = await movieDB.aggregate(pipeline).toArray();
      console.log(result);
      res.status(200).json(result)
}

module.exports = { getMovies, getSimilarMovies }