var Movie = require('../models/movie.js')
var Comment = require('../models/comment.js')
var _ = require('underscore')

//detail page
exports.detail = function(req, res){
  var id = req.params['id']
  //const movieId = req.params.id

    Movie.findById(id, function(err, movie){
      Comment
       .find({movie:id})
       .populate('from','name')
       .populate('reply.from reply.to','name')
       .exec(function(err,comments){
        console.log(comments)
        res.render('detail',{
          title:movie.title + '  tracking detail page  ',
          movie: movie,
          comments:comments
        })
    })
  })
}

exports.new = function(req, res) {
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
}

exports.update = function(req, res){
  var id = req.params.id

  if(id){
    Movie.findById(id, function(err, movie){
      res.render('admin',{
        title:'Admin update page',
        movie: movie
      })
    })
  }
}

exports.save = function(req, res){
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
}

exports.list = function(req, res) {
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err)
   }
    res.render('list',{
      title:'list',
      movies:movies
    })
  })
}
exports.del = function(req,res){
  var id = req.query.id

  if(id){
    Movie.remove({_id:id},function(err, movie){
      if(err){
        console.log(err)
        res.json({success:0})
      }
      else{
        res.json({success:1})
      }
    })
  }
}
