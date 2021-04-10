const express = require('express')
const compression = require('compression')
const robots = require('express-robots-txt')
const fs = require('fs')
const bodyParser = require('body-parser')
const multer = require('multer')
const multipart = require('connect-multiparty')
const path = require('path')

const ownerRouter = require('./routers/owner.route.js')
const managerRouter = require('./routers/manager.route.js')

const multipartMiddleware = multipart()

require('dotenv').config()

const app = express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors())

app.use(robots(__dirname + '/robots.txt'))
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static('public'))
app.use(express.static('node_modules'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/posts')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
  })
const upload = multer({ storage: storage })

app.get('/', async (req,res) => {
    res.send("Home")
})

app.use('/manager', managerRouter)

app.use('/onwer', ownerRouter)

app.post("/upload", multipartMiddleware, (req, res) => {
    try {
        fs.readFile(req.files.upload.path, function (err, data) {
            var newPath = __dirname + '/public/images/' + req.files.upload.name;
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({err: err});
                else {
                    console.log(req.files.upload.originalFilename);
                //     imgl = '/images/req.files.upload.originalFilename';
                //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
                //    res.status(201).send(img);
                 
                    let fileName = req.files.upload.name;
                    let url = '/images/'+fileName;                    
                    let msg = 'Upload successfully';
                    let funcNum = req.query.CKEditorFuncNum;
                    console.log({url,msg,funcNum});
                   
                    res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
                }
            });
        });
       } catch (error) {
           console.log(error.message);
       }
})

function replaceAllBackslash(item) {
    while(item.indexOf("\\")>=0) {
        item=item.replace("\\","/")
    }
    return item
}

module.exports = app