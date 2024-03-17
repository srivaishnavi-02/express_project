const express = require('express')
const morgan = require('morgan');
const ejs = require('ejs');
const mainRoutes = require("./routes/mainRoutes");
const storyRoutes = require("./routes/storyRoutes");
const methodOverride = require('method-override')

const {fileUpload} = require('./middleware/fileUpload.js');

const app = express();

let port = 3000;

let host = 'localhost';

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(morgan('tiny'));

app.use('/', mainRoutes);
app.use('/stories', storyRoutes);

app.post('/', fileUpload, (req, res, next) => {
    let image =  "./images/" + req.file.filename;
    res.render('index', {image});
});

app.get('/',(req,res)=>{
    res.render('index')
});

app.use((req,res,next)=>{
    let err = new Error("The Server cannot locate "+req.url )
    err.status = 404
    next(err)
})

app.use((err,req,res,next)=>{
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error")
    }

    res.status(err.status);
    res.render('error',{error:err});
});


app.listen(port,host,()=>{
    console.log("Server is running at 3000");
})