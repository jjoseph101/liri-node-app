
//initialize external libraries
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");
var commandTxt = [];

//initialize twitter keys file
var keys = require("./keys.js");

//initialize twitter keys
var consumerK = keys.twitterKeys.consumer_key;
var consumerS = keys.twitterKeys.consumer_secret;
var atK = keys.twitterKeys.access_token_key;
var atS = keys.twitterKeys.access_token_secret;

//extra step to initialize twitter keys
var client = new Twitter({
  consumer_key: consumerK,
  consumer_secret: consumerS,
  access_token_key: atK,
  access_token_secret: atS
});

//grab command-line argument
var commandType = process.argv[2];
var mediaInput = process.argv[3];

//sanity checking
console.log ("-----------------");
console.log(consumerK);
console.log(consumerS);
console.log(atK);
console.log(atS);
console.log(commandType);
console.log(mediaInput);
console.log ("==================");

//command execution
function doIt (commandType) {
	if (commandType==="do-what-it-says") {
		fs.readFile("random.txt", "utf8", function(error, data){
	        console.log(data);
	        string=data;
	        commandTxt = string.split(",");
	        commandType=commandTxt[0];
	        mediaInput=commandTxt[1]; 
	        commandRead(commandType, mediaInput);
	     });  
	};
};



//display last twenty tweets
function myTweets () {

		client.get('favorites/list', function(error, tweets, response) {
	  		if(error) throw error;
	  		console.log(JSON.stringify(tweets, null, 2));
		})};

//display song info
function mySpot (mediaInput) {

		spotify.search({ type: 'track', query: mediaInput }, function(err, data) {
	    	if ( err ) {
	        	console.log('Error occurred: ' + err);
	        	return;
	    	}; 
	    	console.log(JSON.stringify(data, null, 2));
})};

//display movie info
function movieInfo (mediaInput) {
		if (typeof mediaInput !== 'undefined') { //if movie title entered
			request('http://www.omdbapi.com/?t='+mediaInput+'&y=&plot=full&r=json', function (error, response, body) {
	  			if (!error && response.statusCode == 200) {
	    			console.log(body);
	  			};
			});
		} else { //if movie title not entered return info for "Mr. Nobody"
			request('http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=full&r=json', function (error, response, body) {
	  			if (!error && response.statusCode == 200) {
	    			console.log(body);
	  			};
			});
		}};

//command line arguments
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
		return;
}};

commandRead(commandType, mediaInput);