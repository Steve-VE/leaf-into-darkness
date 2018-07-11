let body;
let socket = io.connect('http://localhost:8001');
let gameStarted = false;
let playerID = Math.round(Math.random() * 4096);
let currentPlayer;
let players = [];

window.onload = ()=>{
    console.log("-- Script loaded");
    body = document.querySelector('body');  
};


// GAME LOGIC
function setup(){
    frameRate(60);
}

function draw(){
    if(!gameStarted && body !== undefined){
        gameStarted = true;
        createCanvas( body.clientWidth, body.clientHeight );
        currentPlayer = new Player(playerID, mouseX, mouseY);
        players.push(currentPlayer);
    }
    else{
        background(0);

        // console.log(players);
        for(let cPlayer of players){
            cPlayer.update();
        }
        for(let cPlayer of players){
            cPlayer.draw();
        }
    }
}

function mouseMoved(){
    if(gameStarted){
        currentPlayer.x = mouseX;
        currentPlayer.y = mouseY;

        socket.emit('player-move', {
            id: currentPlayer.id,
            x: currentPlayer.x,
            y: currentPlayer.y
        });
    }
}

// SOCKETS
socket.on('player-move', (data)=>{
    console.log(data);
    if(data.id === playerID){
        currentPlayer.x = data.x;
        currentPlayer.y = data.y;
    }
    else{
        let playerAlreadyExist = false;

        for(let i = players.length - 1; i >= 0; i--){
            let cPlayer = players[i];
            if(cPlayer.id === data.id){
                playerAlreadyExist = true;
                cPlayer.x = data.x;
                cPlayer.y = data.y;
                break;
            }
        }

        if(!playerAlreadyExist){
            players.push(new Player(data.id, data.x, data.y));
        }
    }
});