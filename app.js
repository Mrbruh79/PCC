const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
var user = {
username: 'test',
pin: '1234',
password: 'testpass'
};
function connectToDB() {
var con = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'admin',
database: 'isaa'
});
con.connect((err) => {
if (err) {
throw err;
}
else {
console.log("Connected to SQL");
}
});
return con;
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
res.sendFile(__dirname + "/index.html");
});
app.get('/signup.html', (req, res) => {
res.sendFile(__dirname + "/signup.html");
});
app.post('/signup', (req, res) => {
let con = connectToDB();
console.log(req.body);
let name = req.body.username;
let pwd = req.body.pwd;
let pin = req.body.pin;
let query = `Insert into users values('${name}','${pin}','${pwd}')`;
con.query(query, (err) => {
if (err) res.render('invalid', { error: err });
else {
console.log('Inserted into Database');
res.redirect('../');
}
});
});
app.post('/pin', (req, res) => {
user.username = req.body.username;
let query = `Select * from users where username='${user.username}';`;
console.log(query);
let con = connectToDB();
con.query(query, (err, result) => {
if (err) res.render('invalid', { error: err });
if (result.length == 0) res.render('invalid', { error: "Username"
});
else {
con.end();
console.log(result[0].username);
user.pin = result[0].pin;
user.password = result[0].password;
console.log(req.body);
res.render('pin', { uName: user.username });
}
});
});
app.post('/validatePIN', (req, res) => {
let pin = req.body.pin;
console.log(pin);
console.log(user.pin);
if (pin == user.pin) {
res.render('password', { uName: user.username });
} else {
res.render('invalid', { error: "PIN" });
}
});
app.post('/validatePassword', (req, res) => {
let pwd = req.body.pwd;
console.log(pwd);
console.log(user.password);
if (pwd == user.password) {
res.render('success', { uName: user.username });
} else {
res.render('invalid', { error: "Password" });
}
});
app.listen(3000, () => {
console.log('Server Listening on port 3000');
});
