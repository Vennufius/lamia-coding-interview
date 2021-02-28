Lamia coding interview

By Verner Villikka

# Client

To run the vue app, go to folder "client" and run command (NPM needed!):

```bash
npm install
# and
npm run serve
```

or if using yarn

```bash
yarn install
# and
yarn serve
```

# Server

To run server, go to folder "server" and run command:

```bash
npm install
# and
npm run start
```

or if using yarn

```bash
yarn install
# and
yarn start
```

This repository has only .env.sample file. To use the server properly, provide either environment variables or create .env file. OMDB_API_KEY needs to be an API key obtained from the OBDb api and the TOKEN_SECRET can be anything. It is used to sign the JWT token, so a long, not easily guessed string is recommended.
