# UniD Hackathon 대체텍스트 제공 서비스 Eysee API

## Project Structure

```bash
server
├── src
│   ├── auth
│   │   ├── guards
│   │   └── strategies
│   ├── comments
│   │   ├── dto
│   │   └── entities
│   ├── db
│   │   └── migrations
│   ├── postings
│   │   ├── dto
│   │   └── entities
│   └── users
│       ├── dto
│       └── entities
├── test
└── uploads
```

## API Documentation

- [API-Doc](https://jyoo0515.github.io/UniD_API_Doc/)
- Depolyed On: https://alt-text.herokuapp.com

## How to Start

#### Change Directory

```bash
$ cd server
```

#### Git Config

```bash
# db 변경사항이 github에 푸쉬되지 않도록
$ git update-index --assume-unchanged dev.db
```

#### Installation

```bash
$ npm install
```

#### Data Migration

```bash
$ npm run migration:run
```

### Configure .env File

```
TOKEN_KEY={random string}
TOKEN_EXPIRY=6h
```

#### Running the app

```bash
# development
$ npm run start
```

## Server Running On

- http://localhost:80/
