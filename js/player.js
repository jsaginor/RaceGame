class Player {
    x;
    y;
    color; // {r, g, b} object
    prevVel;

    get nextMove() {
        return {
            x: this.x + this.prevVel.x,
            y: this.y + this.prevVel.y
        }
    }

    get legalMoves() {
        let openTiles = [];
        const nextX = this.nextMove.x;
        const nextY = this.nextMove.y; 
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (nextX + x < 0) continue;
                if (nextY + y < 0) continue;
                if (nextX + x >= board.data.width) continue;
                if (nextY + y >= board.data.height) continue;
                
                const collision = board.collision(nextX + x, nextY + y);
                if (collision != "none" && collision != "end") continue;

                openTiles.push({
                    x: x + nextX,
                    y: y + nextY
                });
            }
        }

        for (let tile of this.raycast(this.nextMove, "end")) {
            let exists = false;
            for (let tile2 of openTiles) {
                if (tile.x === tile2.x && tile.y === tile2.y) exists = true;
            } 
            if (exists) continue;
            openTiles.push(tile);
        }

        return openTiles;
    }

    get pos() {
        return {
            x: this.x,
            y: this.y
        }
    }

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.prevVel = {
            x: 0,
            y: 0
        };
    }

    move(x, y) {
        this.prevVel = {
            x: x - this.x,
            y: y - this.y
        };

        this.x = x;
        this.y = y;
    }

    draw(board, offset =  {x: this.x, y: this.y}, opacity = 1.0) {
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${opacity})`
        ctx.beginPath();
        ctx.arc(
            board.tileSize * (offset.x) + (board.tileSize / 2), 
            board.tileSize * (offset.y) + (board.tileSize / 2), 
            board.tileSize / 5, 
            0, 
            2 * Math.PI
        );
        ctx.fill();
    }

    // tiles is an array of {x, y} objects that are where the indicators should be drawn
    drawMoveIndicators(board) {
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1.0)`
        for (let tile of this.legalMoves) {
            // let xPos = this.x + tile.x;
            // let yPos = this.y + tile.y;

            let opacity = 0.3;

            if (tile.x == board.tileHovered.x && tile.y == board.tileHovered.y) {
                opacity = 0.6;
            }

            // tile.x += this.prevVel.x;
            // tile.y += this.prevVel.y;

            this.draw(board, tile, opacity);
        }
    }

    raycast(tile, type) {
        // console.log("Dude");
        const points = [];
        let x0 = this.x;
        let y0 = this.y;
        let x1 = tile.x;
        let y1 = tile.y;
    
        // Calculate differences and steps
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        
        let err = dx - dy;
        
        while (true) {
            points.push({x: x0, y: y0}); // Store the point
            
            // Check if we've reached the end
            if (x0 === x1 && y0 === y1) break;
            
            let e2 = 2 * err;
            
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }

        let collisions = [];

        for (let point of points) {
            let collision = board.collision(point.x, point.y);
            if (collision == type) collisions.push(point);
            // collisions.push();
        }

        // console.log(collisions);

        return collisions;
    }
}

let playerColors = [
    {r: 255, g: 0, b: 0}, // red
    {r: 0, g: 255, b: 0}, // green
    {r: 0, g: 0, b: 255}, // blue
    {r: 0, g: 0, b: 0}, // black
    {r: 255, g: 255, b: 255}, // white
    {r: 255, g: 255, b: 0}, // yellow
    {r: 0, g: 255, b: 255}, // cyan
    {r: 255, g: 0, b: 255} // pink
]