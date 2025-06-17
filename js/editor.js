const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWrapper = document.getElementById("canvas-wrapper");

let board = new Board("../maps/template.json", 10);

const resize = () => {
    canvas.width = board.width;
    canvas.height = board.height;

    board.draw();
}

window.onload = () => {

    setInterval(() => {
        resize();

        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = 5;
        ctx.strokeRect(
            board.xOffset - 5, 
            board.yOffset - 5, 
            board.tileSize * board.data.width + 10, 
            board.tileSize * board.data.height + 10
        );

        if (board.tileHovered.x < 0) return;
        if (board.tileHovered.y < 0) return;
        if (board.tileHovered.x >= board.data.width) return;
        if (board.tileHovered.y >= board.data.height) return;

        if (selected == "wall") {
            board.colorTile(board.tileHovered.x, board.tileHovered.y, {r: 100, g: 100, b: 100});
        }
    
        if (selected == "start") {
            board.colorTile(board.tileHovered.x, board.tileHovered.y, {r: 255, g: 255, b: 0}, 0.5);
        }
    
        if (selected == "end") {
            board.colorTile(board.tileHovered.x, board.tileHovered.y, {r: 0, g: 255, b: 0}, 0.5);
        }
        
        if (mouse.down) {
            
            if (board.tileExists(board.tileHovered.x, board.tileHovered.y)) {
                board.removeTile(board.tileHovered.x, board.tileHovered.y);
            }

            board.addTile(board.tileHovered.x, board.tileHovered.y, selected);
        }

    }, 1000 / 60);
}

window.onresize = resize;

let mouse = {
    x: 0,
    y: 0,
    down: false
}

window.onmousemove = (e) => {
    let x = e.clientX;
    let y = e.clientY;

    mouse.x = x;
    mouse.y = y;
}

window.onmousedown = () => {
    mouse.down = true;
    // if (board.tileHovered.x < 0) return;
    // if (board.tileHovered.y < 0) return;
    // if (board.tileHovered.x >= board.data.width) return;
    // if (board.tileHovered.y >= board.data.height) return;

    // board.data.walls.push(board.tileHovered);

    // for (let tile of board.data.walls) {

    // }
}

window.onmouseup = () => {
    mouse.down = false;
}

function save() {
    console.log(JSON.stringify(board.data))
}