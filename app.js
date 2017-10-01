const express = require("express");
const hbs = require("hbs");
const fs = require('fs');

/** 
 * Consts used in application
 */
const PORT = 3000;
const LOG_FILE = "server.log";
const LOG_FILE_PATH = __dirname + "/" + LOG_FILE;

/**
 * Configure the path of Handlebars Partial files that are used multiple times
 */
hbs.registerPartials(__dirname + "/views/partials/");
/**
 * Register new Handlebar function getCurrentYear that will return current Year used in Footer section
 */
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
/**
 * Register new Handlebar function ScreamIt that will return passed string in uppercase
 */
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

/**
 * Create an Express App variable
 */
var app = express();
/**
 * Set up the Templating Engine - in this case Handlebars
 */
app.set('view engine', 'hbs');

/**
 * Using 'app.use' function we can add any number of middlewares
 * NOTE: The sequence of this app.use matters
 */

// app.use((req, res) => {
//     res.render("maintenance.hbs");
// });

/**
 * Setup the Static directory from where CSS, Fonts, Images and Javascript or any html files are served
 */
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {

    var now = new Date().toString();
    let log = `New Reqest at  ${now}, ${req.method} ${req.url}`;
    console.log(log);

    fs.appendFile(LOG_FILE_PATH, log + "\n", (err) => {
        if (err) {
            console.log("Unable to append ", log, 'to', LOG_FILE_PATH);
        }
    })
    next(); // Without this next(), none of the below requests will be served.
});

app.get('/', (req, res) => {
    // res.json([{message:"Welcome", error:null}, {message:"Welcome 2", error:null}]);
    // res.send("Hi");
    res.render("home.hbs", {
        pageTitle: "Welcome to my website"
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: "About me",
    });
});

app.get('/bad', (req, res) => {
    res.json({ error: "something bad happened", message: null });
})

app.get('*', (req, res) => {
    res.send("<h1>Omg No one to handle me</h1>");
});

/**
 * Start Server and Listen to PORT
 */
app.listen(PORT, () => console.log("Server is listining at port ", PORT));
