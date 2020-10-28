const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const {getUserByGitHubId, createUser, updateUserToken} = require('../db')

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
    callbackURL: 'https://red-gitcheck.herokuapp.com/auth/github/callback'
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const user = await getUserByGitHubId(profile.id);
      if (user) {
        const {id} = user
        const updatedUser = await updateUserToken({id, accessToken})
        done(null, updatedUser)
      } else {
        const newUser = await createUser({username: profile.username, gitHubId: profile.id, accessToken})
        done(null, newUser)
      }
    } catch (error) {
      throw error
    }
}))
