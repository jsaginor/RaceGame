// const wrapper = document.getElementById("canvas-wrapper");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const FPS = 60;

let resize = () => {
    canvas.width = board.width;
    canvas.height = board.height;

    board.draw();
}

let board = new Board("../maps/01.json", 50);

let started, playerCount, players, playerMoves, turn, moveTimer;

function reset() {
    started = false;
    playerCount = 2;
    players = [];
    playerMoves = [];
    turn = 0;
    moveTimer = 0;
    document.getElementById("menu").style.display = "";
}

reset();

window.onload = () => {
    setInterval(() => {
        resize();
        if (!started) return;

        // pre-game (deploying cars)
        if (players.length != playerCount) {
            for (let i = 0; i < players.length; i++) {
                players[i].draw(board);
            }

            for (let i = 0; i < players.length; i++) {
                if (board.tileHovered.x == players[i].x && board.tileHovered.y == players[i].y) return;
            }

            if (board.collision(board.tileHovered.x, board.tileHovered.y) != "start") return;
            let color = playerColors[players.length];
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1.0)`;
            ctx.beginPath();
            ctx.arc(
                (board.tileSize * (board.tileHovered.x)) + (board.tileSize / 2), 
                (board.tileSize * (board.tileHovered.y)) + (board.tileSize / 2), 
                board.tileSize / 5, 
                0, 
                2 * Math.PI
            );
            ctx.fill();
            return;
        };

        // moving animation
        if (playerMoves.length == playerCount) {
            if (moveTimer >= 1.0) {
                console.log(playerMoves);
                for (let i = 0; i < playerMoves.length; i++) {
                    players[i].move(playerMoves[i].x, playerMoves[i].y);
                }
                moveTimer = 0;
                playerMoves = [];
                return;
            }

            for (let i = 0; i < playerMoves.length; i++) {
                let pos = lerp(players[i].pos, playerMoves[i], moveTimer);
                players[i].draw(board, pos);
            }

            moveTimer += 0.1;
            return;
        }

        // during game
        if (players[turn].legalMoves.length == 0) {
            playerMoves.push(players[turn].nextMove);
            nextTurn();
        }

        players[turn].drawMoveIndicators(board);

        for (let i = 0; i < playerMoves.length; i++) {
            players[i].draw(board, playerMoves[i], 0.3);
        }
        
        for (let i = 0; i < players.length; i++) {
            players[i].draw(board);
        }

        // ctx.drawImage(crt, -75, -40, window.innerWidth + 150, window.innerHeight + 80);

    }, 1000 / FPS);
};

window.onclick = () => {
    const collision = board.collision(board.tileHovered.x, board.tileHovered.y);
    if (!started) return;
    
    // pre-game (deploying cars)
    if (players.length != playerCount) {
        if (collision != "start") return;
        for (let i = 0; i < players.length; i++) {
            if (board.tileHovered.x == players[i].x && board.tileHovered.y == players[i].y) return;
        }
        players.push(new Player(board.tileHovered.x, board.tileHovered.y, playerColors[players.length]));
        return;
    }

    // during game
    if (playerMoves.length == playerCount) return;
    for (let tile of players[turn].legalMoves) {
        if (tile.x == board.tileHovered.x && tile.y == board.tileHovered.y) {
            playerMoves.push(board.tileHovered);
            nextTurn();
            return;
        }
    }
}

window.onresize = resize;

let mouse = {
    x: 0,
    y: 0
}

window.onmousemove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

const start = () => {
    started = true;
    document.getElementById("menu").style.display = "none";
    for (let i = playerColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playerColors[i], playerColors[j]] = [playerColors[j], playerColors[i]];
    }
}

function lerp(a, b, t) {
    return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t
    };
}

function nextTurn() {
    turn += 1;
    if (turn == players.length) turn = 0;
}