require("dotenv").config({ path: "../config.env" });
const mongoUtil = require('../utils/mongoUtil')

const autoComplete = async (req, res) => {
    console.log(req.query.movie);
    const movies = mongoUtil.getDB().collection("movies");
    if (req.query.autocomplete) {
        const autoCompletePipeline = [
            {
                "$search": {
                    "index": "default",
                    "compound": {
                        "should": [
                            {
                                'equals': {
                                    "path": 'title',
                                    "value": `${req.query.movie}`,
                                    "score": { "boost": { "value": 5 } }
                                }
                            },
                            {
                                "text": {
                                    "query": `${req.query.movie}`,
                                    "path": "title",
                                    "fuzzy": {
                                        "maxEdits": 2
                                    },
                                }
                            },
                            {
                                "autocomplete": {
                                    "query": `${req.query.movie}`,
                                    "path": "title",
                                    "tokenOrder": "sequential"
                                }
                            }
                        ]
                    }
                }
            },
            {
                "$project": {
                    '_id': 1,
                    'plot': 1,
                    'title': 1,
                    'score': {
                        '$meta': 'searchScore'
                    },
                    // 'genres': 1,
                    'poster': 1,
                    // 'languages': 1,
                    // 'imdb': 1,
                    // 'year': 1,
                    // 'directors': 1
                }
            },
            { "$sort": { "len": -1, "score": -1 } },
            {
                "$limit": 20
            },
        ]
        try {
            const data = await movies.aggregate(autoCompletePipeline).toArray();
            res.status(200).json({ data: data });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ "error": "Internal server error" });
        }
    }
    else {
        const titlePipeline = [
            {
                "$search": {
                    "index": "default",
                    "compound": {
                        "should": [
                            {
                                'equals': {
                                    "path": 'title',
                                    "value": `${req.query.movie}`,
                                    "score": { "boost": { "value": 5 } }
                                }
                            },
                            {
                                "text": {
                                    "query": `${req.query.movie}`,
                                    "path": "title",
                                    "fuzzy": {
                                        "maxEdits": 2
                                    },
                                }
                            },
                            {
                                "autocomplete": {
                                    "query": `${req.query.movie}`,
                                    "path": "title",
                                    "tokenOrder": "sequential",
                                }
                            },
                            {
                                "text": {
                                    "query": `${req.query.movie}`,
                                    "path": "title",
                                    "fuzzy":
                                    {
                                        "maxEdits": 2
                                    },
                                }
                            },
                        ]
                    }
                }
            },
            {
                "$project": {
                    '_id': 1,
                    'title': 1,
                    'poster': 1,
                    'languages': 1,
                    'imdb': 1,
                    'year': 1,
                    // "score": { "$meta": "searchScore" }
                }
            },
            { "$sort": { "len": -1, "score": -1 } },
            {
                "$limit": 20
            },
        ];
        const castPipeline = [
            {
                "$search": {
                    "index": "default",
                    "compound": {
                        "should": [
                            {
                                'equals': {
                                    "path": 'cast',
                                    "value": `${req.query.movie}`,
                                    "score": { "boost": { "value": 5 } }
                                }
                            },
                            {
                                "phrase": {
                                    "query": `${req.query.movie}`,
                                    "path": "cast",
                                    "score": { "boost": { "value": 5 } }
                                }
                            },
                            {
                                "autocomplete": {
                                    "query": `${req.query.movie}`,
                                    "path": "cast",
                                    "tokenOrder": "sequential",
                                }
                            }
                        ]
                    }
                }
            },
            {
                "$project": {
                    '_id': 1,
                    'title': 1,
                    'poster': 1,
                    'languages': 1,
                    'imdb': 1,
                    'year': 1,
                }
            },
            { "$sort": { "len": -1, "score": -1 } },
            {
                "$limit": 20
            },
        ];
        const directorPipeline = [
            {
                "$search": {
                    "index": "default",
                    "compound": {
                        "should": [
                            {
                                'equals': {
                                    "path": "directors",
                                    "value": `${req.query.movie}`,
                                    "score": { "boost": { "value": 5 } }
                                }
                            },
                            {
                                "phrase": {
                                    "query": `${req.query.movie}`,
                                    "path": "directors",
                                    "score": { "boost": { "value": 5 } }
                                }
                            },
                            {
                                "autocomplete": {
                                    "query": `${req.query.movie}`,
                                    "path": "directors",
                                    "tokenOrder": "sequential",
                                }
                            }
                        ]
                    }
                }
            },
            {
                "$project": {
                    '_id': 1,
                    'title': 1,
                    'poster': 1,
                    'languages': 1,
                    'imdb': 1,
                    'year': 1,
                }
            },
            { "$sort": { "len": -1, "score": -1 } },
            {
                "$limit": 20
            },
        ];
        const genresPipeline = [
            {
                "$search": {
                    "index": "default",
                    "compound": {
                        "should": [
                            {
                                'equals': {
                                    "path": "genres",
                                    "value": `${req.query.movie}`,
                                    "score": { "boost": { "value": 5 } }
                                }
                            },
                            {
                                "phrase": {
                                    "query": `${req.query.movie}`,
                                    "path": "genres",
                                    "score": { "boost": { "value": 5 } }
                                }
                            }
                        ]
                    }
                }
            },
            {
                "$project": {
                    '_id': 1,
                    'title': 1,
                    'poster': 1,
                    'languages': 1,
                    'imdb': 1,
                    'year': 1,
                }
            },
            { "$sort": { "len": -1, "score": -1 } },
            {
                "$limit": 20
            },
        ]

        try {
            Promise.all([movies.aggregate(titlePipeline).toArray(), movies.aggregate(directorPipeline).toArray(), movies.aggregate(castPipeline).toArray(), movies.aggregate(genresPipeline).toArray()]).then((result) => { 
                
                res.status(200).json({ "title": result[0], "cast": result[2], "directors": result[1], "genres": result[3] })
            })
            // const title = await movies.aggregate(titlePipeline).toArray();
            // const directors = await movies.aggregate(directorPipeline).toArray();
            // const cast = await movies.aggregate(castPipeline).toArray();
            // const genres = await movies.aggregate(genresPipeline).toArray();
            // res.status(200).json({ "title": title, "cast": cast, "directors": directors, "genres": genres })
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ "error": "Internal server error" })
        }
    }
}

// const getMoreResults = async (req, res) => {
//     console.log(req.body);
//     const movies = mongoUtil.getDB().collection("movies");

// }

const getSemanticSearch = async (req, res) => {
    const movieDB = mongoUtil.getDB().collection("embedded_movies");
    const body = {
        "input": req.body.query,
        "model": "text-embedding-ada-002",
    }
    try {
        await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPEN_API_SECRET}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then((res) => {
            return res.json()
        }).then(async (response) => {
            // console.log(response);
            const embeddings = response.data[0].embedding;
            // console.log(embeddings);
            const pipeline = [
                {
                    '$vectorSearch': {
                        'index': 'vector_inde',
                        'path': 'plot_embedding',
                        'queryVector': embeddings,
                        'numCandidates': 100,
                        'limit': 10
                    },
                }, {
                    '$project': {
                        '_id': 1,
                        'title': 1,
                        'poster': 1,
                        'languages': 1,
                        'imdb': 1,
                        'year': 1,
                    }
                }
            ];

            const result = await movieDB.aggregate(pipeline).toArray();
            res.json(result);
        }).catch((error) => {
            console.log(error);
        })
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { autoComplete, getSemanticSearch }