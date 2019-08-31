# Birthday chat bot


Birthday chat bot using Node.js, Express, redis, docker and MongoDB.

![alt text](https://i.imgur.com/zm3v6Bh.png)

## Goal

The goal is to create a Messenger bot in Node.js. The app should:
- Be able to set up a Messenger webhook
- When a user starts a conversation, ask few questions:
1. User's first name
2. Birth date
3. If the user wants to know how many days till his next birtday. This is a yes/no answer
and the bot should accept both user text answer („yes", „yeah", „yup”, "no”, "nah", etc.)
and quick reply buttons. To make it simpler, you can assume there's only one valid
date format: YYYY-MM-DD
- if user says yes to the last question, send him a message: ```There are <N> days left until your next birthday```
- if user says no, just say: Goodbye
- Within the same app, create a REST endpoint ```/messages``` that lists all messages received
from users
- Create a REST endpoint for viewing a single message by its ID and also for deleting a
single message.

## Features

 - [Docker](https://www.docker.com/) support
 - [Redis](https://redis.io/) using redis pub/sub for implement web hook
 - [Commander](https://github.com/tj/commander.js) command-line interfaces made easy
 - Continuous integration support with [travisCI](https://travis-ci.org)
 - [Inquirer](https://github.com/SBoudrias/Inquirer.js) A collection of common interactive command line
 - CORS enabled
 - Uses [yarn](https://yarnpkg.com)
 - Express + MongoDB ([Mongoose](http://mongoosejs.com/))
 - Consistent coding styles with [editorconfig](http://editorconfig.org)
 - Uses [helmet](https://github.com/helmetjs/helmet) to set some HTTP headers for security
 - Load environment variables from .env files with [dotenv](https://github.com/rolodato/dotenv-safe)
 - Request validation with [joi](https://github.com/hapijs/joi)
 - Gzip compression with [compression](https://github.com/expressjs/compression)
 - Linting with [eslint](http://eslint.org)
 - Tests with [mocha](https://mochajs.org), [chai](http://chaijs.com) and [sinon](http://sinonjs.org)
 - Code coverage with [istanbul](https://istanbul.js.org) and [coveralls](https://coveralls.io)
 - Git hooks with [husky](https://github.com/typicode/husky) 
 - Logging with [morgan](https://github.com/expressjs/morgan)
 - API documentation generation with [swagger](https://swagger.io)
 - Monitoring with [pm2](https://github.com/Unitech/pm2)

## Requirements

 - [Node v7.6+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
 - [Yarn](https://yarnpkg.com/en/docs/install)

## Getting Started

Clone the repo and make it yours:

```bash
git clone git@github.com:miladr0/steve-chat-bot.git
cd steve-chat-bot

```

Install dependencies:

```bash
yarn
```

Set environment variables:

```bash
cp .env.example .env
```

## Running Locally
App consist of two parts (need two terminal for running), api part and cli bot part.
- To start api part (expressJs) :
```bash
yarn dev
```

- To start bot part :<br>
inside new terminal (don't close or stop api part) run below command
```bash
yarn bot
```
## Running in Docker

App consist of two parts (need two terminal for running), api part and cli bot part.
- To start api part (expressJs) :
```bash
yarn docker:dev
```

- To start bot part :<br>
inside new terminal (don't stop api part) run below commands:
```bash
docker exec -it <replace_with_app_container_name> sh  
```
```bash
yarn bot 
```
## Setup webhook
Request link below with url body parameter. for better document on how to setup webhook open up [Swagger generated document](#Documents) .
 ```bash
[POST] http://localhost:3000/v1/messages/set-web-hook
 ```
## Lint

```bash
# lint code with ESLint
yarn lint

# try to fix ESLint errors
yarn lint:fix

# lint and watch for changes
yarn lint:watch
```

## Test

```bash
# run all tests with Mocha
yarn test

# run integration tests
yarn test:integration
```

## Validate

```bash
# run lint and tests
yarn validate
```

## Documents
available at:
 ```bash
[GET] http://localhost:3000/api-docs
 ```
![alt text](https://i.imgur.com/55hCyKE.png) 
