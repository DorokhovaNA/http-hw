const http = require("http");
const port = 5000;

const requestListener = (req, res) => {
    res.writeHead(200)
    res.end(`Hello! It's my first server`)
}

const server = http.createServer(requestListener)

server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
