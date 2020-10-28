const { server } = require('./app');
const { PORT = 3000 } = process.env;
const client = require('./db/client')

server.listen(PORT, () => {
    client.connect();
    console.log(`Listening on port ${PORT}`)
})