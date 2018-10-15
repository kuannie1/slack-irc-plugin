var translator = require('./translator');

function test(payload) {
  return translator.test(payload) && (payload.bot_name || '').match(/^system/);
}

function parse(payload, channels, users) {}

module.exports = {
  test: test,
  parse: parse
};
