# remitano-testing-project

This is an application for sharing YouTube movies. Users can share their favorite movies and discover new ones. Includes register or login, refresh token, share a movie, view list movies, real-time notification when someone share a movie and more.

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

# Usage

### 0. Environmental variables

0.1. Create **`.env`** file in **`backend`** Copy content from `.evn.example` and fill with following:

```code
# APP
APP_PORT=4000
RATE_LIMIT=100
CORS_ORIGIN=''
ENABLE_DOC=true
RECAPTCHA_SECRET=''
AUTH_SALT_ROUND=10

# JWT AUTH
JWT_SECRET_KEY='long-unpredictable-secret1'
JWT_EXPIRES_IN='5m'
JWT_REFRESH_SECRET_KEY='long-unpredictable-secret2'
JWT_REFRESH_EXPIRES_IN='30d'
SIGN_I='remitano-api'
SIGN_S='info@remitano.com'
SIGN_A='https://www.remitano.com/'

# DATABASE
# change if you running in a different way than the one written in docker compose file
DATABASE_WRITE_HOST='postgres-main'
DATABASE_WRITE_PORT='5433'
DATABASE_WRITE_USER='admin'
DATABASE_WRITE_PASSWORD='admin'
DATABASE_WRITE_DB_NAME='rtn_movie'
DATABASE_READ_HOST_1='postgres-main'
DATABASE_READ_PORT_1='5433'
DATABASE_READ_USER_1='admin'
DATABASE_READ_PASSWORD_1='admin'
DATABASE_READ_DB_NAME_1='rtn_movie'

# REDIS
# change if you running in a different way than docker compose
REDIS_HOST='redis-main'
REDIS_PORT=6379
REDIS_DB=0

```

0.2. Create **`.env`** file in **`frontend`** Copy content from `.evn.example` and fill with following:

```code
VITE_REACT_APP_API_ENDPOINT=http://127.0.0.1:4000/api/v1
VITE_REACT_APP_SOCKET_ENDPOINT=http://127.0.0.1:4000
```

## Run With Docker

### 1. Run Docker containers

```bash
docker compose up
```

## Run Without Docker

### 1. Change contents of `DATABASE` and `REDIS` sections in `env` files

**`backend`**

```code
...

# DATABASE
DATABASE_WRITE_USER=[YOUR_DB_USERNAME]
DATABASE_WRITE_PASSWORD=[YOUR_DB_PASSWORD]
DATABASE_WRITE_HOST=[YOUR_DB_HOST]
DATABASE_WRITE_PORT=[YOUR_DB_PORT]
DATABASE_WRITE_DB_NAME=[YOUR_DB_DATABASE]
DATABASE_READ_USER_1=[YOUR_DB_USERNAME]
DATABASE_READ_PASSWORD_1=[YOUR_DB_PASSWORD]
DATABASE_READ_HOST_1=[YOUR_DB_HOST]
DATABASE_READ_PORT_1=[YOUR_DB_PORT]
DATABASE_READ_DB_NAME_1=[YOUR_DB_DATABASE]

# REDIS
REDIS_HOST=[YOUR_REDIS_HOST]
REDIS_PORT=[YOUR_REDIS_PORT]

...
```

### 2 Backend setup

```bash
cd backend
```

```bash
npm install
```

#### Run

```bash
npm run start:dev
```

- Default server will be started at http://127.0.0.1:4000
- Swagger link http://127.0.0.1:4000/docs/#/

### 3. Frontend setup

```bash
cd frontend
```

```bash
npm install
```

#### Run

```bash
npm run dev
```

- Default frontend will be started at http://127.0.0.1:3000

## TECH STACK

- Backend:
  - Nest.js
  - PostgreSQL
  - Redis
  - WebSockets
  - JWT
  - Passport.js
- Frontend
  - ReactJs
  - Tailwind & shadcnUI
## Contributing

Feel free to dive in! [Open an issue](https://github.com/HoangThaiHuy/remitano-testing-project/issues/new) or submit PRs.

## License

[MIT](https://choosealicense.com/licenses/mit/)
