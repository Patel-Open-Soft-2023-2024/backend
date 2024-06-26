const mongoUtil = require("../utils/mongoUtil");
const { insertPreviewLink } = require("../utils/movieLinkUtil");

let black = (input) => "\x1b[30m" + input + "\x1b[0m";
let red = (input) => "\x1b[31m" + input + "\x1b[0m";
let green = (input) => "\x1b[32m" + input + "\x1b[0m";
let yellow = (input) => "\x1b[33m" + input + "\x1b[0m";
let blue = (input) => "\x1b[34m" + input + "\x1b[0m";
let magenta = (input) => "\x1b[35m" + input + "\x1b[0m";
let cyan = (input) => "\x1b[36m" + input + "\x1b[0m";
let white = (input) => "\x1b[37m" + input + "\x1b[0m";
let gray = (input) => "\x1b[90m" + input + "\x1b[0m";

const autoComplete = async (req, res) => {
  const query_name = req.query.movie;
  // hard coded user id
  let profileId = "abc";
  if (req.query.profileId) {
    // const profileId = "6602c074a767bf239e5b70f9";
    profileId = req.query.profileId;
  }

  // remove spaces from the string
  const query_no_space = query_name.replace(/\s+/g, "");
  const movies = mongoUtil.getDB().collection("movies");
  const History = mongoUtil.getDB().collection("History");
  if (req.query.autocomplete) {
    console.log(gray("auto:"), req.query.movie);
    const autoCompletePipeline = [
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                equals: {
                  path: "title",
                  value: `${query_no_space}`,
                  score: { boost: { value: 5 } },
                },
              },
              {
                text: {
                  query: `${query_name}`,
                  path: "title",
                  fuzzy: {
                    maxEdits: 2,
                  },
                },
              },
              {
                autocomplete: {
                  query: `${query_name}`,
                  path: "title",
                  tokenOrder: "sequential",
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          plot: 1,
          title: 1,
          score: {
            $meta: "searchScore",
          },
          genres: 1,
          poster: 1,
          languages: 1,
          imdb: 1,
          year: 1,
          directors: 1,
          cast: 1,
          runtime: 1,
          fullplot: 1,
        },
      },
      { $sort: { score: -1 } },
      {
        $limit: 20,
      },
    ];
    try {
      const data = await movies.aggregate(autoCompletePipeline).toArray();
      insertPreviewLink(data);
      res.status(200).json({ data: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    console.log(blue("diverse:"), req.query.movie);
    const titlePipeline = [
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                equals: {
                  path: "title",
                  value: `${query_no_space}`,
                  score: { boost: { value: 5 } },
                },
              },
              {
                text: {
                  query: `${query_name}`,
                  path: "title",
                  fuzzy: {
                    maxEdits: 2,
                  },
                },
              },
              {
                autocomplete: {
                  query: `${query_name}`,
                  path: "title",
                  tokenOrder: "sequential",
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          poster: 1,
          languages: 1,
          imdb: 1,
          year: 1,
          genres: 1,
          plot: 1,
          directors: 1,
          cast: 1,
          runtime: 1,
          fullplot: 1,
          score: { $meta: "searchScore" },
        },
      },
      { $sort: { score: -1 } },
      {
        $limit: 20,
      },
    ];
    const castPipeline = [
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                equals: {
                  path: "cast",
                  value: `${query_no_space}`,
                  score: { boost: { value: 5 } },
                },
              },
              {
                phrase: {
                  query: `${query_name}`,
                  path: "cast",
                  score: { boost: { value: 5 } },
                },
              },
              {
                autocomplete: {
                  query: `${query_name}`,
                  path: "cast",
                  tokenOrder: "sequential",
                },
              },
              {
                text: {
                  query: `${query_name}`,
                  path: "cast",
                  fuzzy: {
                    maxEdits: 2,
                  },
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          poster: 1,
          languages: 1,
          imdb: 1,
          year: 1,
          genres: 1,
          plot: 1,
          directors: 1,
          cast: 1,
          runtime: 1,
          fullplot: 1,
          score: { $meta: "searchScore" },
        },
      },
      { $sort: { score: -1 } },
      {
        $limit: 20,
      },
    ];
    const directorPipeline = [
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                equals: {
                  path: "directors",
                  value: `${query_no_space}`,
                  score: { boost: { value: 5 } },
                },
              },
              {
                phrase: {
                  query: `${query_name}`,
                  path: "directors",
                  score: { boost: { value: 5 } },
                },
              },
              {
                autocomplete: {
                  query: `${query_name}`,
                  path: "directors",
                  tokenOrder: "sequential",
                },
              },
              {
                text: {
                  query: `${query_name}`,
                  path: "directors",
                  fuzzy: {
                    maxEdits: 2,
                  },
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          poster: 1,
          languages: 1,
          imdb: 1,
          year: 1,
          genres: 1,
          plot: 1,
          directors: 1,
          cast: 1,
          runtime: 1,
          fullplot: 1,
          score: { $meta: "searchScore" },
        },
      },
      { $sort: { score: -1 } },
      {
        $limit: 20,
      },
    ];
    const genresPipeline = [
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                equals: {
                  path: "genres",
                  value: `${query_no_space}`,
                  score: { boost: { value: 5 } },
                },
              },
              {
                phrase: {
                  query: `${query_name}`,
                  path: "genres",
                  score: { boost: { value: 5 } },
                },
              },
              {
                text: {
                  query: `${query_name}`,
                  path: "generes",
                  fuzzy: {
                    maxEdits: 2,
                  },
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          poster: 1,
          languages: 1,
          imdb: 1,
          year: 1,
          genres: 1,
          plot: 1,
          directors: 1,
          cast: 1,
          runtime: 1,
          fullplot: 1,
          score: { $meta: "searchScore" },
        },
      },
      { $sort: { score: -1 } },
      {
        $limit: 20,
      },
    ];

    try {
      Promise.all([
        movies.aggregate(titlePipeline).toArray(),
        movies.aggregate(directorPipeline).toArray(),
        movies.aggregate(castPipeline).toArray(),
        movies.aggregate(genresPipeline).toArray(),
        History.find({ Profile_id: profileId }).toArray(),
      ]).then((result) => {
        const userHistoryMovieIDs = result[4].map((movie) =>
          movie.Movie_id.toString()
        );
        console.log({ userHistoryMovieIDs });
        for (let i = 0; i < result.length - 1; i++) {
          insertPreviewLink(result[i]);
          const updatedMovies = result[i].map((movie) => {
            if (userHistoryMovieIDs.includes(movie._id.toString())) {
              // Assume movie object has a 'score' field. Increase it by 1 or any value you see fit.
              movie.score *= 5;
            }
            return movie;
          });
          result[i] = updatedMovies.sort((a, b) => b.score - a.score);
        }
        res
          .status(200)
          .json({
            title: result[0],
            cast: result[2],
            directors: result[1],
            genres: result[3],
          });
      });
      // const title = await movies.aggregate(titlePipeline).toArray();
      // const directors = await movies.aggregate(directorPipeline).toArray();
      // const cast = await movies.aggregate(castPipeline).toArray();
      // const genres = await movies.aggregate(genresPipeline).toArray();
      // res.status(200).json({ "title": title, "cast": cast, "directors": directors, "genres": genres })
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// const getMoreResults = async (req, res) => {
//     console.log(req.body);
//     const movies = mongoUtil.getDB().collection("movies");

// }

const getSemanticSearch = async (req, res) => {
  console.log(green("semantic:"), req.query.movie);
  const movieDB = mongoUtil.getDB().collection("embedded_movies");
  const body = {
    input: req.query.movie,
    model: "text-embedding-ada-002",
  };
  try {
    await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPEN_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .then(async (response) => {
        // console.log(response);
        const embeddings = response.data[0].embedding;
        // console.log(embeddings);
        const pipeline = [
          {
            $vectorSearch: {
              index: "vector_inde",
              path: "plot_embedding",
              queryVector: embeddings,
              numCandidates: 100,
              limit: 10,
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              poster: 1,
              languages: 1,
              imdb: 1,
              year: 1,
              genres: 1,
              plot: 1,
              directors: 1,
              cast: 1,
              runtime: 1,
              fullplot: 1,
            },
          },
        ];

        const result = await movieDB.aggregate(pipeline).toArray();
        insertPreviewLink(result);
        res.json(result);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { autoComplete, getSemanticSearch };
