const getSocketUrl = ()=>{
    return window.location.href;
};

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;


let body;
let socket = io.connect(getSocketUrl());
let gameStarted = false;
let playerID = Math.round(Math.random() * 4096);
let currentPlayer;
let players = [];
let form;


window.onload = ()=>{
    console.log("-- Script loaded");
    body = document.querySelector('body');  
    createCanvas( body.clientWidth, body.clientHeight );

    form = document.querySelector('form');
    form.querySelector('input[type=submit]').addEventListener('click', (e)=>{
        e.preventDefault();
        let pseudo = form.querySelector('input[type=text]').value;
        
        if(pseudo !== undefined && pseudo !== null){
            pseudo = pseudo.trim();

            if(pseudo !== ''){
                startGame(pseudo);
            }
        }
    });
};


// GAME LOGIC
function setup(){
    frameRate(60);
    
}

function draw(){
    if(gameStarted){
        background(128);

        // console.log(players);
        for(let cPlayer of players){
            cPlayer.update();
        }
        for(let cPlayer of players){
            cPlayer.draw();
        }
    }
}

const startGame = (pseudo = "Unkown Player")=>{
    socket.emit('player-join', pseudo);
};

function mouseMoved(){
    if(gameStarted && currentPlayer !== undefined){
        // currentPlayer.x = mouseX;
        // currentPlayer.y = mouseY;

        // socket.emit('player-move', {
        //     id: currentPlayer.id,
        //     x: currentPlayer.x,
        //     y: currentPlayer.y
        // });
    }
}

function mouseDragged(){
    mouseMoved();
}


window.addEventListener('keydown', (e)=>{
    if(gameStarted && currentPlayer !== undefined){
        const key = e.key;
        const keyCode = e.keyCode;
        // console.log("-- key : " + key + " - keyCode : " + keyCode);

        switch(keyCode){
            case KEY_UP:
            case 90:
            currentPlayer.move(0, -5);
            break;
            case KEY_DOWN:
            case 83:
            currentPlayer.move(0, 5);
            break;
            case KEY_LEFT:
            case 81:
            currentPlayer.move(-5, 0);
            break;
            case KEY_RIGHT:
            case 68:
            currentPlayer.move(5, 0);
            break;
        }       
    }
});