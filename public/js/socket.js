socket.on('player-move', (data)=>{
    // console.log(data);
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

socket.on('get-game', (serverPlayers)=>{
    for(const playerData of serverPlayers){
        let newPlayer = new Player();
        newPlayer.setData(playerData);
        players.push(newPlayer);
    }
    gameStarted = true;
});

socket.on('logged', (playerData)=>{
    // document.querySelector('canvas').style.cursor = "none";

    for(let cPlayer of players){
        if(cPlayer.name === playerData.name){
            currentPlayer = cPlayer;
            console.log("Good to see you again, " + currentPlayer.name + ".");
            break;
        }
    }

    if(currentPlayer === undefined){
        currentPlayer = new Player();
        currentPlayer.setData(playerData);
        console.log("Hello " + currentPlayer.name + " ! I hope you'll have fun.");
    }

    players.push(currentPlayer);

    if(form !== undefined){
        form.style.display = 'none';
    }

    
    socket.emit('well-logged', currentPlayer.getData());
});

socket.on('new-player', (data)=>{
    let playerAlreadyExist = false;

    for(const i in players){
        const cPlayer = players[i]
        if(cPlayer.name === data.name){
            players[i].setData(data);
            playerAlreadyExist = true;
            break;
        }
    }
    if(!playerAlreadyExist){
        let newPlayer = new Player();
        newPlayer.setData(data);
        players.push(newPlayer);
    }
});

socket.on('player-disconnect', (id)=>{
    for(let i = players.length - 1; i >= 0; i--){
        let cPlayer = players[i];
        if(cPlayer.id === id){
            playerAlreadyExist = true;
            cPlayer.active = false;
            break;
        }
    }
});