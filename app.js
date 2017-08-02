var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var _ = require('underscore')
var serveStatic = require('serve-static')
var port = process.env.PORT || 3000
var bodyParser = require('body-parser')
var app = express()

mongoose.connect('mongodb://localhost:27017/imovie')
console.log('MongoDB connection success!');

var Movie = require('./models/movie.js')
var User = require('./models/user.js')

app.set('views', './views/pages')
app.set('view engine','jade')
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('body-parser').urlencoded({ extended: true }))
var session = require('express-session')
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.session({
  secret: 'LWFlooring'
}))
app.locals.moment = require('moment')
app.listen(port)

console.log('LWFlooring started on port: ' + port)

//index page
app.get('/',function(req, res) {
  console.log('user in session: ')
  console.log(req.session.user)
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

//sign up
app.post('/user/signup',function(req,res){
  var _user = req.body.user
  User.findOne({name:_user.name}, function(err,user){
    if(err){
      console.log(err)
    }
    if(user){
      console.log('User exists!')
      return res.redirect('/')
    }
    else {
      var user = new User(_user)
      user.save(function(err,user){
        if(err){
            console.log(err)
        }
      res.redirect('/admin/userlist')
     })
     }
  })
})
//user sign in
app.post('/user/signin', function(req,res){
  var _user = req.body.user
  var name = _user.name
  var password = _user.password

  User.findOne({name:name}, function(err, user){
    if(err){
      console.log(err)
    }
    if(!user){
      console.log('User does not exist!')
      return res.redirect('/')
    }

    user.comparePassword(password, function(err, isMatch){
      if(err){
        console.log(err)
      }
      if(isMatch){
        console.log('Password is matched')
        req.session.user = user
        return res.redirect('/')
      }
      else{
        console.log('Password is not matched')
      }
    })
  })
})

//userlist
app.get('/admin/userlist',function(req, res) {
  User.fetch(function(err, users){
    if(err){
      console.log(err)
   }
    res.render('userlist',{
      title:'user list',
      users:users
    })
  })
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
