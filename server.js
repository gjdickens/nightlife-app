import path from 'path';
import express from 'express';
import webpack from 'webpack';
import middleware from './src/middleware';

import https from 'https';
import BodyParser from 'body-parser';
import Mongoose from 'mongoose';
import Passport from 'passport';
import PassportLocal from 'passport-local';
import Account from './src/models/account';
import Bar from './src/models/bar';

const app = express();

if(process.env.NODE_ENV === 'development') {
	const config = require('./webpack.config.dev');
	const compiler = webpack(config);
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath,
		stats: {
			assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
		}
	}));
	app.use(require('webpack-hot-middleware')(compiler));
	app.use(express.static(path.resolve(__dirname, 'src')));
}

else if(process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'dist')));
}

var port = process.env.PORT || 3000;

//Yelp API change to env variable
const yelpKey = process.env.YELP_KEY;

//configure MongoDB
const db = process.env.MONGOLAB_URI;

Mongoose.connect(db);

const conn = Mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
  console.log('database connected');
});

//initialize passport and body parser
const LocalStrategy = PassportLocal.Strategy;
app.use(Passport.initialize());
app.use(Passport.session());
app.use(BodyParser.urlencoded({ extended: true}));
app.use(BodyParser.json());


// passport config
Passport.use(new LocalStrategy(Account.authenticate()));
Passport.serializeUser(Account.serializeUser());
Passport.deserializeUser(Account.deserializeUser());



//API routes
app.post('/register', (req, res) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          console.log(err);
        }
        Passport.authenticate('local')(req, res, function () {
            res.json('register successful');
        });
    });
});

app.post('/login', Passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

app.post('/bars', (req, res) => {
	Bar.find({}, {timestamp: 1, bar_id: 1, username:1, _id: 0}).exec(function(err, bars) {
		var barArr = [];
		req.body.barArr.map(function(barId, i) {
			var newObj = {
				bar_id: barId,
				attendees: bars.filter(function(bar) {
					return bar.bar_id === barId;
				})
			}
			barArr.push(newObj);
		});
		res.json(barArr);
	});
});


app.post('/newBar', (req, res) => {

	var bar = new Bar();
	bar.bar_id = req.body.bar_id;
	bar.username = req.body.username;
	bar.timestamp = new Date();

	bar.save(function(err) {
		if (err) {res.send(err)};
		res.json({ message: 'Bar event created!'});
	});
})

app.delete('/deleteBar', (req, res) => {
	Bar.remove({
		bar_id: req.body.bar_id,
		username: req.body.username
	}, function(err, bar) {
		if (err) {res.send(err)};
		res.json({ message: 'Bar event deleted' });
	})
});

app.post('/search', function(req, res) {
		var queryString = req.body.searchQuery;
		if (queryString) {
			queryString = queryString.replace(/\s/g, '%20');
			var options = {
				host: 'api.yelp.com',
				path: '/v3/businesses/search?term=bars&location=' + queryString,
				headers: {
							'Authorization': yelpKey
					}
			};
			//API call
			https.get(options, function (apiRes) {
				var body = '';
				apiRes.on('data', function (d) {
					body += d;
				});
				apiRes.on('end', function (d) {
					var parsed = JSON.parse(body);
					var finalData = [];
	        for (var i = 0; i < parsed.businesses.length; i ++) {
	          var item = parsed.businesses[i];
	          var newItem = {
	            image_url: item['image_url'],
	            link_url: item['url'],
	            id: item['id'],
							location: item['location'],
							name: item['name']
	          };
	          finalData.push(newItem);
	        }
	        res.json(finalData);
				});

			}).on('error', function (e)  {
				console.error(e);
			});
		}
		else {
			res.json(message: "empty search string");
		}

});


app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/checkIp', function(req, res) {
  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
     res.json({ip: ip});
});

app.get('*', middleware);

app.listen(port, '0.0.0.0', (err) => {
	if(err) {
		console.error(err);
	} else {
		console.info('Listening at ' + port);
	}
});
