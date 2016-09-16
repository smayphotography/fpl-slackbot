var fplbot = require('./fplbot')
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// test route
app.get('/', function (req, res) { res.status(200).send('Hello world!') });

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});


//app.get('https://fantasy.premierleague.com/drf/leagues-classic-standings/259929', function (req, res)
//	{res.status(200).send()});
//app.post('/hello', fplbot);

app.post('/standings', function (req, res) {
	request('https://fantasy.premierleague.com/drf/leagues-classic-standings/259929', function (error, response, body) {
		// manipulate the json
		var results = JSON.parse(response.body).standings.results;
		var leagueName = JSON.parse(response.body).league;
		var mappedResults = results.map(function (result) {
			return result.rank + ') ' + result.player_name + ' - ' + result.total;
		}).join('\n ');
		res.status(200).json({
			username: "JeffBot",
			text: 'The results for the ASP Fantasy League are as follows: \n' + mappedResults
		});
	});
})
