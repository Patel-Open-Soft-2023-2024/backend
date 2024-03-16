const mongoUtil = require('../utils/mongoUtil')

const autoComplete = async (req, res) => {
    console.log(req.query.movie);
    const movies = mongoUtil.getDB().collection("movies");
    const pipeline = [
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
                            'autocomplete': {
                                'path': 'title',
                                'query': `${req.query.movie}`,
                                'tokenOrder': 'sequential',
                                // 'fuzzy': {
                                //     'maxEdits': 2,
                                //     'prefixLength': 1,
                                //     //   'maxExpansions': 256
                                // }
                            }
                        },
                        {
                            'autocomplete': {
                                'path': 'fullplot',
                                'query': `${req.query.movie}`,
                                'tokenOrder': 'sequential',
                                // 'fuzzy': {
                                //     'maxEdits': 2,
                                //     'prefixLength': 1,
                                //     //   'maxExpansions': 256
                                // }
                            }
                        },
                        // {
                        //     'autocomplete': {
                        //         'path': 'title',
                        //         'query': `${req.query.movie}`,
                        //         'tokenOrder': 'sequential',
                        //         'fuzzy': {
                        //             'maxEdits': 2,
                        //             'prefixLength': 1,
                        //               'maxExpansions': 256
                        //         }
                        //     }
                        // }
                    ]
                },
                //   "highlight": {
                //         "path": "fullplot"
                //     }
            }
        },
        {
            "$limit": 20
        },
        {
            "$project": {
                "title": 1,
                "score": { "$meta": "searchScore" }
            }
        }
    ]

    const data = await movies.aggregate(pipeline).toArray();
    // await data.forEach((doc) => console.log(doc));
    res.status(200).json({ data: data });
}


const autoComplete2 = async (req, res) => {
    console.log(req.query.movie);
    const movies = mongoUtil.getDB().collection("movies");
    const pipeline = [
        {
            "$search": {
                "index": "default",
                "compound": {
                    "should": [
                        {
                            "phrase": {
                                "query": `${req.query.movie}`,
                                "path": "title",
                                "score": { "boost": { "value": 5 } }
                            }
                        },
                        {
                            "autocomplete": {
                                "query": `${req.query.movie}`,
                                "path": "title",
                                "tokenOrder": "sequential",
                            }
                        },
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

module.exports = { autoComplete, autoComplete2 }