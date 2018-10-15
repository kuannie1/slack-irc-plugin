var textFromSlack = require('./utils').textFromSlack;
var config = {
  outcome_token: process.env.OUTCOME_TOKEN || '',
  id: process.env.TRANSLATOR_ID || ''
};

function test(payload) {
  return payload.token === config.outcome_token && payload.bot_id === config.id;
}

function parse(payload, channels, users) {
  var user_name = payload.bot_name.replace(/ \(.*/, '');
  return '<' + user_name + '> ' + textFromSlack(payload.text, channels, users);
}

module.exports = {
  test: test,
  parse: parse
};
