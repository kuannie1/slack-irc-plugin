var config = {
  outcome_token: process.env.OUTCOME_TOKEN || '',
  id: process.env.BRIDGE_ID || ''
};

function test(payload) {
  return payload.token === config.outcome_token && payload.bot_id === config.id;
}

function parse(payload, channels, users) {}

module.exports = {
  test: test,
  parse: parse
};
