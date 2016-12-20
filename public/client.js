var socket = io();
var userName = "";

var displayHistory = function(chatlog){
	for (var i = 0; i < chatlog.length; i ++){
		var existingMessageText = chatlog[i].userName + ": " + chatlog[i].message;
		$('#messages').append($('<li>').text(existingMessageText));
	};
}

//reading data from server
socket.on('welcome message', function(data){
	$('#messages').append($('<li>').text(data.message)); //adding thing to list with id message in the html
	// console.log("welcome is working");
	// console.log(data.chatlog);

	displayHistory(data.chatlog);

	// var chatlog = data.chatlog;

	//CLIENT SIDE HISTORY TRUNCATING
	// var earliestIndex = chatlog.length - 5;
	// if (earliestIndex < 0){
	// 	earliestIndex = 0;
	// }

	// for (var i = 0; i < chatlog.length; i ++){
	// 	var existingMessageText = data.chatlog[i].userName + ": " + data.chatlog[i].message;
	// 	$('#messages').append($('<li>').text(existingMessageText));
	// };
});

socket.on('latest message', function(data){
	$('#messages').append($('<li>').text(data.userName + ": " + data.message)); 
});


socket.on('new user added', function(userName){
$('#messages').append($('<li>').text(userName + " here 2 party"));
})

userNameFunction();

function userNameFunction() {
	var person = prompt("Please enter your name", "enter user name");
	if (person != null) {
		$('#messages').append($('<li>').text("Your name is: " + person));
		userName = person;
		socket.emit('new user', userName);
	}
}



$('#get-history').on('click', function(){
	console.log("get history clicked");
	//ask server for history
	socket.emit('get full history');
});

//get the server's response and do this
socket.on('full history log', function(data){
	console.log(data.chatlog);
	$('#messages').html('');
	displayHistory(data.chatlog);
});


//sending data to server
//attach to form
$('form').submit(submitFired); //grad form and submit 

function submitFired() {
	var dataFromClient = {
		userName : userName,
		'msgText': $('#m').val() //storing value from id m
	}
	socket.emit('chat message', dataFromClient);
	$('#m').val();
	return false;
}
