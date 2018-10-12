function textFromSlack(text, channels, users) {
  // old regexp:
  //   "[-a-z0-9@:%_\+\.~#?&//=]{2,256}.[a-z]{2,4}\b\/[-a-z0-9@:%_\+.~#?&//=]*"
  // var url = "[-a-z0-9@:%_\\+\.~#?&//=]{2,256}\\.[a-z]{2,4}\\b\\/[-a-z0-9@:%_\\+.~#?&//=]*";
  // var re = new RegExp("<(" + url + ")>","gi");

  return text.replace(/<#C\w{8}>/g, function (matched) {
    // Channel ID -> Channel Name
    var channel_id = matched.match(/#(C\w{8})/)[1];
    return '#' + channels[channel_id];
  }).replace(/<@U\w{8}>/g, function (matched) {
    // Member ID -> Member Name
    var member_id = matched.match(/@(U\w{8})/)[1];
    return '@' + users[member_id];
  })
    .replace(/&amp;/g,'&')
    .replace(/&lt;/g,'<')
    .replace(/&gt;/g, '>')
    // links
    .replace(/<(https:\/\/[-a-zA-Z0-9@:%_+.~#?&=\/]*)(?:\|([^>]*))?>/g, '$1')
    // channels
    .replace(/<#\w+\|([-a-zA-Z0-9_]+)>/g, '#$1');
};

module.exports = {
  textFromSlack: textFromSlack
};
