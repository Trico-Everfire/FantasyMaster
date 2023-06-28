class Cell {
    rowNumb: number;
    colNum: number;
    parentSize: number;
    isCorner: boolean;
    isLeftCorner: boolean;
    isRightCorner: boolean;
    isBottomCorner: boolean;
    istopCorner: boolean;
    lootTable: never[];
    isRoomCenter: boolean;
    visited: boolean;
    walls: { topWall: boolean; bottomWall: boolean; leftWall: boolean; rightWall: boolean };
    /**
     * @param {number} rowNumb
     * @param {number} colNum
     * @param {Array} parentGrid
     * @param {number} parentSize
    // * @param {CanvasRenderingContext2D} canvas
     */
    constructor(rowNumb: number, colNum: number, parentSize: number) {
        this.rowNumb = rowNumb;
        this.colNum = colNum;
        this.parentSize = parentSize;
        this.isCorner = false;
        this.isLeftCorner = false;
        this.isRightCorner = false;
        this.isBottomCorner = false;
        this.istopCorner = false;
        this.lootTable = [];
        this.isRoomCenter = false;
        this.visited = false;
        this.walls = {
            topWall: true,
            bottomWall: true,
            leftWall: true,
            rightWall: true,
        };
    }
}

export default Cell;
