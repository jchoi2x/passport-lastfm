var util = require('util');
var Strategy = require('passport-strategy');
var LastfmAPI = require('lastfmapi');


function LastfmStrategy(options, verify){
	if (!options.api_key)  { throw new TypeError('LastfmStrategy requires a api_key option'); }
	if (!verify)  { throw new TypeError('LastfmStrategy requires verify callback'); }

	Strategy.call(this);

	this.name = 'lastfm';
	this.api_key = options.api_key;
	this.secret = options.secret;


	this._verify = verify;
	this._lastfm = new LastfmAPI({
		'api_key': this.api_key,
		'secret':this.secret
	});
}


LastfmStrategy.prototype.authenticate = function(request, options){
	var self = this;
	var authUrl = self._lastfm.getAuthenticationUrl() + `&cb=http://localhost:${process.env.PORT || 3000}/auth/lastfm/callback`;


	if (request.query && request.query.token){
    var token = request.query.token;

		this._lastfm.authenticate(request.query.token, function(er, session){
			if (!session) self.fail(session, 403);

			function verified(err, user, session){
        if (err)  self.error(err);
        else if (!user) self.fail(user, session);
        else self.success(user, session);
			}

			self._verify(request, session, verified);
		});
	}

	else if (!request.user){
		self.redirect('/login');
	}

	else{
		self.redirect(authUrl);
	}
}







util.inherits(LastfmStrategy, Strategy);



module.exports = exports = LastfmStrategy;