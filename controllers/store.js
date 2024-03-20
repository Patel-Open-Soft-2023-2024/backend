// const { Redis } = require('ioredis')
// const client = new Redis()
const { createClient } = require('redis')

const client = createClient({
    password: 'G0SpRjh3HW8pCCjYcjHlrVJ2KYtQRj3E',
    socket: {
        host: 'redis-17927.c212.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 17927
    }
});

client.on('error', err => console.error('Redis Client Error:', err));
async function initializeRedis() {
    try {
        await client.connect();
        console.log('Redis connection established successfully.'); 
    } catch (err) {
        console.error('Redis connection error:', err);
    }
}

initializeRedis(); // Call to establish the connection

const storeMovie = async (id, movie_list) => {
    try {
        // console.log(movie_list[0].plot);
        await client.hSet(
            'movie:' + id,
            { 'movie_list': JSON.stringify(movie_list[0]) },
        );
    } catch (err) {
        console.error('Error storing movie:', err);
    }
    
}
const checkMovie = async (id) => {
    try {
        const result = await client.hExists('movie:' + id, 'movie_list');
        return result;
    } catch (err) {
        console.error('Error checking movie:', err);
    }
}
const getMovie = async (id) => {
    try {
        const result2 = await client.hGet('movie:' + id,'movie_list');
        return JSON.parse(result2);
    }
    catch (err) {
        console.error('Error getting movie:', err);
    }
    
}

module.exports = { storeMovie, getMovie , checkMovie}
// module.exports = client;