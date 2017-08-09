var Movie = require('../models/movie.js')
var User = require('../models/user.js')
var _ = require('underscore')

module.exports = function(app){

    //pre handle user
    app.use(function(req, res, next){
      var _user= req.session.user
      if(_user) {
        app.locals.user = _user
      }
      return next()
    })
    //detail page
    app.get('/movie/:id',function(req, res){
      //var id = req.params['id']
      const movieId = req.params.id
      Movie.findById(movieId, function(err, movie){
        if(err){
          console.log(err)
        }

        res.render('detail',{
          title:movie.title+ '  tracking detail page  ',
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
    app.delete('/admin/list', function(req,res){
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
    })
}
