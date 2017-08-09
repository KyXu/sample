var Movie = require('../models/movie.js')

//index page
exports.index = function(req, res) {
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
}
