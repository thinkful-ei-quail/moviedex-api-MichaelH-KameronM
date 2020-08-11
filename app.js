require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const movieList = require('./movies-data');

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    if(!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status('401').json({error: 'Unauthorized access'})
    }
    next();
});




app.get('/movie', function handleGetMovie(req, res) {

    let response = movieList;
    if(req.query.genre){
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        );
    }
    if(req.query.country){
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        );
    }
    if(req.query.avg_vote){
        response = response.filter(movie => 
            Number(movie.avg_vote) >= Number(req.query.avg_vote)
        );
    }
    res.json(response)
})











app.listen(9000, () => {
    console.log('server at 9000');
})