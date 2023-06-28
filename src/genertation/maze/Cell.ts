class Cell {
    public isCorner = false;
    public isLeftCorner = false;
    public isRightCorner = false;
    public isBottomCorner = false;
    public istopCorner = false;
    public readonly lootTable: never[] = [];
    public isRoomCenter = false;
    public visited = false;
    public readonly walls = { topWall: true, bottomWall: true, leftWall: true, rightWall: true };

    public constructor(public readonly rowNumb: number, public readonly colNum: number, public readonly parentSize: number) {}
}

export default Cell;
