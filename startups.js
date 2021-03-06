var slackbot = require('./lib/bot');
var middlewares = require('./middlewares');
var http = require('http');
var querystring = require('querystring');
var request = require('request');

var config = {
    server: 'irc.freenode.com',
    nick: 'slackbot',
    username: 'g0vslackbot',
    token: process.env.TOKEN ||'', // get from https://api.slack.com/web#basics
    income_url: process.env.INCOME_URL || '',
    outcome_token: process.env.OUTCOME_TOKEN || '',
    channels: {
        '#g0v.tw': '#general'
    },
    users: {
    },
    // optionals
    floodProtection: true,
    silent: false // keep the bot quiet
};

var slackUsers = {};
var slackChannels = {};

function updateLists () {
  request.get({
      url: 'https://slack.com/api/users.list?token=' + config.token
  }, function (error, response, body) {
    var res;

    try {
      res = JSON.parse(body);
    } catch (e) {
      console.log('failed to parse the member list:', body);
      console.error(e);
    }

    if (res && res.members) {
      console.log('members updated:', new Date());
      res.members.map(function (member) {
        slackUsers[member.id] = member.name;
      });
    }
  });

  request.get({
      url: 'https://slack.com/api/channels.list?token=' + config.token
  }, function (error, response, body) {
    var res;

    try {
      res = JSON.parse(body);
    } catch (e) {
      console.log('failed to parse the channel list:', body);
      console.error(e);
    }

    if (res && res.channels) {
      console.log('channels updated:', new Date());
      res.channels.map(function (channel) {
        slackChannels[channel.id] = channel.name;
      });
    }
  });

  setTimeout(function () {
    updateLists()
  }, 10 * 60 * 1000);
}

updateLists();
var slackbot = new slackbot.Bot(config);
slackbot.listen();

var server = http.createServer(function (req, res) {
  if (req.method == 'POST') {
    req.on('data', function(data) {
      var k, m, msg, channel, payload;

      payload = querystring.parse(data.toString());
      console.log('raw', payload);

      for (k in middlewares) {
        m = middlewares[k];
        if (m.test(payload)) {
          msg = m.parse(payload, slackChannels, slackUsers);
          if (msg) {
	    channel = Object.keys(config.channels)[0];
            console.log('msg', channel, msg);
            slackbot.speak(channel, msg);
          }
          break;
        }
      }

      res.end('done');
    });
  } else {
    res.end('recieved request (not post)');
  }
});

server.listen(5555);
console.log("Server running at http://localhost:5555/");
