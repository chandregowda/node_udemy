const express = require("express");
const hbs = require("hbs");
const fs = require('fs');

hbs.registerPartials(__dirname + "/views/partials/");
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear() );

var app = express();
app.set('view engine', 'hbs'); // Set the Template engine


app.use((req, res) => {
    res.render("maintenance.hbs");
});
app.use(express.static(__dirname + '/public'));

const PORT = 3000;

app.use((req, res, next) => {

    var now = new Date().toString();
    let log = `New Reqest at  ${now}, ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile("./server.log", log + "\n" , (err) => {
        if(err) {
            console.log("Unable to append ", log, 'to server.log');
        }
    })
    next();

});

app.get('/', (req, res) => {
    // res.json([{message:"Welcome", error:null}, {message:"Welcome 2", error:null}]);
    // res.send("Hi");
    res.render("home.hbs", {
        pageTitle: "Welcome to my website",
        currentYear : (new Date()).getFullYear()        
    })
});
app.get('/about', (req, res)=> {
    res.render('about.hbs', {
        pageTitle: "About me",
        currentYear : (new Date()).getFullYear()
    });
});

app.get('/bad', (req, res) => { 
    res.json({error:"something bad happened", message:null});
})

app.get('*', (req, res) => {
    res.send("<h1>Omg No one to handle me</h1>");
});

app.listen(PORT, () => console.log("Server is listining at port ", PORT) );
