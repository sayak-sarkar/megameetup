var express = require('express');
var bodyParser = require('body-parser');
var EVENT_GROUP = require('./config.js');
var exphbs  = require('express-handlebars');
var assert = require('assert');
var http = require('http');
var url = require('url');
var oauth_token;

var app = express();
 

assert(process.env.MEETUP_OAUTH, 'MEETUP_OAUTH variable isn\'t set on enviroment (use \'set \"MEETUP_OAUTH={\'key\': \'your_token\', \'secret\': \'your_secret\'}\"\' on Windows)');

var meetup = require('meetup-api')({
    oauth: JSON.parse(process.env.MEETUP_OAUTH)
});


// you can pass the key using
// meetup.authkey = {key: 'keyvalue', secret: 'secretvalue'};
// if the authkey is set `meetup.authkey === true`

// Create an HTTP server
var server = http.createServer(function(request, response) {
    var uri = url.parse(request.url, true);

    oauth_token = oauth_token || uri.query.access_token || uri.query.code;
    if (oauth_token) {
        meetup.getOAuth2AccessToken(oauth_token, function(error) {
            if (error) {
                console.warn(error);
                if (error.statusCode === 400) {
                    console.info('INFO: This error is because no HTTPS!');
                }
            }

            meetup.dashboard({}, function(err, obj) {
                if (err) {
                    response.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify(err));
                } else {
                    response.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    response.end(JSON.stringify(obj));
                }
            });
        });
    } else {
        meetup.getOAuth2RequestToken({
            redirect: 'http://localhost:8000/'
        }, function(error, Url) {
            if (!error) {
                response.writeHead(302, {
                    Location: Url
                });
                response.end();
            } else {
                response.writeHead(500, {
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify(error));
            }
        });
    }
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function (request, response) {
  
  var EVENT_TO_COPY = request.body.event.id;
  
  const original = EVENT_GROUP.filter(event => event.label == request.body.original);
  const copy = EVENT_GROUP.filter(event => event.label == request.body.copy);
  
  var FROM_MEETUP = original[0];
  var TO_MEETUP = copy[0];
  
  meetup.getEvent({
    'urlname': FROM_MEETUP.name,
    'id': EVENT_TO_COPY
  }, function(err, meetupResponse) {
    
    if (err) {
      console.log(err);
    } else {
      console.log('got meetup info!');
      console.log(meetupResponse);
    } 
  
    var newEventParams = {      
      'name': meetupResponse.name,
      'description': meetupResponse.description,
      'group_id': TO_MEETUP.id,
      'group_urlname': TO_MEETUP.name,
      'time': meetupResponse.time,      
      'venue_id': meetupResponse.venue.id,
      'announce': false,
      'publish_status': 'draft'
    };
    
    meetup.postEvent(newEventParams, function(creationError, creationResponse) {
      if (creationError) {
        console.log(creationError);
      } else {
        // TODO return URL of event object just created and providing link to event in Meetup.com        
        console.log(creationResponse);
      }
    });
    
  });
  
  response.render('home', {
    eventGroup: EVENT_GROUP,
    title: 'Meetup Crosspost API',
    message: 'We did it!'
  });
});


// // http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  // response.sendFile(__dirname + '/views/index.html');
  response.render('home', {
    eventGroup: EVENT_GROUP,
    title: 'Meetup Crosspost API'
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
