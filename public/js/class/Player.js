class Player{
    constructor(pId, px, py, pname){
        this.id = pId;
        this.x = px;
        this.y = py;
        this.name = pname;
        this.width = 50;
        this.active = true;
        this.levitate = 0;
        this.levitateCount = 0;
    }

    update(){
        if(this.active){
            this.levitate = -Math.sin(radians(this.levitateCount)) * (this.width / 8);
            this.levitate -= this.width / 4;
            this.levitateCount++;
        }
        else if(this.levitate < 0){
            this.levitate++;
            if(this.levitate > 0){
                this.levitate = 0;
            }
        }
    }

    draw(){
        noStroke();
        fill(0, 50);
        ellipse(this.x, this.y + (this.width / 2), this.width * 0.8, this.width * 0.4);

        if(this === currentPlayer){
            stroke(255);
            fill(50, 75, 255, 100);
        }
        else if(this.active){
            stroke(255, 0, 0, 100);
            fill(255, 70, 85, 100);
        }
        else{
            stroke(0, 100);
            fill(0, 80);
        }
        ellipse(this.x, this.y + this.levitate, this.width, this.width);
        
        if(this.name !== undefined){
            textAlign(CENTER);
            noStroke();
            fill(255);
            textSize(16);
            textFont('Georgia');
            text(this.name, round(this.x), round(this.y - (this.width / 2) - 5));
        }
    }

    move(shiftX, shiftY){
        this.x += shiftX;
        this.y += shiftY;
        socket.emit('player-move', {
            id: this.id,
            x: this.x,
            y: this.y
        });
    }

    getData(){
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            name: this.name
        };
    }
    setData(data){
        const validProperties = ['id', 'x', 'y', 'name', 'active'];
        for(const property of validProperties){
            if(data[property] !== undefined){
                this[property] = data[property];
            }
        }
        // this.id = data.id;
        // this.x = data.x;
        // this.y = data.y;
        // this.name = data.name;
        // this.active = data.active;
    }
}