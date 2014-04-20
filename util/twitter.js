var OAuth = require('oauth').OAuth
	,qs = require('qs');

function Twitter() {
	this.consumerKey = 'uVdXqyga5jgYhMxyH1oTDnttr';
    this.consumerSecret = 'iqOiVWmh3ugYyfIsGHl4hl25nqu0hhpqBsX8goe49NsyiTBFwc';
    this.accessToken = '635182768-6pYdpe3ygSemMBxufq15jx5Adxxj0eVgx4SI75BE';
    this.accessTokenSecret = 'aC3Vt1fySog1tOeBSje17mNkxoXPdFUhwi44OBVw9HtGE';
    this.callBackUrl = '/';
    this.baseUrl = 'https://api.twitter.com/1.1';
    this.oauth = new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        this.consumerKey,
        this.consumerSecret,
        '1.0',
        this.callBackUrl,
        'HMAC-SHA1'
    );
}

Twitter.prototype.doRequest = function (url, error, success) {
    this.oauth.get(url, this.accessToken, this.accessTokenSecret, function (err, body, response) {
        console.log('URL [%s]', url);
        if (!err && response.statusCode == 200) {
            success(body);
        } else {
            error(err, response, body);
        }
    });
};

Twitter.prototype.buildQS = function (params) {
    if (params && Object.keys(params).length > 0) {
        return '?' + qs.stringify(params);
    }
    return '';
};

Twitter.prototype.getTrends = function (params, error, success) {
    var path = '/trends/place.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};

Twitter.prototype.getTweets = function(params, error, success) {
	var path = '/search/tweets.json' + this.buildQS(params);
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}

exports.Twitter = Twitter;