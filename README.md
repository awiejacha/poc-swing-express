# poc-swing-express

# Motivation

To be well-prepared for the mob coding session. I am going to break down some coding with my peers,
and I'm most probably not as experienced as my peers. Let's try to fill some gaps, show some respect and dedication.

# Install and run

## Add APIs environment variables

1. Go to `_docker` directory
2. Add `.env` file
3. Put there the following:
```dotenv
JWT_SECRET=jwt_secret
SAMPLE_ECHO_REQUEST_URL=https://postman-echo.com/get
SAMPLE_ECHO_REQUEST_API_KEY=7855976945
SAMPLE_ECHO_REQUEST_API_SECRET="~secret"
```

## Build

```shell
docker compose run --rm app ci
```

## Run

```shell
docker compose up --force-recreate
```

# API

## TL;DR

Grab Postman [collection](./_postman/collection.json).
Import and have fun. Everything should be set up, including JWT authorization

## Security

API is secured by the Helmet package, that sets the security headers.

## Authorization

You need to pass JWT Bearer header. Set JWT secret in the dotenv file, as described above.
