# gitCheck

gitCheck is an application that enables instructors to gauge engagement through student commits of forked projects.

## About the Project

Gauging engagement for a remote class can be difficult. There is only so much information that can be gained from projects and classes themselves. I designed this application
out of the desire to see how students are tackling projects by grabbing commit information from GitHub and and aggregating commits. This is a project that has challenged me in
its design and application.

## Current State

This project is still a work in progress and has not yet been deployed.

## Built With

This is a React project utilizing many different components.
* [React](https://reactjs.org)
* [React-Router](https://reactrouter.com)
* [React-Bootstrap](https://react-bootstrap.netlify.app)
* [Express](http://expressjs.com)
* [Node](https://nodejs.org/en/)
* [Redis](https://redis.io)
* [React-Dropdown-Select](https://sanusart.github.io/react-dropdown-select/)

## Getting Started

This project is currently incomplete and has not been hooked up to a server. If you are testing this application, please create an .env file with a list of GitHub users as STUDENT_LIST 
and PROJECTS. Projects need the name of the Repo forked as well when the project first started. You will also have to create a keys for OAuth through GitHub if you are testing specifically 
for your application.

## Installation

1. Clone the repo
```sh
git clone https://github.com/rabdulr/gitCheck.git
```
2. Install NPM packages
```sh
npm install
```
3. Configure your .env file for hard coded listings

## Roadmap

1. Finish features for navigating the application
2. Attach to Postgres to create/save/update class information, students, and project lists.
