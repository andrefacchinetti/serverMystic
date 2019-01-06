
var io = require('socket.io')(process.env.PORT || 52300);

var clients = [];

io.on('connection', function(socket){

	socket.on('beep', function(){
		console.log('test beep recebido!')
	});

	socket.on('LOGIN',function(player){
		console.log("[INFO] Player: "+player.name+" connected!");
		currentUser = {
			name: player.name,
			id: "5",
			position: player.position,
			rotation: player.rotation
		}

		clients.push(currentUser); //add currentUser na lista de clients
		console.log("currentUser: "+currentUser);
		console.log("Total players: "+clients.length);

		socket.emit('LOGIN_SUCESS', currentUser);

		for(var i=0;i<clients.length;i++){
			if(clients[i].id != currentUser.id){ //para nao instanciar voce mesmo, apenas os outros players
				socket.emit("SPAWN_PLAYER",{
					name: clients[i].name,
					id: clients[i].id,
					position: clients[i].position
				});
				console.log("User name: "+clients[i].name+" is connected!");
			}
		}

		socket.broadcast.emit("SPAWN_PLAYER",currentUser); //enviar seu player para os clientes; broadcast = envia para todos os outros clientes, menos pra vc mesmo

	});

	//funcao apra atualizar a movimentacao do cliente (POSICAO)
	socket.on('MOVE', function(data){
		currentUser.position = data.position;
		socket.broadcast.emit('UPDATE_MOVE',currentUser); //envia para todos os clientes
		console.log(currentUser.name+" Move to "+currentUser.position);
	});

	//funcao apra atualizar a movimentacao do cliente (ROTACAO)
	socket.on('ROTATE', function(data){
		currentUser.position = data.rotation;
		socket.broadcast.emit('UPDATE_ROTATE',currentUser); //envia para todos os clientes
		console.log(currentUser.name+" Move to "+currentUser.rotation);
	});

	socket.on('disconnect',function(){ //destruir players nos outros clientes
		socket.broadcast.emit('USER_DISCONNECTED', currentUser);
		for(var i=0;i<clients.length;i++){
			if(clients[i].name == currentUser.name && clients[i].id == currentUser.id){
				console.log("User "+clients[i].name+" has disconnected!");
				clients.splice(i,1); //tira da lista pela posicao
			}
		}
	});

})

/*
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var shortid = require('shortid');
app.use(express.static(__dirname)); //diretorio raiz
var clients = [];

io.on('connection', function(socket){

	socket.on('beep', function(){
		console.log('test beep recebido!')
	});

	socket.on('LOGIN',function(player){
		console.log("[INFO] Player: "+player.name+" connected!");
		currentUser = {
			name: player.name,
			id: shortId.generate(),
			position: player.position,
			rotation: player.rotation
		}

		clients.push(currentUser); //add currentUser na lista de clients
		console.log("currentUser: "+currentUser);
		console.log("Total players: "+clients.length);

		socket.emit('LOGIN_SUCESS', currentUser);

		for(var i=0;i<clients.length;i++){
			if(clients[i].id != currentUser.id){ //para nao instanciar voce mesmo, apenas os outros players
				socket.emit("SPAWN_PLAYER",{
					name: clients[i].name,
					id: clients[i].id,
					position: clients[i].position
				});
				console.log("User name: "+clients[i].name+" is connected!");
			}
		}

		socket.broadcast.emit("SPAWN_PLAYER",currentUser); //enviar seu player para os clientes; broadcast = envia para todos os outros clientes, menos pra vc mesmo

	});

	//funcao apra atualizar a movimentacao do cliente (POSICAO)
	socket.on('MOVE', function(data){
		currentUser.position = data.position;
		socket.broadcast.emit('UPDATE_MOVE',currentUser); //envia para todos os clientes
		console.log(currentUser.name+" Move to "+currentUser.position);
	});

	//funcao apra atualizar a movimentacao do cliente (ROTACAO)
	socket.on('ROTATE', function(data){
		currentUser.position = data.rotation;
		socket.broadcast.emit('UPDATE_ROTATE',currentUser); //envia para todos os clientes
		console.log(currentUser.name+" Move to "+currentUser.rotation);
	});

	socket.on('disconnect',function(){ //destruir players nos outros clientes
		socket.broadcast.emit('USER_DISCONNECTED', currentUser);
		for(var i=0;i<clients.length;i++){
			if(clients[i].name == currentUser.name && clients[i].id == currentUser.id){
				console.log("User "+clients[i].name+" has disconnected!");
				clients.splice(i,1); //tira da lista pela posicao
			}
		}
	});

})
http.listen(process.env.PORT || 3000,function(){
	console.log('server listening on 3000');
})

*/ 