const twit = require('twit');
const request = require('request');

const Twit = new twit({
	consumer_key:         '', // Get from https://dev.twitter.com/
	consumer_secret:      '', // Get from https://dev.twitter.com/
	access_token:         '', // Get from https://dev.twitter.com/
	access_token_secret:  '', // Get from https://dev.twitter.com/
})

const discordWebHook = ''; // Put your Discord WebHooks link here.
const twitterUser = 'youtube'; // Put the twitter handle of the account you want to mirror here.


let recentTweet;
function sendWebhook(data) {
	profile_image_url = data.user.profile_image_url;
	profile_name = data.user.name;
	profile_screen_name = data.user.screen_name;
	
	tweet_id = data.id_str;
	tweet_link = `https://twitter.com/${profile_screen_name}/status/${tweet_id}`;
	
	const webhook = JSON.stringify({
		"avatar_url": profile_image_url,
		"username": profile_name,
		"content": tweet_link
	});
	
	const headers = {
	  	'Content-Type': 'application/json',
	  	"Content-Length": Buffer.byteLength(webhook)
	}
	
	const options = {
		url: discordWebHook,
		method: 'POST',
		headers: headers,
		body: webhook
	}

	request(options, function (error, response, body) {
		if (error || (response.statusCode !== 200 || response.statusCode !== 204)) {
			console.log('An error has occurred during the webhook request..');
			console.log(error);
			console.log(response.statusCode);
		}
	});
} 

function getTweetsFromUser() {
	const options = { 
		screen_name: twitterUser,
        count: 1 
    };
    
	Twit.get('statuses/user_timeline', options , function (err, data) {
	  for (let i = 0; i < data.length ; i++) {
		if(recentTweet !== data[i].text) sendWebhook(data[i]);
		recentTweet = data[i].text;
	  }
	})
}

function timer() {
    setTimeout(() => {
        getTweetsFromUser();
        timer();
    }, 5000);
}

timer();
