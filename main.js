"use strict";


// initialize canvas...
const canvas = document.getElementById("mainCanvas");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;
const ctx = canvas.getContext("2d");


/* create maze from string.
    Todo oneday maybe: try to read this from a file...
    credit for this comes from Stanford CS106b homework assignment 2
*/
const mazeString = (
"-----------@-@---------@---@-----@-----@-\n" +
"@@@@@@@@-@@@-@@@@@-@-@@@-@@@-@-@@@@@-@@@-\n" +
"-@-----@-----@-----@---------@-------@---\n" +
"-@-@-@-@@@-@@@-@@@-@@@@@@@@@@@-@-@-@@@-@-\n" +
"---@-@-@-----@-@-----@-----@-@-@-@-@---@-\n" +
"@@-@@@@@-@@@-@-@@@@@@@-@@@@@-@-@-@-@@@-@@\n" +
"-@-----@-@-@-----@---@-@-------@-@---@---\n" +
"-@-@-@-@@@-@@@-@-@-@@@-@-@@@@@@@-@@@-@-@@\n" +
"---@-@---@-@-@-@-------@-----@-@---@-@---\n" +
"@@@@@@-@@@-@-@@@@@-@@@-@@@@@@@-@-@@@-@-@-\n" +
"-@---@-@-----@-----@---------@---@-@---@-\n" +
"-@-@-@-@@@@@-@@@@@@@-@@@@@@@-@@@-@-@-@@@@\n" +
"-@-@-----------------@-------@-@-@---@---\n" +
"-@@@-@-@@@@@@@-@@@-@@@@@-@@@-@-@@@@@@@-@@\n" +
"-@---@---@---@-@-@---@-----@-@-@-@-------\n" +
"-@@@-@-@@@-@@@-@-@@@-@-@@@@@@@-@-@-@@@@@-\n" +
"-----@---@-@-@---@-@-@---------@-------@-\n" +
"@@@@-@@@@@-@-@@@@@-@@@@@-@-@@@-@@@@@-@@@@\n" +
"-@-----@---@-----------@-@-@---@---@-----\n" +
"-@-@-@-@@@-@@@-@@@-@@@@@-@-@@@@@-@@@@@-@@\n" +
"-@-@-@-@-@-@---@---@-@---@-@---------@---\n" +
"-@@@-@@@-@-@-@-@@@@@-@@@@@@@@@@@-@@@@@-@@\n" +
"-----@-----@-@-@-@---@-----------@-@-@-@-\n" +
"-@-@-@@@@@-@-@-@-@-@-@-@-@@@@@-@-@-@-@-@-\n" +
"-@-@---@-----@-@-@-@-@-@---@---@-@-----@-\n" +
"-@@@@@@@@@@@@@-@-@-@@@@@@@-@@@@@-@@@-@@@-\n" +
"---@-----------@-@-----@---@---@---@---@-\n" +
"@@-@-@@@@@@@@@-@-@-@-@@@-@-@@@-@-@-@-@@@-\n" +
"-@---@-@-@---@-----@-----@---@-@-@-------\n" +
"-@-@@@-@-@-@@@-@@@-@@@@@@@-@@@-@@@-@@@-@-\n" +
"---------@-----@-------@-@-----@---@---@-\n" +
"@@-@-@@@@@-@@@@@@@-@-@@@-@-@@@@@@@-@@@@@-\n" +
"---@---@-----@-----@---@-----@---------@-")
const numRowsInMaze = 33;
const numColsInMaze = 41;

let mazeGrid = (function() {
    let maze = [[]];
    let row = 0;
    for (let i = 0; i < mazeString.length; i++) {
        switch (mazeString[i]) {
            case "@": 
                maze[row].push(false);
                break;
            case "-":
                maze[row].push(true);
                break;
            case "\n":
                row++;
                maze.push([])
        }
    }
    return maze;
})();
mazeGrid = mazeGrid.map((elem1, row) => 
    elem1.map((elem2, col) => ({
        col: col,
        row: row,
        isOpen: elem2
    }))
)

/* This is a helper method used to draw a cell*/
function drawCell(cellInfo, color) {
    ctx.fillStyle = color;
    ctx.fillRect(
        cellInfo.col * (canvas.width / numColsInMaze),
        cellInfo.row * (canvas.height / numRowsInMaze),
        (canvas.width / numColsInMaze),
        (canvas.height / numRowsInMaze)
    );
}

// Draw Maze:
for (let elem of mazeGrid) {
    for (let cell of elem) {
        if (!cell.isOpen) drawCell(cell, "black");
    }
}
drawCell(mazeGrid[0][0], "green");
drawCell(mazeGrid[mazeGrid.length - 1][mazeGrid[0].length - 1], "orange");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// Breadth First Search

function followPath(path) {
    for (let i = 0; i < path.length; i++) {
        mazeGrid[path[i].row][path[i].col].isOpen = false;
    }
}

function unfollowPath(path) {
    for (let i = 0; i < path.length; i++) {
        mazeGrid[path[i].row][path[i].col].isOpen = true;
    }
}

function validatePath(path) {
    //check 1: does path reach end
    if (path[path.length - 1].row !== numRowsInMaze - 1) return false
    if (path[path.length - 1].col !== numColsInMaze - 1) return false

    //check 2: does path go through walls
    for (let i = 0; i < path.length; i++) {
        if (!(mazeGrid[path[i].row][path[i].col].isOpen)) {
            unfollowPath(path);
            return false;
        }
        mazeGrid[path[i].row][path[i].col].isOpen = false;
    }
    unfollowPath(path);
    return true;
}

function doesCellExist(row, col) {
    if (row >= 0 && row < mazeGrid.length)
        if (col >= 0 && col < mazeGrid[0].length)
            return true;
    return false;
}

function drawPath(path, color) {
    for (let cell of path) {
        drawCell(cell, color);
    }
}

function DFS() {
    const pathList = [[{row: 0, col: 0}]];
    const pathsTested = [];

    let currentPath;
    while (validatePath(currentPath = pathList.pop()) === false) {

        pathsTested.push(currentPath);

        // the search part
        followPath(currentPath);
        let currentCell = currentPath.pop();
        // check space above
        if (doesCellExist(currentCell.row - 1, currentCell.col) &&
                mazeGrid[currentCell.row - 1][currentCell.col].isOpen)
            pathList.push(currentPath.concat([currentCell, 
                        {row: currentCell.row - 1, col: currentCell.col}]));
        // check space below
        if (doesCellExist(currentCell.row + 1, currentCell.col) &&
                mazeGrid[currentCell.row + 1][currentCell.col].isOpen)
            pathList.push(currentPath.concat([currentCell, 
                        {row: currentCell.row + 1, col: currentCell.col}]));
        // check space to left
        if (doesCellExist(currentCell.row, currentCell.col - 1) &&
                mazeGrid[currentCell.row][currentCell.col - 1].isOpen)
            pathList.push(currentPath.concat([currentCell, 
                        {row: currentCell.row, col: currentCell.col - 1}]));
        // check space to right
        if (doesCellExist(currentCell.row, currentCell.col + 1) &&
                mazeGrid[currentCell.row][currentCell.col + 1].isOpen)
            pathList.push(currentPath.concat([currentCell, 
                        {row: currentCell.row, col: currentCell.col + 1}]));
        
        // clean up
        unfollowPath(currentPath);
        mazeGrid[currentCell.row][currentCell.col].isOpen = true;
    }
    
    pathsTested.push(currentPath);
    return pathsTested;
}

function animateDFS() {
    const pathsTested = DFS();

    let i = 1
    function draw() {
        drawPath(pathsTested[i - 1], "white");
        drawPath(pathsTested[i], "green");
        i++;
        if (i == pathsTested.length) {
            clearInterval(s1);
        }
    }
    let s1 = setInterval(draw, 50);
    

}
