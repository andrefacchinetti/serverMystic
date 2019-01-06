var io = require('socket.io')({
	transports: ['websocket'],
});

io.attach(4567);

io.on('connection', function(socket){

	socket.on('CALBACK_NAME', function(){
		socket.emit('CALBACK_NAME');
		socket.broadcast.emit('CALBACK_NAME'); //emite para todos os clientes, menos para quem chamou
	});

	socket.on('CALBACK_NAME',function(data){

	/*	player = {
			name: data.name,
			id: shortId.generate(),
			position: data.position
		}

		socket.emit('CALBACK_NAME',player);*/
		socket.broadcast.emit('CALBACK_NAME',player);

	});


})

console.log("Servidor rodando");