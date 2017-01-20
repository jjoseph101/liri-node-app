
//initialize external libraries
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");

//initialize twitter keys file
var keys = require("./keys.js");

//initialize twiter keys
var consumerK = keys.twitterKeys.consumer_key;
var consumerS = keys.twitterKeys.consumer_secret;
var atK = keys.twitterKeys.access_token_key;
var atS = keys.twitterKeys.access_token_secret;

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
if (commandType==="my-tweets") { //display last twenty tweets;
	client.get('favorites/list', function(error, tweets, response) {
  		if(error) throw error;
  		console.log(JSON.stringify(tweets, null, 2));
	});

} else if (commandType==="spotify-this-song") { //display song info;
	spotify.search({ type: 'track', query: mediaInput }, function(err, data) {
    	if ( err ) {
        	console.log('Error occurred: ' + err);
        	return;
    	}; 
    	console.log(JSON.stringify(data, null, 2));
	});

} else if (commandType==="movie-this") { //display movie info;
	if (typeof mediaInput !== 'undefined') { //if movie title entered
		request('http://www.omdbapi.com/?t='+mediaInput+'&y=&plot=full&r=json', function (error, response, body) {
  			if (!error && response.statusCode == 200) {
    			console.log(body) // Show the HTML for omdb response. 
  			};
		});
	} else { //if movie title not entered return info for "Mr. Nobody"
		request('http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=full&r=json', function (error, response, body) {
  			if (!error && response.statusCode == 200) {
    			console.log(body) // Show the HTML for omdb response. 
  			};
		});
	};

} else if (commandType==="do-what-it-says") { //do command in random.txt


} else {
	console.log("You did not enter a correct preset command.  Please try again.");
	return;
}