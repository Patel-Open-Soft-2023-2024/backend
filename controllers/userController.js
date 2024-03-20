const mongoUtil = require('../utils/mongoUtil');
const { ObjectId } = require('mongodb'); 

const createUser = async (req, res) => {
    try {
        const users = mongoUtil.getDB().collection("users");
        const newUser = req.body;
        newUser._id=new ObjectId(newUser._id)
        const result = await users.insertOne(newUser);
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = mongoUtil.getDB().collection("users");
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
        const result = await users.findOne({ _id: new ObjectId (userId) });
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
        const result = await users.updateOne({ _id: new ObjectId(updatedUser._id)}, { $set: updatedUser });
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
        const result = await users.updateOne({ _id: new ObjectId(userId) }, { $push: { watchlist: movie } });
        if (result.matchedCount) {
            res.status(200).json({ message: "Movie added to watchlist successfully" });
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
        const result = await users.updateOne({ _id: new ObjectId(userId) }, { $pull: { watchlist: movie } });
        if (result.matchedCount) {
            res.status(200).json({ message: "Movie removed from watchlist successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser,addMovieToWatchlist,removeMovieFromWatchlist};