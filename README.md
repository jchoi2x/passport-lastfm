# passport-lastfm
Last.fm authentication strategy for Passport and Node.js.


## Usage


```
passport.use(new LastFmStrategy({ 'api_key': LASTFM_KEY, 'secret': LASTFM_SECRET, }, function(req, sessionKey, done) {
  // Find/Update user's lastfm session
  User.findById(req.user.id, (err, user) => {
    if (err) return done(err);

    user.tokens.push({type:'lastfm', username:sessionKey.username, key:sessionKey.key });
    user.lastfm = sessionKey.key;

    user.save(function(err){
      if (err) return done(err);
      req.flash('success', {msg:"Last.fm authentication success"});
      return done(err, user, sessionKey);
    })
  });
}));

```


```
app.get('/auth/lastfm', passport.authenticate('lastfm'));
app.get('/auth/lastfm/callback', function(req, res, next){
  passport.authenticate('lastfm', {failureRedirect:'/'}, function(err, user, sesh){
    res.redirect('/');
  })(req, {} );
});

```
