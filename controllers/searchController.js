require("dotenv").config({path: "../config.env"});
const mongoUtil = require('../utils/mongoUtil')

const autoComplete = async (req, res) => {
    console.log(req.query.movie);
    const movies = mongoUtil.getDB().collection("movies");
    const pipeline = [
        {
            "$search": {
                "index": "newIndex",
                "compound": {
                    "should": [
                        {
                            'equals': {
                                "path": 'title',
                                "value": `${req.query.movie}`,
                                "score": { "boost": { "value": 5 } }
                            }
                        },
                        // {
                        //     "phrase": {
                        //         "query": `${req.query.movie}`,
                        //         "path": "title",
                        //         "score": { "boost": { "value": 5 } }
                        //     }
                        // },
                        {
                            "text": {
                                "query": `${req.query.movie}`,
                                "path": "title",
                                "fuzzy": {
                                    "maxEdits": 2,
                                }
                            }
                        },
                        {
                            "autocomplete": {
                                "query": `${req.query.movie}`,
                                "path": "title",
                                "tokenOrder": "sequential",
                            }
                        }
                        // ,
                        // {
                        //     "autocomplete": {
                        //         "query": `${req.query.movie}`,
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
    const data = await movies.aggregate(pipeline).toArray();
    res.status(200).json({ data: data });
}

const getSemanticSearch = async (req, res) => {
    const movieDB = mongoUtil.getDB().collection("embedded_movies");
    const body = {
        "input": req.body.query,
        "model": "text-embedding-ada-002",
    }
    console.log(body);
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
                        'fullplot': 1,
                        'title': 1,
                        'score': {
                            '$meta': 'vectorSearchScore'
                        }
                    }
                }
            ];

            const result = await movieDB.aggregate(pipeline).toArray();
            // console.log(result);
            res.json(result);
        }).catch((error) => {
            console.log(error);
            res.status(400).json(error);
        })
    }
    catch (error) {
        console.log(error);
        res.status(400).json({error: error, "message": "Unable to process the request now."});
    }
}

module.exports = { autoComplete, getSemanticSearch }