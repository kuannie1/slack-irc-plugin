var slackbot = require('./lib/bot');
var http = require('http');
var querystring = require('querystring');

var config = {
    server: 'irc.freenode.com',
    nick: '_slack_bot',
    username: 'mslackbot612',
    token: '',
    income_url: '',
    outcome_token: '',
    channels: {
        '#startups.tw': '#irc_startuptw'
    },
    users: {
    },
    // optionals
    floodProtection: true,
    silent: false // keep the bot quiet
};

var slackbot = new slackbot.Bot(config);
slackbot.listen();


var server = http.createServer(function (req, res) {
  if (req.method == 'POST') {
    req.on('data', function(data) {
      var payload = querystring.parse(data.toString());
      if (payload.token == '' && payload.user_name != 'slackbot') {
        //console.log('valid post from slack!');
        var ircMsg = "" + payload.user_name + "_: " + payload.text;
        //console.log("attempt to post to irc: ", ircMsg);
        slackbot.speak('#startups.tw', ircMsg);
      }
    });
  } else {
    console.log('recieved request (not post)');
  }
  res.end('done');
});

server.listen(5555);
console.log("Server running at http://localhost:5555/");
