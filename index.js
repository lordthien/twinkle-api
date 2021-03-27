const http = require('http')
const https = require('https')
const mongoose = require('mongoose')

const app = require('./app')

require('dotenv').config()

const port = process.env.PORT || 3000

const hostname = "twinkle.app"


mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Mongo Connection is success.")
}).catch(error => handleError(error))

// const httpServer = http.createServer((req, res) => {
//     res.statusCode = 301;
//     res.setHeader('Location', `https://${hostname}${req.url}`);
//     res.end(); // make sure to call send() or end() to send the response
//  });
// httpServer.listen(80, () => console.log(`Server is running on Port ${80}.`))

// const sslServer = https.createServer(
//     {
//         key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')), 
//         ca: fs.readFileSync(path.join(__dirname, 'cert', 'twinci_io.ca-bundle')),
//         cert: fs.readFileSync(path.join(__dirname, 'cert', 'twinci_io.crt'))
//     }, app
// )

// sslServer.listen(443, () => console.log(`Secure Server is running on Port ${443}.`))

app.listen(port, function() {
    console.log('Listening on port',port)
})