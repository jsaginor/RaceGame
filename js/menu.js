const maps = ["01", "02", "03", "04", "05"];
const mapText = document.getElementById("map-text");
const playerText = document.getElementById("player-text");
let mapIndex = 0;

function selectMap(right) {
    if (right) mapIndex -= 1;
    if (!right) mapIndex += 1;

    if (mapIndex > maps.length - 1) mapIndex = 0;
    if (mapIndex < 0) mapIndex = maps.length - 1;

    board = new Board(`../maps/${maps[mapIndex]}.json`);
    mapText.innerHTML = "Track: " + maps[mapIndex];
}

function changePlayerCount(num) {
    playerCount += num;
    if (playerCount < 1) playerCount = 1;
    if (playerCount > 8) playerCount = 8;
    playerText.innerHTML = "Players: " + playerCount;
}