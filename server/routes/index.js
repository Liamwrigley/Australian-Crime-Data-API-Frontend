var express = require('express');
var router = express.Router();

//Auth token
const jwt = require('jsonwebtoken');

//Password hashing
const bcrypt = require('bcrypt');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Crime Data' });
});

/* API endpoint. */
router.get('/api', function(req, res, next) {
  res.render('index', { title: 'Please see localhost/docs for enpoint information' });
});

/* POST register */
router.post('/api/register', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({"message": "error creating new user - you need to supply both an email and password"});
    console.log("Error on request body:", JSON.stringify(req.body));
  } else {
    const email = req.body.email;
    const unhashed_password = req.body.password;
    bcrypt.hash(unhashed_password, 10, function(err, hash) {
      req.db('users').insert({ email: email, password: hash })
      .then(_ => {
        res.status(201).json({"message": "yay! you've successfully registered your user account :)"})
      }).catch(error => {
        res.status(400).json({"message": "oops! It looks like that user already exists :("});
      })
    });
  };
})

/* POST login */
router.post('/api/login', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(401).json({"message": "invalid login - you need to supply both an email and password"});
  } else {
    const email = req.body.email;
    const unhashed_password = req.body.password;
    req.db('users').where({email: email}).pluck('password')
    .then((DBpassword) => {
      bcrypt.compare(unhashed_password, DBpassword[0]).then(pass => {
        if (pass) {
          var token = jwt.sign({ email }, 'super_secret_key', {expiresIn: "1 day"});
          res.status(200).json({"access_token": token, "token_type": "Bearer", "Expires_in": 86400})
        } else {
          res.status(401).json({"message": "invalid login - bad password"});
        }
      }).catch(error => {
        res.status(401).json({"message": "oh no! It looks like that user doesn't exist... "});
      })
    })
  };
})


/* GET search */
router.get('/api/search?', function(req, res, next) {

  // const header = req.headers["Authorization"];
  //check header exists
  // if (typeof header !== 'undefined') {
    // const splitHeader = header.split(' ');
    // const token = splitHeader[1];
    // req.token = token;
  // } else {
    // res.status(401).json({"error": "oops! it looks like you're missing the authorization header", "message": "oops! it looks like you're missing the authorization header"});
  // }

  // jwt.verify(req.token, 'super_secret_key', (err) => {
    // if (err) {
      // res.status(401).json({"error": "oh no! it looks like your authorization token is invalid...", "message": "oh no! it looks like your authorization token is invalid..."});
    // } else {
      var queryString = {
        "offence" : decodeURI(req.query.offence).split(" ").join("").toLowerCase(),
        "area" : decodeURI(req.query.area),
        "age" : decodeURI(req.query.age),
        "gender" : decodeURI(req.query.gender),
        "year" : decodeURI(req.query.year),
        "month" : decodeURI(req.query.month)
      }
      //remove blanks
      Object.keys(queryString).forEach((key) => (queryString[key] == "") && delete queryString[key])

      req.db.distinct().from('offences')
        .select(`offences.area as LGA`)
        .sum(`${queryString.offence} as total`)
        .select('areas.lat', 'areas.lng').join('areas', 'areas.area', '=', 'offences.area').groupBy('offences.area')
        .modify(function(queryBuilder) {
          for (var property in queryString) {
            if (queryString.hasOwnProperty(property)) {
              if(property != 'offence') {
                queryBuilder.where(`offences.${property}`, queryString[property])
              }
            }
          }
        })
      .then((rows) => {
        res.json({"query":queryString,"result":rows});
      })
      .catch((err) => {
        res.status(500).json({"error": "oh no! It looks like there was a database error while performing your search, give it another try...", "message": "oh no! It looks like there was a database error while performing your search, give it another try..."});
      })
    // }})
});

/* --------------- ALL SIMPLE GET REQUESTS --------------- */

/* GET areas */
router.get('/api/areas', function(req, res, next) {
  req.db.from('areas').pluck("area")
  .then((rows) => {
    res.json({"areas" : rows});
  })
  .catch((err) => {
    res.json({"Error" : true, "Message" : "Error in MySQL query"});
  })
});

/* GET offences */
router.get('/api/offences', function(req, res, next) {
  req.db.from('offence_columns').pluck('pretty')
  .then((rows) => {
    res.json({"offences" : rows});
  })
  .catch((err) => {
    res.json({"Error" : true, "Message" : "Error in MySQL query"});
  })
});

/* GET ages */
router.get('/api/ages', function(req, res, next) {
  req.db.from('offences').distinct('age').pluck('age')
  .then((rows) => {
    res.json({"ages" : rows});
  })
  .catch((err) => {
    res.json({"Error" : true, "Message" : "Error in MySQL query"});
  })
});

/* GET genders */
router.get('/api/genders', function(req, res, next) {
  req.db.from('offences').distinct('gender').pluck('gender')
  .then((rows) => {
    res.json({"genders" : rows});
  })
  .catch((err) => {
    res.json({"Error" : true, "Message" : "Error in MySQL query"});
  })
});

/* GET years */
router.get('/api/years', function(req, res, next) {
  req.db.from('offences').distinct('year').pluck('year')
  .then((rows) => {
    res.json({"years" : rows});
  })
  .catch((err) => {
    res.json({"Error" : true, "Message" : "Error in MySQL query"});
  })
});

/* GET months */
router.get('/api/months', function(req, res, next) {
  req.db.from('offences').distinct('month').pluck('month')
  .then((rows) => {
    res.json({"months" : rows});
  })
  .catch((err) => {
    res.json({"Error" : true, "Message" : "Error in MySQL query"});
  })
});


module.exports = router;
