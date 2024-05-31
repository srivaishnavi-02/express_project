const express = require('express')
const morgan = require('morgan');
const ejs = require('ejs');
const mainRoutes = require("./routes/mainRoutes");
const storyRoutes = require("./routes/storyRoutes");
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const userRoutes = require('./routes/userRoutes');

const {fileUpload} = require('./middleware/fileUpload.js');

const app = express();

let port = 4000;
let url = 'mongodb+srv://smallip1:smallip1@project3.9by2qho.mongodb.net/project3'
// let url = 'mongodb://localhost:27017/project3'
let host = 'localhost';

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


mongoose.connect(url)
.then(()=>{
    app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});
})
.catch(error=>console.log(error.message));

app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb+srv://smallip1:smallip1@project3.9by2qho.mongodb.net/project3'}),
        cookie: {maxAge: 60*60*1000}
        })
);

app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.firstName = req.session.firstName||null;
    res.locals.lastName = req.session.lastName||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(morgan('tiny'));

app.use('/', mainRoutes);
app.use('/stories', storyRoutes);
app.use('/users',userRoutes);


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

