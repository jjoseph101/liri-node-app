//use strict
"use strict";

//initialize external libraries
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");

//initialize twitter keys file
var keys = require("./keys.js");

//initialize twitter keys
var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

//grab command-line arguments
var commandType = process.argv[2];
var mediaInput = process.argv[3];

//switch function to read command line arguments
function commandRead (commandType, mediaInput) {
	switch (commandType) {
		case "my-tweets":
			myTweets ();
			break;
		case "spotify-this-song":
			mySpot (mediaInput);
			break;
		case "movie-this":
			movieInfo (mediaInput);
			break;
		case "do-what-it-says":
			doIt (commandType);
			break;
		default:
			fs.appendFile("log.txt", "\r\n-User did not enter in a correct command.");
			console.log("Command Input not supported: " + commandType);
			break;
	};
};

//function to display last tweets
function myTweets () {
	client.get('statuses/user_timeline', function(error, tweets, response) {
  		if (error) throw error;
  		fs.appendFile("log.txt", "\r\n-Ran command to display last tweets");
  		for (var j=0; j<20; j++) {
  			console.log("Tweet #" + [20-j] + ":" + tweets[j].text);
  		};
	});
};

//function to display song info
function mySpot (mediaInput) {
	if (typeof mediaInput == 'undefined') {
		mediaInput = "The Sign";
	};
	spotify.search({ type: 'track', query: mediaInput }, function(error, data) {
	    	if (error) {
	        	console.log('Error occurred: ' + error);
	        	return;
	    	}; 
	    	console.log(JSON.stringify(data, null, 2));
	  		fs.appendFile("log.txt", "\r\n-Ran spotify for the following song: " + mediaInput);
		});
};

//function to display movie info
function movieInfo (mediaInput) {
	if (typeof mediaInput == 'undefined') { //if movie title entered
		mediaInput = "Mr.Nobody";
	};
	request('http://www.omdbapi.com/?t='+mediaInput+'&y=&plot=full&r=json', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			fs.appendFile("log.txt", "\r\n-Ran OMDB for the following movie: " + mediaInput);
		};
	});
};

//function to read from file to determine command execution
function doIt () {
	fs.readFile("random.txt", "utf8", function(error, data){
        console.log(data);
        var string=data;
        var commandTxt = string.split(",");
        commandType=commandTxt[0];
        mediaInput=commandTxt[1]; 
        commandRead(commandType, mediaInput);
    });
};

//start everything
commandRead(commandType, mediaInput);