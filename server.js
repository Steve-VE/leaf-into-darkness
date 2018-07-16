// Import package
let nunjucks = require('nunjucks');
let express = require('express');
let app = express();
let socket = require('socket.io');


// Config
const config = require('./_config');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.use('/assets', express.static(__dirname + '/public'));
app.use('/assets/js/lib', express.static(__dirname + '/node_modules/socket.io-client/dist'));

// Routes
app.get('/', (req, res)=>{
    res.render('index.html', {'name' : config.name});
});
app.get('*', (req, res)=>{
    res.redirect('/');
});

// Start server
let server = app.listen(config.port, ()=>{
    console.log("-- \"" + config.name + "\"'s server listen on "+ config.port +" port.");
});


// Variables declarations
let players = [];

// Sockets
let io = socket(server);

io.on('connection', (socket)=>{
    console.log("-- New connection at [" + socket.id + "] id.");
    let player = {
        id: socket.id
    };
    let globalIndex = players.length;

    // Send all data
    socket.emit('get-game', players);
    
    // When a new player log on
    socket.on('player-join', (pseudo)=>{
        let playerAlreadyExist = false;
        
        // We check if the player already exist...
        for(const playerIndex in players){
            const singlePlayer = players[playerIndex];
            if(singlePlayer.name === pseudo){
                player = singlePlayer;
                player.active = true;
                playerAlreadyExist = true;
                console.log("-- Good to see you again, " + singlePlayer.name + ".");

                globalIndex = playerIndex;
                players[globalIndex] = player;
                break;
            }
        }
        // ... otherwise, we create a new player.
        if(!playerAlreadyExist){
            player.name = pseudo;
            player.x = 400;
            player.y = 300;
            player.active = true;
            
            console.log("-- Welcome " + player.name + " ! I hope you'll have fun.");
            players.push(player);
        }

        socket.emit('logged', player);
    });

    socket.on('player-move', (data)=>{
        // console.log("-- Player +" + data.id + "moved.");
        player.x = data.x;
        player.y = data.y;
        players[globalIndex] = player;
        socket.broadcast.emit('player-move', data);
    });

    socket.on('well-logged', (data)=>{
        // console.log("-- Player +" + data.id + "moved.");
        socket.broadcast.emit('new-player', data);
    });

    socket.on('disconnect', ()=>{
        if(player.active){
            console.log("-- Player \"" + player.name + "\" [" + socket.id + "] disconnected");
            player.active = false;
            socket.broadcast.emit('player-disconnect', player.id);
        }
    });
});