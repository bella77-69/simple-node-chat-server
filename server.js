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
    console.log('New Client connected');

    //Client Sent a message
    client.on('SendMessage', (messageData) => {
        chatRoomData.push(messageData)
        sendUpdatedChatRoomData(client)
    })

    //Client entered the Chat Room
    client.on('UserEnteredRoom', (userData) => {
        var enteredRoomMessage = {message: `${userData.username} has entered the chat`, username: '', userID: 0, timeStamp: null}
        chatRoomData.push(enteredRoomMessage)
        sendUpdatedChatRoomData(client)
        connectedClients[client.id] = userData
    })

    //Creating identity for new connected user
    client.on('CreateUserData', () => {
        let userID = uuid();
        let username = uniqueNamesGenerator({dictionaries: [adjectives, names] });
        var userData = {userID: userID, username: username}
        client.emit('SetUserData', userData)
    })

    //Player Disconnecting from chat room
    client.on('disconnecting', (data) => {
        console.log("Client disconnecting...");
    
        if(connectedClients[client.id]){
          var leftRoomMessage = {message: `${connectedClients[client.id].username} has left the chat`, username: "", userID: 0, timeStamp: null}
          chatRoomData.push(leftRoomMessage)
          sendUpdatedChatRoomData(client)
          delete connectedClients[client.id]
        }
    
      });

      //Clearing Chat Room Data from server
      client.on('ClearChat', () => {
          chatRoomData=[]
          console.log(chatRoomData)
          sendUpdatedChatRoomData(client)
      })
})

    //Sending Update Chat Room Data to all Connected Clients
    function sendUpdatedChatRoomData(client) {
        client.emit("RetrieveChatRoomData", chatRoomData)
        client.broadcast.emit("RetrieveChatRoomData", chatRoomData)
    }