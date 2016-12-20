var express = require('express'); //need to split things so app.use works
var app = express();
var server =  require('http').Server(app);
var port = 9000;
var io = require('socket.io')(server);

//to store the 
var chatlog = [];
var appOptions = {
	historyLength: 2
};


function mainReqHandler(req, res){
	res.sendFile(__dirname + '/public/index.html');
}

app.use('/', express.static(__dirname + '/public')); //so it connects to everyhting in the folder

function serverUpCallback(){
	console.log("listening on port: " + port);
}

function incomingSocketHandler(socket){
	console.log('a user has connected');
	console.log(socket.conn.server.clientsCount);
	

	//assign user name
	socket.userName = socket.conn.server.clientsCount;


	var welcomeDataObject = {
		'message': "Welcome User!",
		'chatlog': chatlog.slice(appOptions.historyLength*-1) //needs to be negative tp pull from end
	}

	socket.emit("welcome message", welcomeDataObject);

	//listen for 'chat message' which is title of our emit
	socket.on('chat message', function(dataFromClient){
		socket.userName = dataFromClient.userName;
		var dataFromServer = {
			'userName': socket.userName,
			'message' : dataFromClient.msgText,
			'timeStamp': Date.now(),
		};

		

		chatlog.push(dataFromServer); //push from object
		console.log("===========CHATLOG============");
		console.log(chatlog);

		io.emit('latest message', dataFromServer);
		socket.emit('message confirmation', {'text': "your message was sent"});
	});

	socket.on('new user', function(userName){
		io.emit("new user added", userName);
	});

	//responding to client
	socket.on('get full history', function(data){
		console.log("have received full history request from: " + socket.userName);
		//emit the chatlog via an object 
		socket.emit('full history log', {'chatlog': chatlog});
	});


}

io.on('connection', incomingSocketHandler);

server.listen(process.env.PORT || port,serverUpCallback);



