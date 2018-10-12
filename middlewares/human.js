var textFromSlack = require('./utils').textFromSlack;
var config = {
  outcome_token: process.env.OUTCOME_TOKEN || ''
};

function test(payload) {
  return payload.token === config.outcome_token;
}

function parse(payload, channels, users) {
  return '<' + payload.user_name + '> ' + textFromSlack(payload.text, channels, users);
}

module.exports = {
  test: test,
  parse: parse
};
