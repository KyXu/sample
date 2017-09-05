var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Store = require('../app/controllers/store')
var Customer = require('../app/controllers/customer')
module.exports = function(app){

    //pre handle user
    app.use(function(req, res, next){
      var _user= req.session.user
      app.locals.user = _user
      next()
  })

    //index page
    app.get('/', Index.index)

    // User
    app.post('/user/signup', User.signup)
    app.post('/user/signin', User.signin)
    app.get('/signin', User.showSignin)
    app.get('/signup', User.showSignup)
    app.get('/logout', User.logout)
    app.get('/admin/userlist', User.signinRequired, User.adminRequired,User.list)

    //Product
    app.get('/movie/:id',Movie.detail)
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
    app.get('/admin/update/:id', User.signinRequired, User.adminRequired, Movie.update)
    app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save)
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

    //Comment
    app.post('/user/comment', User.signinRequired, Comment.save)

    //Store
    app.get('/admin/store/new', User.signinRequired, User.adminRequired, Store.new)
    app.post('/admin/store', User.signinRequired, User.adminRequired, Store.save)
    app.get('/admin/store/list', User.signinRequired, User.adminRequired, Store.list)


    //Customer
    app.get('/admin/customer', User.signinRequired, User.adminRequired, Customer.list)
    app.post('/admin/upload', function(req, res, next) {
        var form = new formidable.IncomingForm();
        //Formidable uploads to operating systems tmp dir by default
        form.uploadDir = "img";       //set upload directory
        form.keepExtensions = true;     //keep file extension
        form.parse(req, function(err, fields, files) {
          res.writeHead(200, {'content-type': 'text/plain'});
          res.write('received upload:\n\n');
          console.log("form.bytesReceived");
          //TESTING
          console.log("file size: "+JSON.stringify(files.fileUploaded.size));
          console.log("file path: "+JSON.stringify(files.fileUploaded.path));
          console.log("file name: "+JSON.stringify(files.fileUploaded.name));
          console.log("file type: "+JSON.stringify(files.fileUploaded.type));
          console.log("astModifiedDate: "+JSON.stringify(files.fileUploaded.lastModifiedDate));
          //Formidable changes the name of the uploaded file
          //Rename the file to its original name
          fs.rename(files.fileUploaded.path, './img/'+files.fileUploaded.name, function(err) {
            if (err)
              throw err;
            console.log('renamed complete');
          });
          res.end();
        });
      });
}
