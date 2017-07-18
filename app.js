var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var serveStatic = require('serve-static')
var port = process.env.PORT || 3000
var bodyParser = require('body-parser')
var app = express()

mongoose.connect('mongodb://localhost:27017/imovie')
console.log('MongoDB connection success!');

var Movie = require('./models/movie.js')

app.set('views', './views/pages')
app.set('view engine','jade')
app.use(serveStatic('libs'))
app.use(require('body-parser').urlencoded({ extended: true }))
app.locals.moment = require('moment')
app.listen(port)

console.log('LWFlooring started on port: ' + port)

//index page
app.get('/',function(req, res) {
  Movie.fetch(function(err,movies){
    if(err){
      console.log(err)
    }
    res.render('index',{
      title:'tracking first page',
      movies:movies
    })
  })
})
//detail page
app.get('/movie/:id',function(req, res) {

  var id = req.params.id
  Movie.findById(id, function(err,movie){
    res.render('detail',{
      title:'tracking detail page' + movie.title,
      movie: movie
    })
  })
})
app.get('/admin/movie',function(req, res) {
  res.render('admin',{
    title:'admin page',
    movie:{
      title: '',
      director: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  })
})

app.get('/admin/update/:id', function(req, res){
  var id = req.params.id

  if(id){
    Movie.findById(id, function(err, movie){
      res.render('admin',{
        title:'Admin update page',
        movie: movie
      })
    })
  }
})

app.post('/admin/movie/new', function(req, res){
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie

  if (id !== 'undefined'){
    Movie.findById(id, function(err, movie){
      if(err){
        console.log(err)
      }

      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie){
        if(err){
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
      })
    })
  }
  else{
    _movie = new Movie({
      director: movieObj.director,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })
    _movie.save(function(err, movie){
      if(err){
        console.log(err)
      }
      res.redirect('/movie/' + movie._id)
    })
  }
})

app.get('/admin/list',function(req, res) {
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err)
   }
    res.render('list',{
      title:'list',
      movies:movies
    })
  })
})
