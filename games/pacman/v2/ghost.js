function heuristic (pos0, pos1) {
    var d1 = Math.pow(Math.abs(pos1.x - pos0.x), 2);
    var d2 = Math.pow(Math.abs(pos1.y - pos0.y), 2);
    return Math.sqrt(d1 + d2);
}

function Ghost({who, startX, startY, delay, color}){
    this.dir = 1;
    this.nextDir = 0;
    this.x = scale * startX;
    this.y = scale * startY;
    this.lastX = this.x;
    this.lastY = this.y;
    this.realX = startX;
    this.realY = startY;
    this.timer = Date.now();
    this.skin = 0;
    this.dest = {x: this.x, y: this.y};
    this.isAfraid = false;
    this.isScatter = false;
    this.speed = 4
    this.paths = [];
    this.eaten = false;

    const ghost = [
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,0,1,1,1,0,0,1,1,1,0,1,1,0],
            [0,1,0,0,0,1,1,0,0,1,1,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0],
            [0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0]
        ],
    ]
    const eyes = [
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0],
            [0,0,0,2,3,3,2,0,0,2,3,3,2,0,0,0],
            [0,0,0,2,2,2,2,0,0,2,2,2,2,0,0,0],
            [0,0,0,2,2,2,2,0,0,2,2,2,2,0,0,0],
            [0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ],
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0],
            [0,0,0,0,2,2,2,2,0,0,2,2,2,2,0,0],
            [0,0,0,0,2,2,3,3,0,0,2,2,3,3,0,0],
            [0,0,0,0,2,2,3,3,0,0,2,2,3,3,0,0],
            [0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ],
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0],
            [0,0,0,2,2,2,2,0,0,2,2,2,2,0,0,0],
            [0,0,0,2,2,2,2,0,0,2,2,2,2,0,0,0],
            [0,0,0,2,3,3,2,0,0,2,3,3,2,0,0,0],
            [0,0,0,0,3,3,0,0,0,0,3,3,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ],
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0],
            [0,0,2,2,2,2,0,0,2,2,2,2,0,0,0,0],
            [0,0,3,3,2,2,0,0,3,3,2,2,0,0,0,0],
            [0,0,3,3,2,2,0,0,3,3,2,2,0,0,0,0],
            [0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
    ]

    const heuristic = (pos0, pos1) => {
        var d1 = Math.pow(Math.abs(pos1.x - pos0.x), 2);
        var d2 = Math.pow(Math.abs(pos1.y - pos0.y), 2);
        return Math.sqrt(d1 + d2);
    }

    const drawGhost = (x, y, color) => {
        let ghostToDraw = ghost[this.skin].map(row => row.slice()); // clone array

        // Overlap eyes
        ghostToDraw.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                if(eyes[this.dir][rowI][colI] == 2) ghostToDraw[rowI][colI] = 2;
                if(eyes[this.dir][rowI][colI] == 3) ghostToDraw[rowI][colI] = 3;
            })
        })

        let tT = Date.now() - afraidTimer;
        ghostToDraw.forEach((row, rowI) => {
            row.forEach((col, colI) => {
                switch(col){
                    case 1:
                        if(this.eaten){
                            ctx.fillStyle = "transparent";
                        } else if(this.isAfraid){
                            if((tT > 3000 && tT < 3250) || (tT > 3500 && tT < 3750) || (tT > 4000 && tT < 4250) || (tT > 4500 && tT < 4750)){
                                ctx.fillStyle = "#88f";
                            } else {
                                ctx.fillStyle = "#00f";
                            }
                        } else {
                            ctx.fillStyle = color;
                        }
                        break;
                    case 2:
                        ctx.fillStyle = "#fff";
                        break;
                    case 3:
                        ctx.fillStyle = "#00f";
                        break;
                    default:
                        ctx.fillStyle = "transparent";
                        return;
                }
                //ctx.fillRect(x + (colI * scale / 10) *1.2 - 14, y + (rowI * scale / 10) * 1.2 - 14, scale / 10 * 1.2, scale / 10 * 1.2);
                ctx.fillRect(x + (colI * scale / 8) - (scale / 2), y + (rowI * scale / 8) - (scale / 2), scale / 8, scale / 8);
            })
        })
    }

    this.draw = () => {
        drawGhost(this.x, this.y, color);

        // draw dest
        if(showDebug){
            ctx.fillStyle = color;
            ctx.fillRect(this.dest.x * scale - 10, this.dest.y * scale - 10, 20, 20);
        }
    }

    const pinkyDest = () => {
        switch(pacman.dir){
            case 0: // up
                return {x: pacman.realX + 0.5 - 4, y: pacman.realY + 0.5 - 4};
            case 1: // down
                return {x: pacman.realX + 0.5, y: pacman.realY + 0.5 + 4};
            case 2: // left
                return {x: pacman.realX + 0.5 - 4, y: pacman.realY + 0.5};
            case 3: // right
                return {x: pacman.realX + 0.5 + 4, y: pacman.realY + 0.5};
        }
    }
    this.update = () => {
        if(Date.now() - this.timer < delay) return;

        // round real position by direction
        switch(this.dir){
            case 0: // up
                this.realY = Math.ceil(this.y / scale)
                break;
            case 1: // down
                this.realY = Math.floor(this.y / scale)
                break;
            case 2: // left
                this.realX = Math.ceil(this.x / scale)
                break;
            case 3: // right
                this.realX = Math.floor(this.x / scale)
                break;
        }

        //if(this.x > this.realX * scale - 10 && this.x < this.realX * scale + 10) this.x = this.realX * scale;
        //if(this.y > this.realY * scale - 10 && this.y < this.realY * scale + 10) this.y = this.realY * scale;

        // Destination based on ghost type
        this.dest = {x: pacman.realX + 0.5, y: pacman.realY + 0.5};
        switch(who){
            case "blinky":
                this.dest = {x: pacman.realX + 0.5, y: pacman.realY + 0.5};
                break;
            case "inky":
                const tmpDest = pinkyDest()
                this.dest = {x: tmpDest.x + (tmpDest.x - blinky.realX), y: tmpDest.y + (tmpDest.y - blinky.realY)}
                break;
            case "pinky":
                this.dest = pinkyDest()
                break;
            case "clyde":
                if(heuristic({x: this.realX, y: this.realY}, {x: pacman.realX, y: pacman.realY}) < 8){
                    this.dest = {x: 1, y: 32};
                } else {
                    this.dest = {x: pacman.realX + 0.5, y: pacman.realY + 0.5};
                }
                break;
        }
        // Set dest to scatter destination of each ghost if scatter mode
        if(scatter){
            switch(who){
                case "blinky":
                    if(dotsLeft > 80) {
                        this.dest = {x: 27, y: 1};
                    }
                    break;
                case "inky":
                    this.dest = {x: 27, y: 32};
                    break;
                case "pinky":
                    this.dest = {x: 1, y: 1};
                    break;
                case "clyde":
                    this.dest = {x: 1, y: 32};
                    break;
            }
        }
        
        // Set dest to ghost house if eaten
        if(this.eaten){
            this.dest = {x: 13, y: 14};
            this.speed = 8;
            if(this.realX == 14 && this.realY == 15){
                this.eaten = false;
                this.speed = 4;
            }
        }

        // round real position by direction
        switch(this.dir){
            case 0: // up
                this.realY = Math.ceil(this.y / scale)
                break;
            case 1: // right
                this.realX = Math.floor(this.x / scale)
                break;
            case 2: // down
                this.realY = Math.floor(this.y / scale)
                break;
            case 3: // left
                this.realX = Math.ceil(this.x / scale)
                break;
        }

        // get available paths
        this.paths = [];
        if(matrix[this.realY - 1][this.realX] === 0 || matrix[this.realY - 1][this.realX] === 2) this.paths.push(0);
        if(matrix[this.realY][this.realX + 1] === 0 || matrix[this.realY][this.realX + 1] === 2) this.paths.push(1);
        if(matrix[this.realY + 1][this.realX] === 0 || matrix[this.realY + 1][this.realX] === 2) this.paths.push(2);
        if(matrix[this.realY][this.realX - 1] === 0 || matrix[this.realY][this.realX - 1] === 2) this.paths.push(3);
        // can't go back
        this.paths.forEach((path, i) => {
            if(path - 2 === this.dir || path + 2 === this.dir) this.paths.splice(i, 1);
        })
        // Validate paths
        this.paths.forEach((path, i) => {
            switch(path){
                case 0: // up
                    this.paths[i] = {x: this.realX, y: this.realY - 1, weight: heuristic({x: this.realX, y: this.realY - 1}, this.dest)};
                    if((this.paths[i].y == 12 || this.paths[i].y == 24) && (this.paths[i].x == 12 || this.paths[i].x == 15)) this.paths.splice(i, 1);
                    break;
                case 1: // right
                    this.paths[i] = {x: this.realX + scale, y: this.realY, weight: heuristic({x: this.realX + 1, y: this.realY}, this.dest)};
                    break;
                case 2: // down
                    this.paths[i] = {x: this.realX, y: this.realY + 1, weight: heuristic({x: this.realX, y: this.realY + 1}, this.dest)};
                    break;
                case 3: // left
                    this.paths[i] = {x: this.realX - scale, y: this.realY, weight: heuristic({x: this.realX - 1, y: this.realY}, this.dest)};
                    break;
            }
        })
        // Choose next node
        let nextNode;
        if(this.isAfraid && !this.eaten){
            nextNode = this.paths[Math.floor(Math.random() * this.paths.length)];
        } else {
            this.paths.sort((a, b) => a.weight - b.weight);
            nextNode = this.paths[0];
        }
        // Dir to next node
        if(nextNode){
            if(nextNode.x < this.realX) this.nextDir = 3;
            if(nextNode.x > this.realX) this.nextDir = 1;
            if(nextNode.y < this.realY) this.nextDir = 0;
            if(nextNode.y > this.realY) this.nextDir = 2;
        }

        // change dir to nextDir if can
        if(this.dir !== this.nextDir){
            switch(this.nextDir){
                case 0: // up
                    if(matrix[this.realY - 1][this.realX] == 0 || matrix[this.realY - 1][this.realX] == 2){
                        if(this.x == this.realX * scale) this.dir = 0;
                    }
                    break;
                case 1: // right
                    if(matrix[this.realY][this.realX + 1] == 0 || matrix[this.realY][this.realX + 1] == 2){
                        if(this.y == this.realY * scale) this.dir = 1;
                    }
                    break;
                case 2: // down
                    if(matrix[this.realY + 1][this.realX] == 0 || matrix[this.realY + 1][this.realX] == 2){
                        if(this.x == this.realX * scale) this.dir = 2;
                    }
                    break;
                case 3: // left
                    if(matrix[this.realY][this.realX - 1] == 0 || matrix[this.realY][this.realX - 1] == 2){
                        if(this.y == this.realY * scale) this.dir = 3;
                    }
                    break;
            }
        }

        // Special cases (ghost house)
        if((this.x > 13.5 * scale && this.x < 17 * scale) && this.y == 16 * scale) this.dir = 3;
        if((this.x < 13.5 * scale && this.x > 9 * scale) && this.y == 16 * scale) this.dir = 1;

        if((this.x > 13.4 * scale && this.x < 13.6 * scale) && (this.realY <= 16 && this.realY >= 14)) this.dir = 0;

        if(this.eaten){
            if((this.x > 13.3 * scale && this.x < 13.7 * scale) && (this.realY <= 15 && this.realY >= 13)) this.dir = 2;
        }


        // Afraid
        if(afraid && !this.isAfraid && !this.eaten){
            this.isAfraid = true;
            this.dir = (this.dir + 2) % 4;
            this.speed = 2;
        } else if(!afraid && this.isAfraid){
            this.isAfraid = false;
            this.speed = 4;
        }

        // Scatter
        if(scatter && !this.isScatter && !this.eaten){
            this.isScatter = true;
            this.dir = (this.dir + 2) % 4;
        } else if(!scatter && this.isScatter){
            this.isScatter = false;
            this.dir = (this.dir + 2) % 4;
        }

        // movement
        switch(this.dir){
            case 0: // up
                if(matrix[this.realY - 1][this.realX] == 0 || matrix[this.realY - 1][this.realX] == 2 || matrix[this.realY - 1][this.realX] == 34 || matrix[this.realY - 1][this.realX] == 35){
                    this.y-=this.speed;
                }
                break;
            case 1: // right
                if(matrix[this.realY][this.realX + 1] == 0 || matrix[this.realY][this.realX + 1] == 2 || matrix[this.realY][this.realX + 1] == 34 || matrix[this.realY][this.realX + 1] == 35){
                    this.x+=this.speed;
                }
                break;
            case 2: // down
                if(matrix[this.realY + 1][this.realX] == 0 || matrix[this.realY + 1][this.realX] == 2 || matrix[this.realY + 1][this.realX] == 34 || matrix[this.realY + 1][this.realX] == 35){
                    this.y+=this.speed;
                }
                //if(this.eaten) this.y+=this.speed;
                break;
            case 3: // left
                if(matrix[this.realY][this.realX - 1] == 0 || matrix[this.realY][this.realX - 1] == 2 || matrix[this.realY][this.realX - 1] == 34 || matrix[this.realY][this.realX - 1] == 35){
                    this.x-=this.speed;
                }
                break;
        }

        // If ghost gets stuck reset it's position to the nearest valid position
        if(this.lastX == this.x && this.lastY == this.y){
            this.x = this.realX * scale;
            this.y = this.realY * scale;
        }

        this.lastX = this.x;
        this.lastY = this.y;

        // Tunnel
        if(this.x <= scale && this.y == 16 * scale){
            if(this.dir == 3) this.x-=this.speed;
            if(this.x < -1 * scale) this.x = 28 * scale
        }
        if(this.x >= 27 * scale && this.y == 16 * scale){
            if(this.dir == 1) this.x+=this.speed;
            if(this.x > 29 * scale) this.x = -1 * scale
        }

        // While eaten reset it's position to the nearest whole position
        if(this.eaten){
            if(this.x - this.realX * scale > -4 && this.x - this.realX * scale < 4) this.x = this.realX * scale;
            if(this.y - this.realY * scale > -4 && this.y - this.realY * scale < 4) this.y = this.realY * scale;
        }
    }
}
