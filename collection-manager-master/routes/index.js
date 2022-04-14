const express = require('express');
const multer = require('multer');
const db = require('../db');

const router = express.Router();

// image storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

let idAsc2 = false;
let idAsc3 = true;
let idAsc4 = true;
let idAsc5 = true;
let idAsc6 = true;
let idAsc7 = true;
let idAsc8 = true;
let idAsc9 = true;

/* GET home page. */
router.get('/', async (req, res) => {
  let query =
    'SELECT movie.movieid as mid, title, year, region, ratings, genre.description, actfirstname, actlastname, actgender FROM movie INNER JOIN genre ON movie.movgenreid = genre.genreid INNER JOIN movie_actor ON movie.movieid = movie_actor.movieid INNER JOIN actor ON movie_actor.actorid = actor.actorid';

  const params = [];

  // Filter fields
  if (req.query.title) {
    query += ' WHERE title ILIKE $1';
    params.push('%' + req.query.title + '%');
  } else if (req.query.year) {
    query += ' WHERE year = $1';
    params.push(req.query.year);
  } else if (req.query.region) {
    query += ' WHERE region ILIKE $1';
    params.push('%' + req.query.region + '%');
  } else if (req.query.ratings) {
    query += ' WHERE ratings = $1';
    params.push(req.query.ratings);
  } else if (req.query.genre_description) {
    query += ' WHERE genre.description ILIKE $1';
    params.push('%' + req.query.genre_description + '%');
  } else if (req.query.actfirstname) {
    query += ' WHERE actfirstname ILIKE $1';
    params.push('%' + req.query.actfirstname + '%');
  } else if (req.query.actlastname) {
    query += ' WHERE actlastname ILIKE $1';
    params.push('%' + req.query.actlastname + '%');
  } else if (req.query.actgender) {
    query += ' WHERE actgender ILIKE $1';
    params.push('%' + req.query.actgender + '%');
  }

  // Sort fields
  if (req.query.sort === 'title') {
    if (req.query.asc === 'true') {
      query += ' ORDER BY title ';
    } else {
      query += ' ORDER BY title DESC';
    }
    idAsc2 = !idAsc2;
  } else if (req.query.sort === 'year') {
    if (req.query.asc === 'true') {
      query += ' ORDER BY year ';
    } else {
      query += ' ORDER BY year DESC';
    }
    idAsc3 = !idAsc3;
  } else if (req.query.sort === 'region') {
    if (req.query.asc === 'true') {
      query += ' ORDER BY region ';
    } else {
      query += ' ORDER BY region DESC';
    }
    idAsc4 = !idAsc4;
  } else if (req.query.sort === 'ratings') {
    if (req.query.asc === 'true') {
      query += ' ORDER BY ratings ';
    } else {
      query += ' ORDER BY ratings DESC';
    }
    idAsc5 = !idAsc5;
  } else if (req.query.sort === 'genre_description') {
    if (req.query.asc === 'true') {
      query += ' ORDER BY genre.description ';
    } else {
      query += ' ORDER BY genre.description DESC';
    }
    idAsc6 = !idAsc6;
  } else if (req.query.sort === 'actfirstname') {
    if (req.query.asc === 'true') {
      query += ' ORDER BY actfirstname ';
    } else {
      query += ' ORDER BY actfirstname DESC';
    }
    idAsc7 = !idAsc7;
  } else if (req.query.sort === 'actlastname') {
    if (req.query.asc === 'true') {
      query += ' ORDER BY actlastname ';
    } else {
      query += ' ORDER BY actlastname DESC';
    }
    idAsc8 = !idAsc8;
  } else if (req.query.sort === 'actgender') {
    if (req.query.asc === 'true') {
      query += ' ORDER BY actgender ';
    } else {
      query += ' ORDER BY actgender DESC';
    }
    idAsc9 = !idAsc9;
  } else {
    query += ' ORDER BY title';
  }

  const result = await db.query(query, params);

  res.render('index', {
    title: 'Movie Collections',
    rows: result.rows,
    idAsc2,
    idAsc3,
    idAsc4,
    idAsc5,
    idAsc6,
    idAsc7,
    idAsc8,
    idAsc9,
  });
});

// Navigate to New movie form with drop down selection fields when click 'Create' button from homepage
router.get('/movie/create', async (req, res) => {
  // Query from 3 tables: genre, movie, actor
  const genreQuery = 'SELECT genreid, description FROM genre';
  const movieQuery = 'SELECT movieid, title FROM movie';
  const actorQuery = 'SELECT actgender FROM actor';

  const genre = await db.query(genreQuery);
  const movie = await db.query(movieQuery);
  const actor = await db.query(actorQuery);

  res.render('create-movie', {
    genres: genre.rows,
    movies: movie.rows,
    actors: actor.rows,
  });
});

// Insert user input from new movie form into the database
router.post('/movie/create', async (req, res) => {
  // Insert into movie table
  // This query will insert into movie table and return the movieid field, $1, $2... is the user input value
  const movieQuery =
    'INSERT INTO movie (title, year, region, description, ratings, movgenreid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING movieid';

  // This will get the input (i.e. name = "title") from the .hbs file. The req.body. must match the input order in the query above
  const movieParameters = [
    req.body.title,
    req.body.year,
    req.body.region,
    req.body.movdescription,
    req.body.ratings,
    req.body.genreId,
  ];

  // movieInsert will have the returning movieid value after INSERT into the database
  const movieInsert = await db.query(movieQuery, movieParameters);

  // Insert into actor table
  const actorQuery =
    'INSERT INTO actor (actfirstname, actlastname, actgender) VALUES ($1, $2, $3) RETURNING actorid';
  const actorparameters = [
    req.body.actfirstname,
    req.body.actlastname,
    req.body.actgender,
  ];
  const actorInsert = await db.query(actorQuery, actorparameters);

  // Insert into movie_actor table
  const movieActorQuery =
    'INSERT INTO movie_actor (movieid, actorid) VALUES ($1, $2)';

  // This will get the movieid and actorid as parameters
  const movieActorParameters = [
    movieInsert.rows[0].movieid,
    actorInsert.rows[0].actorid,
  ];
  await db.query(movieActorQuery, movieActorParameters);

  // Redirect to the homepage after submit the form
  res.redirect('/');
});

// Navigate to View Movie Details page when click 'View' button from homepage
router.get('/movie/:movieid', async (req, res) => {
  // Since movie and genre table both have description field, we have to change one of the fields name
  // (movie.description as movie_description) so that the result variable will have 2 different description fields.
  // After that, we can use the new column name {{new_col_name}} in the .hbs file to display the result
  const query =
    'SELECT movie.movieid, title, year, region, movie.description as movie_description, ratings, genre.description, actfirstname, actlastname, actgender FROM movie INNER JOIN genre ON movie.movgenreid = genre.genreid INNER JOIN movie_actor ON movie.movieid = movie_actor.movieid INNER JOIN actor ON movie_actor.actorid = actor.actorid WHERE movie.movieid = $1';
  const parameters = [req.params.movieid];
  const result = await db.query(query, parameters);

  res.render('view-movie', {
    // We need to send the movieid into the view-movie.hbs form so that the edit button can work (nagivate to the edit movie info page)
    movieid: req.params.movieid,
    rows: result.rows,
    query,
    parameters: JSON.stringify(parameters),
  });
});

// Navigate to Edit movie info form when click 'Edit' button from homepage
// /movie/:movieid/edit The :movieid value is from when you click the "edit" button in the homepage
router.get('/movie/:movieid/edit', async (req, res) => {
  // This part is to get the drop down list values for genre
  const genreQuery = 'SELECT genreid, description FROM genre';
  const genre = await db.query(genreQuery);

  // This part is to get movie information from movieId
  const movieQuery =
    'SELECT title, year, region, movie.description as md, ratings, movgenreid, actfirstname, actlastname, actgender FROM movie INNER JOIN movie_actor ON movie.movieid = movie_actor.movieid INNER JOIN actor ON movie_actor.actorid = actor.actorid WHERE movie.movieid = $1';
  const parameters = [req.params.movieid];
  const movie = await db.query(movieQuery, parameters);

  // This part is to prefill the edit form with current values
  for (let i = 0; i < genre.rows.length; i++) {
    if (movie.rows[0].movgenreid === genre.rows[i].genreid) {
      genre.rows[i].selected = true;
    }
  }

  let isFemale = true;
  if (movie.rows[0].actgender === 'Female') {
    isFemale = true;
  } else {
    isFemale = false;
  }

  const ratings = [
    { rate: 1 },
    { rate: 2 },
    { rate: 3 },
    { rate: 4 },
    { rate: 5 },
  ];

  for (let i = 0; i < ratings.length; i++) {
    if (movie.rows[0].ratings === ratings[i].rate) {
      ratings[i].selected = true;
    }
  }

  res.render('edit-movie', {
    movieid: req.params.movieid, // Must pass movie id here for the form-action in the edit-movie.hbs
    genres: genre.rows,
    movies: movie.rows[0],
    isFemale,
    ratings,
  });
});

// Get the user input and update movie info into database
router.post('/movie/:movieid/edit', async (req, res) => {
  // Update movie table
  const movieQuery =
    'UPDATE movie SET title = $1 , year = $2, region = $3, description = $4, ratings = $5, movgenreid = $6 WHERE movieid = $7';
  const movieParameters = [
    req.body.title,
    req.body.year,
    req.body.region,
    req.body.movdescription,
    req.body.ratings,
    req.body.genreId,
    req.params.movieid, // movieid is from router.post('/movie/:movieid/edit'
  ];
  await db.query(movieQuery, movieParameters);

  // Get actorid query
  const actorIdQuery = 'Select actorid FROM movie_actor WHERE movieid = $1';
  const actorIdParameter = [req.params.movieid];
  const actorIdResult = await db.query(actorIdQuery, actorIdParameter);

  // Update actor table
  const actorQuery =
    'UPDATE actor SET actfirstname = $1, actlastname = $2, actgender = $3 WHERE actorid = $4';
  const actorParameters = [
    req.body.actfirstname,
    req.body.actlastname,
    req.body.actgender,
    actorIdResult.rows[0].actorid,
  ];
  await db.query(actorQuery, actorParameters);

  // Redirect to homepage after done editting the movie info
  res.redirect('/');
});

// Navigate to delete movie confirmation page when click 'Delete' button from homepage
router.get('/movie/:movieid/delete', async (req, res) => {
  // Get the movie title
  const movieQuery = 'SELECT movieid, title FROM movie WHERE movieid = $1';
  const movieParameters = [req.params.movieid];
  const movieResult = await db.query(movieQuery, movieParameters);

  // Send movie title to delete-movie.hbs
  res.render('delete-movie', {
    title: movieResult.rows[0].title,
    movieid: movieResult.rows[0].movieid,
  });
});

// Delete the movie when the user click delete button
router.post('/movie/:movieid/delete', async (req, res) => {
  // Delete from movie_actor table
  const deleteMovieActor = 'DELETE FROM movie_actor WHERE movieid = $1';
  const parameters = [req.params.movieid];
  await db.query(deleteMovieActor, parameters);

  // Delete from movie table
  const deleteMovie = 'DELETE FROM movie WHERE movieid = $1';
  await db.query(deleteMovie, parameters);

  // Redirect to homepage after click delete button
  res.redirect('/');
});

// Navigate to Genre page
router.get('/genre', async (req, res) => {
  // We will need genreid so that the edit button in the genre page can work
  const query = 'SELECT genreid, description FROM genre ORDER BY description';
  const param = []; // must have this otherwise code won't run
  const result = await db.query(query, param);

  console.log(result.rows);
  res.render('genre', {
    rows: result.rows,
    query,
  });
});

// Navigate to Create Genre page
router.get('/genre/create', (req, res) => {
  res.render('create-genre', {});
});

// Insert user input and create new genre
router.post('/genre/create', async (req, res) => {
  const query = 'INSERT INTO genre (description) VALUES ($1)';
  const param = [req.body.genre_description];
  await db.query(query, param);

  res.redirect('/genre');
});

// Navigate to edit genre page
router.get('/genre/:genreid/edit', async (req, res) => {
  // Get information about current selected genre so that we can prefill value in the edit-genre.hbs
  const query = 'SELECT genreid, description from genre WHERE genreid = $1';
  const param = [req.params.genreid];
  const result = await db.query(query, param);

  res.render('edit-genre', {
    // We need to pass the genreid into form action part in the edit-genre.hbs
    result: result.rows[0],
  });
});

// Get user input and update genre table
router.post('/genre/:genreid/edit', async (req, res) => {
  const query = 'UPDATE genre SET description = $1 WHERE genreid = $2';
  const param = [req.body.genre_description, req.params.genreid];
  await db.query(query, param);

  res.redirect('/genre');
});

// Navigate to the delete genre confirmation page
router.get('/genre/:genreid/delete', async (req, res) => {
  // Get the genre description and the movies that has that movie genre
  const genreQuery =
    'SELECT genreid, genre.description, title, movie.movieid FROM genre LEFT JOIN movie ON genre.genreid = movie.movgenreid WHERE genreid = $1';
  const genreParameters = [req.params.genreid];
  const genreResult = await db.query(genreQuery, genreParameters);

  console.log(genreResult.rows[0]);
  // If the movie title is not null, then render the error page, otherwise, render the delete confirmation page
  if (genreResult.rows[0].title !== null) {
    res.render('delete-genre-error', {
      genre: genreResult.rows[0].description,
      result: genreResult.rows,
    });
  } else {
    res.render('delete-genre', {
      result: genreResult.rows[0],
    });
  }
});

// Delete movie genre when user click delete button in the confirmation
router.post('/genre/:genreid/delete', async (req, res) => {
  const deleteGenre = 'DELETE FROM genre WHERE genreid = $1';
  const param = [req.params.genreid];
  await db.query(deleteGenre, param);

  // Redirect to homepage after click delete button
  res.redirect('/genre');
});

// Upload photo
router.post('/photo/:movieid', upload.single('photo'), async (req, res) => {
  const uploadQuery = 'UPDATE movie SET photo = $1 WHERE movieid = $2';
  const uploadParams = [req.file.originalname, req.params.movieid];
  await db.query(uploadQuery, uploadParams);

  res.render('view-movie', {
    movieid: req.params.movieid,
  });

  res.redirect('/');
});

module.exports = router;

// <input type='submit' class='btn btn-primary' value='Update' />
