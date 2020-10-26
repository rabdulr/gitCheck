const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const {getUserByGitHubId, createUser} = require('../db')

passport.serializeUser(function(user, done) {
  done(null, user.gitHubId);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await getUserByGitHubId(id);
    done(null, user);
  } catch (error) {
    throw error
  }
});

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const user = await getUserByGitHubId(profile.id);
      if (user) {
        done(null, user)
      } else {
        const newUser = await createUser({username: profile.username, gitHubId: profile.id, accessToken})
        done(null, newUser)
      }
    } catch (error) {
      throw error
    }
}))
