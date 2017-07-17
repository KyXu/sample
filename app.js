var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')
var port = process.env.PORT || 3000
var app = express()
var bodyParser = require('body-parser')

app.set('views', './views/pages')
app.set('view engine','jade')
//app.use(serveStatic('node_modules'))
app.use(require('body-parser').urlencoded({extended: true}))
app.listen(port)

console.log('imooc started on port: ' + port)

//index page
app.get('/',function(req, res) {
  res.render('index',{
    title:'tracking first page',
    movies:[{
      title:"Movie1",
      _id:1,
      poster:'http://www.lwflooring.com/images/florence-sj-%20(24)-u672875-fr.jpg?crc=4057721877'
    },{
      title:"Movie2",
      _id:2,
      poster:'http://www.lwflooring.com/images/florence-sj-%20(24)-u672875-fr2.jpg?crc=3922281833'
    },{
      title:"Movie3",
      _id:3,
      poster:'http://www.lwflooring.com/images/florence-sj-%20(24)-u672875-fr3.jpg?crc=4075626246'
    },{
      title:"Movie4",
      _id:4,
      poster:'http://www.lwflooring.com/images/florence-sj-%20(24)-u672875-fr3.jpg?crc=4075626246'
    },{
      title:"Movie5",
      _id:5,
      poster:'http://www.lwflooring.com/mages/florence-sj-%20(24)-u672875-fr4.jpg?crc=516667865'
    },{
      title:"Movie6",
      _id:6,
      poster:'http://www.lwflooring.com/venice.html'
    }]
  })
})
//detail page
app.get('/movie/:id',function(req, res) {
  res.render('detail',{
    title:'tracking detail page',
    movie:{
      director:'dddddd',
      country:'America',
      title:'venice',
      year:'2014',
      poster:'http://www.lwflooring.com/venice.html',
      language:'English',
      flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
      summary:'sadfsadfsafs'
    }
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

app.get('/admin/list',function(req, res) {
  res.render('list',{
    title:'list',
    movies:[{
      title:'venice',
      _id: 1,
      director: 'dddddd',
      country: 'America',
      year: 2014,
      language:'English',
      flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf'
    }]
  })
})
