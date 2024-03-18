const { Redis } = require('ioredis')
const client = new Redis()

// async function ()
// {
//     await client.set('message:6', 'Hello, world!');
//     const result = await client.get('message:6');
//     console.log("Result ->",result);
// }
const storeMovie = async (id,movie_list) => {
    await client.hset(
    'movie:'+id,
     movie_list
    )
}
const checkMovie = async (id) => {
    const result = await client.hexists('movie:' + id, '_id');
    return result;
}
const getMovie = async (id) => {
    const result2 = await client.hgetall('movie:'+id);
    return result2;
}

module.exports = { storeMovie, getMovie , checkMovie}
// module.exports = client;