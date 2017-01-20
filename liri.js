
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

//function to read command execution from file
function doIt () {
	fs.readFile("random.txt", "utf8", function(error, data){
        console.log(data);
        string=data;
        commandTxt = string.split(",");
        commandType=commandTxt[0];
        mediaInput=commandTxt[1]; 
        commandRead(commandType, mediaInput);
    }); 

};

//function to display last twenty tweets
function myTweets () {
	client.get('favorites/list', function(error, tweets, response) {
  		if(error) throw error;
  		console.log(JSON.stringify(tweets, null, 2));
  		fs.appendFile("log.txt", "\r\n-Ran command to display last twenty tweets");
	});
};

//function to display song info
function mySpot (mediaInput) {
	spotify.search({ type: 'track', query: mediaInput }, function(err, data) {
    	if ( err ) {
        	console.log('Error occurred: ' + err);
        	return;
    	}; 
    	console.log(JSON.stringify(data, null, 2));
  		fs.appendFile("log.txt", "\r\n-Ran spotify for the following song: " + mediaInput);
	});
};

//function to display movie info
function movieInfo (mediaInput) {
	if (typeof mediaInput !== 'undefined') { //if movie title entered
		request('http://www.omdbapi.com/?t='+mediaInput+'&y=&plot=full&r=json', function (error, response, body) {
  			if (!error && response.statusCode == 200) {
    			console.log(body);
    			fs.appendFile("log.txt", "\r\n-Ran OMDB for the following movie: " + mediaInput);
  			};
		});
	} else { //if movie title not entered return info for "Mr. Nobody"
		request('http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=full&r=json', function (error, response, body) {
  			if (!error && response.statusCode == 200) {
    			console.log(body);
    			fs.appendFile("log.txt", "\r\n-Ran OMDB for the following movie: Mr.Nobody");
  			};
		});
	};
};

//function to read command line arguments
function commandRead (commandType, mediaInput) {
	if (commandType=="my-tweets") {
		myTweets();
	} else if (commandType=="spotify-this-song") {
		mySpot (mediaInput);
	} else if (commandType=="movie-this") {
		movieInfo (mediaInput);
	} else if (commandType=="do-what-it-says") {
		doIt (commandType);
	} else {
		//invalid commands passed
		console.log("You did not enter a correct preset command.  Please try again.");
		fs.appendFile("log.txt", "\r\n-User did not enter in a correct command.");
		return;
	};
};

//start everything
commandRead(commandType, mediaInput);