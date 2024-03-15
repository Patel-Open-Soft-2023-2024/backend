const mongoUtil = require('../utils/mongoUtil')

const autoComplete = async (req, res) => {
    console.log(req.query.movie);
    const movies = mongoUtil.getDB().collection("movies");
    const pipeline = [
        {
            "$search": {
                "index": "default",
                "compund": {
                    "should": [
                        {
                            'autocomplete': {
                                'path': 'title',
                                'query': `${req.query.movie}`,
                                'tokenOrder': 'sequential',
                                'fuzzy': {
                                    'maxEdits': 2,
                                    'prefixLength': 1,
                                    //   'maxExpansions': 256
                                }
                            }
                        },
                        {
                            'autocomplete': {
                                'path': 'fullplot',
                                'query': `${req.query.movie}`,
                                'tokenOrder': 'sequential',
                                'fuzzy': {
                                    'maxEdits': 2,
                                    'prefixLength': 1,
                                    //   'maxExpansions': 256
                                }
                            }
                        }

                    ]
                },
              "highlight": {
                    "path": "fullplot"
                }
            }
        },
        {
            "$limit": 5
        },
        {
            "$project": {
                "title": 1,
            }
        }
    ]

    const data = await movies.aggregate(pipeline).toArray();
    // await data.forEach((doc) => console.log(doc));
    res.status(200).json({ data: data });
}

module.exports = { autoComplete }