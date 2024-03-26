const { MongoClient } = require("mongodb");
require('dotenv').config({ path: "./config.env" });

// Replace the uri string with your connection string.
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db('sample_mflix');
        const movies = database.collection('movies');

        // Query for a movie that has the title 'Back to the Future'
        const pipeline = [
            {
                "$search": {
                    "index": "default",
                    "compound": {
                        "should": [
                            {
                                'equals': {
                                    "path": 'title',
                                    "value": `Titanic`,
                                    "score": { "boost": { "value": 5 } }
                                }
                            },
                            // {
                            //     "phrase": {
                            //         "query": `Titanic`,
                            //         "path": "title",
                            //         "score": { "boost": { "value": 5 } }
                            //     }
                            // },
                            // {
                            //     "text": {
                            //         "query": `Titanic`,
                            //         "path": "title",
                            //         "fuzzy": {
                            //             "maxEdits": 2,
                            //         }
                            //     }
                            // },
                            // {
                            //     "autocomplete": {
                            //         "query": `Titanic`,
                            //         "path": "title",
                            //         "tokenOrder": "sequential",
                            //     }
                            // }
                            // ,
                            // {
                            //     "autocomplete": {
                            //         "query": `Titanic`,
                            //         "path": "fullplot",
                            //         "tokenOrder": "sequential"
                            //     }
                            // }
                        ]
                    }
                }
            },
            {
                "$project": {
                    "title": 1,
                    "fullplot": 1,
                    "score": { "$meta": "searchScore" }
                }
            },
            { "$sort": { "len": -1, "score": -1 } },
            {
                "$limit": 20
            },
        ]
        movies.aggregate(pipeline).toArray().then(data => { console.log(data, 'data'); client.close(); }).catch(err => console.error(err, 'error'));
        // const query = { title: 'Back to the Future' };
        // const movie = await movies.findOne(query);
        // console.log(movie);
        // res.status(200).json({ data: data });
        // console.log(data);
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
async function a() {
    console.log('Connected');
    const movies = client.db("sample_mflix").collection("movies");
    // Query for a movie that has the title 'Back to the Future'
    // const pipeline = [
    //     {
    //         "$search": {
    //             "index": "default",
    //             "compound": {
    //                 "should": [
    //                     {
    //                         'text': {
    //                             "path": 'title',
    //                             "query": `Titani`,
    //                             "fuzzy": {
    //                                 "maxEdits": 2,
    //                             },
    //                             "score": { "boost": { "value": 5 } }
    //                         }
    //                     },
    //                     // {
    //                     //     "phrase": {
    //                         //         "query": `Titanic`,
    //                         //         "path": "title",
    //                         //         "score": { "boost": { "value": 5 } }
    //                         //     }
    //                         // },
    //                         // {
    //                             //     "text": {
    //                                 //         "query": `Titanic`,
    //                     //         "path": "title",
    //                     //         "fuzzy": {
    //                     //             "maxEdits": 2,
    //                     //         }
    //                     //     }
    //                     // },
    //                     // {
    //                     //     "autocomplete": {
    //                         //         "query": `Titanic`,
    //                         //         "path": "title",
    //                         //         "tokenOrder": "sequential",
    //                         //     }
    //                     // }
    //                     // ,
    //                     // {
    //                         //     "autocomplete": {
    //                             //         "query": `Titanic`,
    //                             //         "path": "fullplot",
    //                             //         "tokenOrder": "sequential"
    //                     //     }
    //                     // }
    //                 ]
    //             }
    //         }
    //     },
    //     {
    //         "$project": {
    //             "title": 1,
    //             "fullplot": 1,
    //             "score": { "$meta": "searchScore" }
    //         }
    //     },
    //     { "$sort": { "score": -1 } },
    //     {
    //         "$limit": 5
    //     },
    // ]
    // movies.aggregate(pipeline).toArray().then(data => { console.log(data, 'data'); }).catch(err => console.error(err, 'error'));
    movies.find(
        {
            cast: { $elemMatch:  "christopher"  }
        }
    ).then(data => { console.log(data, 'data'); })

    // const query = { title: 'Back to the Future' };
    // const movie = await movies.findOne(query);
    // console.log(movie);
}
// run().catch(console.dir);
console.log("--")
client.connect().then(() => { console.log('Connected'); a() }).catch(err => console.error(err, 'error'));
