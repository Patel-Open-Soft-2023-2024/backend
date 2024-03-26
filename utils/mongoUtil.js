const MongoClient = require('mongodb').MongoClient;
require('dotenv').config({ path: "../config.env" });

var mongoClient;

const connectToCluster = async () => {
    try {
        mongoClient = new MongoClient(process.env.MONGO_URI);
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
}

const getDB = () => mongoClient.db("sample_mflix");

module.exports = { getDB, connectToCluster }