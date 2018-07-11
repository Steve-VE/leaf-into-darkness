// Import package
let nunjucks = require('nunjucks');
let express = require('express');
let app = express();
let socket = require('socket.io');

// Config
const config = require('./config');
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




// Sockets
let io = socket(server);
io.on('connection', (socket)=>{
    // console.log("-- New connection at [" + socket.id + "] id.");

    socket.on('player-move', (data)=>{
        console.log("-- Player +" + data.id + "moved.");
        socket.broadcast.emit('player-move', data);
    });
});