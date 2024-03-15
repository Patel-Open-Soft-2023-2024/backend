const { ObjectId } = require("mongodb");
const mongoUtil = require("../utils/mongoUtil");

const getMovies = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const movies = mongoUtil.getDB().collection("movies");
    const data = await movies.find({_id: ObjectId(id)}).toArray();
    res.status(200).json({data: data});
}

module.exports = { getMovies }