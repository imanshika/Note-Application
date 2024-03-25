require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectMongoDB = require('./server/config/db');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');


const app = express();
const PORT = 8001 || process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(session({
    secret: "notes-secret",
    resave: false,
    saveUninitialized: true ,
}))

app.use(passport.initialize());
app.use(passport.session());


//connect to db
connectMongoDB();

//Static Files
app.use(express.static('public'));

// Templating engine
app.use(expressLayouts);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');


// Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

// for 404
app.get('*', function(req, res){
    //res.status(404).send('404 Page Not Found.')
    res.status(404).render('not_found')
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})