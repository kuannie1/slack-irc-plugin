var slackbot = require('./lib/bot');
var http = require('http');
var querystring = require('querystring');

var config = {
    server: 'irc.freenode.com',
    nick: '_slack_bot',
    username: 'mslackbot612',
    token: '', //no use
    income_url: '',
    outcome_token: '',
    channels: {
        '#g0v.tw': '#g0v_tw'
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

      if (payload.token == config.outcome_token && payload.user_name != 'slackbot') {
        var ircMsg = "<" + payload.user_name + "> " + payload.text;
        var channel = Object.keys(config.channels)[0];

        slackbot.speak(channel, ircMsg);
        res.end('done');
      }
      res.end('request should not be from slackbot or must have matched token.')
    });
  } else {
    res.end('recieved request (not post)');
  }
});

server.listen(5555);
console.log("Server running at http://localhost:5555/");
