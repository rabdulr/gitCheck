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

const dev = process.env.NODE_EV === 'production' ? 'https://red-gitcheck.herokuapp.com/auth/github/callback' : 'http://localhost:3000/auth/github/callback'
const idReturn = process.env.NODE_EV === 'production' ? process.env.CLIENT_ID : process.env.CLIENT_ID2;
const secretReturn = process.env.NODE_EV === 'production' ? process.env.CLIENT_SECRET : process.env.CLIENT_SECRET2;

passport.use(new GitHubStrategy({
    clientID: idReturn,
    clientSecret: secretReturn,
    callbackURL: `${dev}`
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
