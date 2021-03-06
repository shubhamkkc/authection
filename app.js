require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const port = 3000;
const mongoose = require("mongoose")

var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://shubhamkkc:shubham123@cluster0.udotj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
const secret = process.env.SECRET
console.log(secret);

const User = new mongoose.model("user", userSchema);

app.get("/", function(req, res) {
    res.render("home")
})

app.get("/login", function(req, res) {
    res.render("login")
})

app.get("/register", function(req, res) {
    res.render("register")
})

app.post("/register", (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, salt);
    const email = req.body.username;
    const password = hash;
    const user = new User({
        email: email,
        password: password
    })
    user.save((err) => {
        if (err)
            console.log(err);
        else
            res.render("secrets")
    });
})

app.post("/login", (req, res) => {
    const email = req.body.username;

    User.findOne({
        email: email
    }, (err, foundOne) => {
        if (err) {
            console.log(err);
        } else {
            if (foundOne) {

                if (bcrypt.compareSync(req.body.password, foundOne.password))
                    res.render("secrets")
            } else
                console.log("invalid user")


        }


    })
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});