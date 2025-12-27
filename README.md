
# Forito ✨

Forito is a place where you can spit out your ideas ✍️


## Link

https://forito.vercel.app/


## Run Locally

Clone the project

```bash
  git clone https://github.com/NachoKai/forito-server
```

Go to the project directory

```bash
  cd forito-server
```

Install dependencies

```bash
  yarn install
```

Copy the environment variables

```bash
  cp .env.example .env
```

Start the Server in development mode

```bash
  yarn start:dev
```

Or build and start in production mode

```bash
  yarn build
  yarn start:prod
```

Runs the app in the development mode.
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Running Tests

To run tests, run the following command

```bash
  yarn test
```

To run tests with coverage

```bash
  yarn test:cov
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` - Server port (default: 5000)
`MONGODB_URI` - MongoDB connection string
`SECRET` - JWT secret key
`SALT` - Bcrypt salt rounds (default: 12)
`THROTTLE_TTL` - Rate limit time window in seconds (default: 60)
`THROTTLE_LIMIT` - Rate limit max requests per window (default: 100)

## Tech Stack

NestJS, TypeScript, MongoDB, Mongoose, JWT, Passport, Class Validator


## Feedback

If you have any feedback, please reach out to me at ignacio.caiafa@gmail.com


## Contributing

Contributions are always welcome! [Project Kanban Board](https://github.com/NachoKai/forito/projects/1)


## Authors

- [@NachoKai](https://www.github.com/NachoKai)


## 🚀 About Me

Hi, I'm Nacho! 👋 I'm a software developer from Argentina 🇦🇷


## License

[MIT](https://github.com/NachoKai/forito/blob/main/LICENSE)
