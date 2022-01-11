var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var uuid = require('uuid-random');

const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('unique-names-generator');

var PORT = process.env.PORT || 8080;

var server = app.listen(PORT, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', 'localhost:', port);
});

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Orgin, X-Requested-With, Content-Type, Accept');
    next();
});

var io = require('socket.io')(server)

//two variables to store chat room message data & current connect users

var chatRoomData = []
var connectedClients = {}

io.on('connection', (client) => {
    
})