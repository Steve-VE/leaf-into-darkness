class Player{
    constructor(pId, px, py){
        this.id = pId;
        this.x = px;
        this.y = py;
    }

    update(){

    }

    draw(){
        if(this.id === playerID){
            stroke(255);
            point(this.x, this.y);
            stroke(255, 100);
            fill(50, 75, 255, 100);
            ellipse(this.x, this.y, 50, 50);
        }
        else{
            stroke(255, 0, 0, 100);
            fill(255, 75, 50, 100);
            ellipse(this.x, this.y, 50, 50);
        }
    }
}