const DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
};

const DIRECTIONS_TEXT = {
    UP: '↑',
    RIGHT: '→',
    DOWN: '↓',
    LEFT: '←',
}

const faceColors = {
    0: 'greenyellow', // Surface (default color)
    1: 'yellow',    // Top face
    2: 'red',       // Right face
    3: 'blue',      // Back face
    4: 'white',     // Bottom face
    5: 'orange',    // Left face
};


const face = {
    SURFACE: 0,
    TOP: 1,
    RIGHT: 2,
    BACK: 3,
    BOTTOM: 4,
    LEFT: 5,
};

class Face {
    constructor(pieceContent, size = 3) {
        this.size = size;
        this.pieceContent = pieceContent;
        this.facePieces = this.createFace();
        this.isAligned = false;
        this.updateAligned();
    }

    createFace() {
        const facePieces = [];
        for (let i = 0; i < this.size; i++) {
            const row = Array.from({ length: this.size }, () => this.pieceContent);
            
            facePieces.push(row);
        }
        return facePieces;
    }

    rotateFace(direction) {
        const currentFacePieces = [...this.facePieces];
        const numRows = currentFacePieces.length;
        const numCols = currentFacePieces[0].length;
    
        // 新しい配列を初期化
        const rotatedFacePieces = new Array(numCols);
        for (let col = 0; col < numCols; col++) {
            rotatedFacePieces[col] = new Array(numRows);
        }
    
        for (let col = 0; col < numCols; col++) {
            for (let row = 0; row < numRows; row++) {
                let newRow, newCol;
                if (direction === DIRECTIONS.LEFT) {
                    newRow = row;
                    newCol = numCols - 1 - col;
                } else if (direction === DIRECTIONS.RIGHT) {
                    newRow = numRows - 1 - row;
                    newCol = col;
                }
                rotatedFacePieces[newCol][newRow] = currentFacePieces[row][col];
            }
        }

        // this.facePieces を更新
        this.facePieces = rotatedFacePieces;
    }

    flipFace(flipDirection) {
        const currentFacePieces = [...this.facePieces];
        const numRows = currentFacePieces.length;
        const numCols = currentFacePieces[0].length;
        const isVertical = flipDirection === DIRECTIONS.UP || flipDirection === DIRECTIONS.DOWN;
    
        // 新しい配列を初期化
        const flippedFacePieces = new Array(numRows);
        for (let row = 0; row < numRows; row++) {
            flippedFacePieces[row] = new Array(numCols);
        }
    
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                let newRow, newCol;
                if (isVertical) {
                    // 上下反転
                    newRow = numRows - 1 - row;
                    newCol = col;
                } else {
                    // 左右反転
                    newRow = row;
                    newCol = numCols - 1 - col;
                }
                flippedFacePieces[newRow][newCol] = currentFacePieces[row][col];
            }
        }
    
        // this.facePieces を更新
        this.facePieces = flippedFacePieces;
    }

    getLine(lineNumber, isRow) {
        if (typeof lineNumber !== 'number' || lineNumber < 0 || lineNumber >= this.facePieces.length) {
            throw new Error('Invalid line number');
        }
    
        if (typeof isRow !== 'boolean') {
            throw new Error('Invalid value for isRow parameter');
        }
    
        if (isRow) {
            // 行 (row) を取得
            return this.facePieces[lineNumber];
        } else {
            // 列 (column) を取得
            const lines = [];
    
            for (let i = 0; i < this.facePieces.length; i++) {
                if (!Array.isArray(this.facePieces[i]) || typeof this.facePieces[i][lineNumber] === 'undefined') {
                    throw new Error('Invalid structure in facePieces');
                }
    
                const line = this.facePieces[i][lineNumber];
                lines.push(line);
            }
    
            return lines;
        }
    }
    
    setLine(line, lineNumber, isRow) {
        if (typeof lineNumber !== 'number' || lineNumber < 0 || lineNumber >= this.facePieces.length) {
            throw new Error('Invalid line number');
        }
    
        if (typeof isRow !== 'boolean') {
            throw new Error('Invalid value for isRow parameter');
        }
    
        if (isRow) {
            // 行 (row) を設定
            if (!Array.isArray(line) || line.length !== this.facePieces[lineNumber].length) {
                throw new Error('Invalid line structure');
            }
    
            this.facePieces[lineNumber] = line.slice(); // 行をコピーして設定
        } else {
            // 列 (column) を設定
            for (let i = 0; i < this.facePieces.length; i++) {
                if (!Array.isArray(this.facePieces[i]) || typeof this.facePieces[i][lineNumber] === 'undefined') {
                    throw new Error('Invalid structure in facePieces');
                }
    
                if (typeof line[i] === 'undefined') {
                    throw new Error('Invalid line structure');
                }
    
                this.facePieces[i][lineNumber] = line[i];
            }
        }
    }
    
    updateAligned() {
        // 最初の行の最初の要素を基準値として取得
        const firstValue = this.facePieces[0][0];

        // 各要素をチェックして基準値と一致するか確認
        for (let i = 0; i < this.facePieces.length; i++) {
            for (let j = 0; j < this.facePieces[i].length; j++) {
                if (this.facePieces[i][j] !== firstValue) {
                    this.isAligned = false; // 一致しない要素が見つかった場合はfalseを返す
                    return false;
                }
            }
        }

        this.isAligned = true;
        return true;
    }
}

class Cube {
    constructor() {
        this.faces = {
            SURFACE: new Face(face.SURFACE),
            TOP: new Face(face.TOP),
            RIGHT: new Face(face.RIGHT),
            BACK: new Face(face.BACK),
            BOTTOM: new Face(face.BOTTOM),
            LEFT: new Face(face.LEFT),
        };
        this.init();
    }

    init() {
        const surfaceFace = this.getFacePieces('SURFACE');

        if (surfaceFace) {
            const surfaceFaceHTML = createSurfaceFaceHTML(surfaceFace);
            const container = document.getElementById('surface-container');
            container.appendChild(surfaceFaceHTML);
        }
    }

    getFacePieces(faceName) {
        return this.faces[faceName]?.facePieces || null;
    }

    getFacesKeyOfRotationDirection = (directionName) => {
        const direction = DIRECTIONS[directionName];
        const isVertical = direction % 2 === 0;
        const isPositiveDirection = direction < 2;
        const totalFaces = 6;
        let facesInDirection = [];
        let facesInSideDirection = [];
    
        for (let i = 0; Math.abs(i) < totalFaces; i -= isPositiveDirection ? 1 : -1) {
            const currentFaceIndex = (i + totalFaces) % totalFaces;
            const currentFace = Object.keys(face)[currentFaceIndex];
    
            const shouldSkip = isVertical ? (currentFaceIndex + 1) % 3 === 0 : (currentFaceIndex + 2) % 3 === 0;
            if (shouldSkip) {
                facesInSideDirection.push(currentFace);
                continue;
            }
    
            facesInDirection.push(currentFace);
        }

        if (!isVertical) {
            facesInSideDirection.reverse();
        }

        return [facesInDirection, facesInSideDirection];
    }

    rotateCube(directionName) {
        const [facesInDirection, facesInSideDirection] = this.getFacesKeyOfRotationDirection(directionName);
        let previousFace = this.faces[facesInDirection[facesInDirection.length - 1]];
        const oppositeFace = this.faces['BACK'];
        oppositeFace.flipFace(DIRECTIONS[directionName]);

        for (const faceKey of facesInDirection) {
            const currentFace = this.faces[faceKey];
            
            if (faceKey === 'BACK') {
                previousFace.flipFace(DIRECTIONS[directionName]);
            }

            this.faces[faceKey] = previousFace;

            previousFace = currentFace;
        }
        
        for (let i = 0; i < facesInSideDirection.length; i++) {
            const faceKey = facesInSideDirection[i];
            const face = this.faces[faceKey];
            const rotateFaceDirection = i % 2 === 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
            
            face.rotateFace(rotateFaceDirection);
        }

        updateSurfaceFaceHTML();
    }

    rotateLine(lineNumber, directionName, isUpdateHTML = true) {
        const direction = DIRECTIONS[directionName];
        const isRow = direction % 2 !== 0;
        const [facesInDirection, facesInSideDirection] = this.getFacesKeyOfRotationDirection(directionName);
        
        const lines = [];
        for (const faceKey of facesInDirection) {
            const face = this.faces[faceKey];
            const line = face.getLine(lineNumber, isRow);
            lines.push(line);
        }
        

        let count = 0;
        for (const faceKey of facesInDirection) {
            const index = (count + 1) % facesInDirection.length;
            const face = this.faces[faceKey];
            face.setLine(lines[index], lineNumber, isRow);
            face.updateAligned();
            count++;
        }

        this.checkAligned();
        
        if (isUpdateHTML) {
            updateSurfaceFaceHTML();
        }
    }

    randomRotate(number) {
        const faceArray = Object.values(face);
        for(let faceNumber of faceArray) {
            const faceName = Object.keys(face)[faceNumber];
            this.rotateCube(faceName);
  
            for (let i = 0; i < number; i++) {
                const line = Math.floor(Math.random() * 3);
                const direction = Object.keys(DIRECTIONS)[Math.floor(Math.random() * 4)];
                this.rotateLine(line, direction, false);
            }
        }

        updateSurfaceFaceHTML();
    }

    checkAligned() {
        const facesArray = Object.values(this.faces); // this.facesのプロパティ値を配列に変換
    
        for (let face of facesArray) {
            if (!face.isAligned) {
                setAlignedDisplayState(false);
                return false;
            }
        }
        
        setAlignedDisplayState(true);
        return true;
    }
}

const cube = new Cube();
cube.randomRotate(30);

// HTML要素を作成するための関数
function createSurfaceFaceHTML(faceData) {
    const table = document.createElement('table');
    table.classList.add('surface-table');

    faceData.forEach((rowContent) => {
        const row = table.insertRow();
        rowContent.forEach((cellContent) => {
            const cell = row.insertCell();
            cell.classList.add('cell');
    
            // Determine the background color based on the cell content (face index)
            const faceIndex = parseInt(cellContent); // Assuming cellContent is a number representing face index
            const color = faceColors[faceIndex] || faceColors[0]; // Use default color if face index is not found
    
            cell.style.backgroundColor = color;
        });
    });

    return table;
}

// HTML要素を更新するための関数
function updateSurfaceFaceHTML() {
    const faceData = cube.getFacePieces('SURFACE');
    const container = document.getElementById('surface-container');
    container.innerHTML = ''; // コンテナ内の要素をクリア

    const table = document.createElement('table');
    table.classList.add('surface-table');

    faceData.forEach((rowContent) => {
        const row = table.insertRow();
        rowContent.forEach((cellContent) => {
            const cell = row.insertCell();
            cell.classList.add('cell');
    
            // Determine the background color based on the cell content (face index)
            const faceIndex = parseInt(cellContent); // Assuming cellContent is a number representing face index
            const color = faceColors[faceIndex] || faceColors[0]; // Use default color if face index is not found
    
            cell.style.backgroundColor = color;
        });
    });

    container.appendChild(table);
}

function setAlignedDisplayState(state) {
    const bodyElement = document.body;

    if (state === true) {
        bodyElement.style.backgroundColor = 'chartreuse';
    } else {
        bodyElement.style.backgroundColor = 'ghostwhite';
    }
}

// 回転ボタンを押したときの処理
const rotateCubeFromUI = (directionName) => {
    cube.rotateCube(directionName);
}

const rotateLineFromUI = (line, directionName) => {
    cube.rotateLine(line, directionName);
};

const createMoveLineButtons = (directionName, container) => {
    for (let i = 0; i < 3; i++) {
        const rotateButton = document.createElement('button');
        rotateButton.textContent = DIRECTIONS_TEXT[directionName]; // 正しいテキストを設定

        rotateButton.onclick = () => {
            // ボタンがクリックされたときに rotateLineFromUI を呼び出す
            rotateLineFromUI(i, directionName); // i と direction を引数として渡す
        };

        container.appendChild(rotateButton);
    }
};


const topContainer = document.getElementById('top-buttons');
const bottomContainer = document.getElementById('bottom-buttons');
const leftContainer = document.getElementById('left-buttons');
const rightContainer = document.getElementById('right-buttons');

// 上下左右それぞれの方向のボタンを作成し、controlsDiv に追加する
const upButtonsContainer = createMoveLineButtons('UP', topContainer);
const downButtonsContainer = createMoveLineButtons('DOWN', bottomContainer);
const leftButtonsContainer = createMoveLineButtons('LEFT', leftContainer);
const rightButtonsContainer = createMoveLineButtons('RIGHT', rightContainer);
