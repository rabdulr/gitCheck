const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const {getUserByGitHubId, createUser} = require('../db')

passport.serializeUser(function(id, done) {
  done(null, id);
});

passport.deserializeUser(function(id, done) {
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // })
  done(null, id)
});

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/github/callback'
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      console.log('profile: ', profile)
      const user = await getUserByGitHubId(profile.id);
      console.log('existing user: ', user)
      if (user) {
        done(null, profile.id)
      } else {
        const newUser = await createUser({username: profile.username, gitHubId: profile.id, accessToken})
        console.log('newUser: ', newUser);
        done(null, profile.id)
      }
    } catch (error) {
      throw error
    }
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }))
