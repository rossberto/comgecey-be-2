const express = require('express');
const app = express();

module.exports = app;

const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const multer = require('multer');
const helmet = require('helmet');

const PORT = process.env.PORT || 4000; // For localhost: 4000; / For Heroku server: 3306

const apiRouter = require('./api/api');
/*
var whitelist = ['https://app.comgecey.org', 'https://comgecey.org/registro']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
*/
app.use(bodyParser.json());
/*
app.use(cors({
  origin: corsOptions
}));
*/
app.use(cors())
app.use(errorhandler());
app.use(morgan('dev'));


//const upload = multer({dest: 'images/'});
/*
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    console.log(file);
    type = file.mimetype.split('/');
    cb(null, file.fieldname + '-' + Date.now() + '.' + type[1]);
  }
})

const upload = multer({storage: storage});

//single('myFile')
app.post('/uploadfile', upload.single('file'), (req, res, next) => {
  console.log('dos');
  console.log(req.file);
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)

  }
  res.send(file)
})

app.use('/imgs', express.static('images'));
*/

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["http://localhost:3000"],
    },
  })
);

app.use('/api', apiRouter);

app.listen(PORT, console.log('Comgecey server listening at port: ' + PORT));
