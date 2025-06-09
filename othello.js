const board = document.getElementById("board");

// 8×8マスを作成
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = row;
        cell.dataset.col = col;
        board.appendChild(cell);
    }
}

// 初期配置（中央4つ）
function placeInitialStones() {
    placeStone(3, 3, "white");
    placeStone(3, 4, "black");
    placeStone(4, 3, "black");
    placeStone(4, 4, "white");
}

function placeStone(row, col, color) {
    const cells = document.querySelectorAll(".cell");
    const index = row * 8 + col;
    const cell = cells[index];

    const stone = document.createElement("div");
    stone.className = `stone ${color}`;
    cell.appendChild(stone);
}

let currentPlayer = "black"; // 最初の手番は黒

// すべてのセルにクリックイベントをつける
document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (cell.children.length > 0) return;

        // すでに石がある場所には置けない
        const toFlip = getFlippableStones(row, col, currentPlayer);

        if (toFlip.length === 0) return;

        // 石を置く
        placeStone(row, col, currentPlayer);
	
        toFlip.forEach(([r, c]) => flipStone(r, c, currentPlayer));

        // 手番を交代
        currentPlayer = currentPlayer === "black" ? "white" : "black";

        updateTurnDisplay();

        if (!hasValidMove(currentPlayer)) {
            alert(`${currentPlayer === "black" ? "黒" : "白"}は置ける場所がありません。スキップします。`);
            currentPlayer = currentPlayer === "black" ? "white" : "black";
            if (!hasValidMove(currentPlayer)) {
            endGame(); // 両者置けない→終了
            }
        }

        updateTurnDisplay();
    });
});

function updateTurnDisplay() {
    const turnDisplay = document.getElementById("turnDisplay");
    turnDisplay.textContent = `${currentPlayer === "black" ? "黒" : "白"}の番です`;
}

function placeStone(row, col, color) {
    const cells = document.querySelectorAll(".cell");
    const index = row * 8 + col;
    const cell = cells[index];

    const stone = document.createElement("div");
    stone.className = `stone ${color}`;
    cell.appendChild(stone);
}
function isValidMove(row, col, color) {
    if (!isInBounds(row, col) || getStone(row, col)) return false;

    return getFlippableStones(row, col, color).length > 0;
}

function getFlippableStones(row, col, color) {
    const directions = [
        [-1,  0], [1,  0], // 上下
        [ 0, -1], [0,  1], // 左右
        [-1, -1], [-1, 1], // 左上・右上
        [ 1, -1], [ 1, 1]  // 左下・右下
    ];

    const opponent = color === "black" ? "white" : "black";
    const flippable = [];

    for (let [dx, dy] of directions) {
        let r = row + dx;
        let c = col + dy;
        let path = [];

        while (isInBounds(r, c) && getStone(r, c) === opponent) {
            path.push([r, c]);
            r += dx;
            c += dy;
        }

        if (isInBounds(r, c) && getStone(r, c) === color) {
            flippable.push(...path);
        }
    }

    return flippable;
}

function isInBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getStone(row, col) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    const stone = cell.querySelector(".stone");
    if (!stone) return null;
    return stone.classList.contains("black") ? "black" : "white";
}
function flipStone(row, col, color) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    const stone = cell.querySelector(".stone");
    if (stone) {
        stone.className = `stone ${color}`; // 色を変えるだけ
    }
}

function hasValidMove(color) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(r, c, color)) return true;
        }
    }
    return false;
}

function endGame() {
    let blackCount = 0;
    let whiteCount = 0;

    document.querySelectorAll(".stone").forEach(stone => {
        if (stone.classList.contains("black")) blackCount++;
        if (stone.classList.contains("white")) whiteCount++;
    });

    let result = "";
    if (blackCount > whiteCount) {
        result = `黒の勝ち！ (${blackCount} 対 ${whiteCount})`;
    } else if (whiteCount > blackCount) {
        result = `白の勝ち！ (${whiteCount} 対 ${blackCount})`;
    } else {
        result = `引き分け！ (${blackCount} 対 ${whiteCount})`;
    }

    alert("ゲーム終了！\n" + result);
}

placeInitialStones();
updateTurnDisplay();