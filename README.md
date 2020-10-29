# gitCheck

[gitCheck](http://https://red-gitcheck.herokuapp.com/) is an application that enables instructors to gauge engagement through student commits of forked projects.

## About the Project

Gauging engagement for a remote class can be difficult. There is only so much information that can be gained from projects and classes themselves. I designed this application
out of the desire to see how students are tackling projects by grabbing commit information from GitHub and and aggregating commits.

## Built With

* [React](http://reactjs.org)
* [React-Router](http://reactrouter.com)
* [React-Bootstrap](http://react-bootstrap.netlify.app)
* [Material-Table](http://material-table.com)
* [Express](http://expressjs.com)
* [Node](http://nodejs.org/en/)
* [Passport](http://passportjs.org)
* [Redis](http://redis.io)
* [Bluebird](http://bluebirdjs.com)
* [PostgreSQL](https://www.postgresql.org/)

## Cloning gitCheck

You will need to create an OAuth application configured with [GitHuh](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/authorizing-oauth-apps). This build utilizes two instances for development and production. 

## Installation

1. Clone the repo
```sh
git clone https://github.com/rabdulr/gitCheck.git gitCheck
```
2. Install NPM packages
```sh
npm install
```
3. Create a database utilizing PostgreSQL and create tables
'''sh
createdb git-check
----
npm run seed
'''
4. Change callback routes within the api/github.js and api/passport-setup.js
5. Configure your .env file with GitHub OAuth information
