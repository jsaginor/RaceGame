let selected = "none";

function selectTool(tool) {
    for (let button of document.querySelectorAll(".radial")) {
        button.dataset.selected = false;
    }
    selected = tool;
    let button = document.getElementById(tool + "-tile-button");
    button.dataset.selected = true;
}