var request = require('request');

/**
 * Slack API wrapper
 * @param {object} config Slacker configuration
 * - token: Slack API token
 */
var Slacker = function (config) {
    this.token = config.token;
    this.income_url = config.income_url;
    this.outcome_token = config.outcome_token;
    return this;
};

/**
 * Send slack API request
 * @param  {string} method Slack API method
 * @param  {object} args POST arguments to send to Slack
 */
Slacker.prototype.send = function (method, args) {
    args = args || {} ;
    args.token = this.token;
    var orgname = 'noisebridge';
    request.post({
        //url: 'https://' + orgname + '.slack.com/services/hooks/incoming-webhook?token=' + this.token,
        //url: this.income_url,
        //json: args
        url: 'https://slack.com/api/' + method,
        json: true,
        form: args
    }, function (error, response, body) {
        if (error) {
            console.log('Error:', error || body.error);
        }
    });
};

exports.Slacker = Slacker;
