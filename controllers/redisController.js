// const { createClient } = require("redis");
// require("dotenv").config({ path: "./config.env" });

// const client = createClient({
//     password: `${process.env.REDIS_CLIENT_PASSWORD}`,
//     socket: {
//         host: `${process.env.REDIS_CLIENT_HOST}`,
//         port: process.env.REDIS_CLIENT_PORT
//     }
// });

// client.on('error', err => console.error('Redis Client Error:', err));
// async function initializeRedis() {
//     try {
//         await client.connect();
//         console.log('Redis connection established successfully.'); 
//     } catch (err) {
//         console.error('Redis connection error:', err);
//     }
// }

// initializeRedis(); // Call to establish the connection

// const storeMovie = async (id, movie_list) => {
//     try {
//         // console.log(movie_list[0].plot);
//         await client.hSet(
//             'movie:' + id,
//             { 'movie_list': JSON.stringify(movie_list[0]) },
//         );
//     } catch (err) {
//         console.error('Error storing movie:', err);
//     }
    
// }
// const checkMovie = async (id) => {
//     try {
//         const result = await client.hExists('movie:' + id, 'movie_list');
//         return result;
//     } catch (err) {
//         console.error('Error checking movie:', err);
//     }
// }

// const getMovie = async (id) => {
//     try {
//         const result2 = await client.hGet('movie:' + id,'movie_list');
//         return JSON.parse(result2);
//     }
//     catch (err) {
//         console.error('Error getting movie:', err);
//     }
    
// }


// const publishMessage = async (req, res) => {
//     try{
//         await redisClient.publish("channel1", JSON.stringify(req.body));
//         console.log("PUBLISHED!");
//         res.json("published");
//     }
//     catch(error){
//         console.log("publishing error", error);
//     }
// }

// module.exports = { storeMovie, getMovie , checkMovie, publishMessage}