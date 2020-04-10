const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const {PORT} = require('./constants');
const mongodb = require('./app');

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.options('*', cors());

// GET /movies/populate/:id
// Populate the database with all the movies displaying a given actor
app.get('/movies/populate/:id', async(request, answer) => {
  const actorID = request.params.id;
  const result = await mongodb.populate(actorID);
  answer.send(result);
});

// GET /movies
// Fetch a random must-watch movie.
app.get('/movies', async(request, answer) => {
  const param = request.params;
  const movies = await mongodb.fetch_RandomMustWatch();
  answer.send(movies);
});

// GET /movies/search
// Fetch Denzel's movies with a given metascore and limit.
// Shown by descending order of metascore
app.get("/movies/search", async (request, answer) => {
	var limit = parseInt(request.query.limit);
	var metascore = parseInt(request.query.metascore);
	const movies = await mongodb.Fetch_Movies_ByMetascore(metascore, limit);
	answer.send({ limit: limit, total: movies[0], results: movies[1] });
});

// GET /movies/:id
// Fetch a movie of a given id
app.get('/movies/:id', async(request, answer) => {
  const movieID = request.params.id;
  const result = await mongodb.fetch_MovieByID(movieID);
  answer.send(result);
});

//POST /movies/:id
// Save a watched date and a review.
app.post('/movies/:id',async(request,answer)=>{
  const body = request.body;
  const movieID = request.params.id;
  const resultat = await mongodb.addreview(movieID,body);
  answer.send(resultat);
});






app.listen(PORT);
console.log(`Running on port ${PORT}`);
