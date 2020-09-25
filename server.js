const { server } = require('./app');
const { PORT = 3000 } = process.env;

server.listen(PORT, () => {
    console.log(`Listening on poart ${PORT}`)
})