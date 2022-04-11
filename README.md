# SmartHealth Care System

## File Structure

```

├── config
│   ├── config.server.js
│   └── database.js
│
├── controllers
│   ├── auth.js
│   └── patient.js
│
├── helpers
│   ├── cookie.js
│   ├── error.js
│   ├── jwt.js
│   ├── validators.js
│   └── user.js
│
├── middlewares
│   └── auth.js
│
├── models
│   ├── index.js
│   └── User.js
│
├── routes
│   └── index.js
│
├── index.js
├── constants.js
│
├── client
│   ├── build
│   ├── public
│   └── src
```

#### Install ML - Model Dependencies

```bash
# Install dependencies
pip3 install -r ./ml_model/requirements.txt
```

#### Development

```bash
# Install dependencies
npm install

# Start a development server
npm run server:dev


# Start a production server
npm run server:prod
```

#### Docker

```bash
docker-compose up -d --build

```
