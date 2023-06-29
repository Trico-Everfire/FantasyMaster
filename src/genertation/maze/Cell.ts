class Cell {
    //Byte sequence: 8 bit storage.
    public readonly walls = { topWall: true, bottomWall: true, leftWall: true, rightWall: true };
    public isCorner = false;
    public isRoomCenter = false;
    public readonly lootTable: boolean[] = [false, false];

    //used only by generation.
    public visited = false;

    public isLeftCorner = false;
    public isRightCorner = false;
    public isBottomCorner = false;
    public istopCorner = false;

    public constructor(public readonly rowNumb: number, public readonly colNum: number, public readonly parentSize: number) {}

    public toCharacter() {
        let byteTable = 0;
        if (this.walls.topWall) byteTable += 1;
        if (this.walls.bottomWall) byteTable += 2;
        if (this.walls.leftWall) byteTable += 4;
        if (this.walls.rightWall) byteTable += 8;
        if (this.isCorner) byteTable += 16;
        if (this.isRoomCenter) byteTable += 32;
        if (this.lootTable[0]) byteTable += 64;
        if (this.lootTable[1]) byteTable += 128;
        return byteTable;
    }

    public fromCharacter(char: number) {
        this.walls.rightWall = false;
        this.walls.leftWall = false;
        this.walls.bottomWall = false;
        this.walls.topWall = false;

        let byteTable = char;
        if (byteTable >= 128) {
            this.lootTable[1] = true;
            byteTable -= 128;
        }
        if (byteTable >= 64) {
            this.lootTable[0] = true;
            byteTable -= 64;
        }
        if (byteTable >= 32) {
            this.isRoomCenter = true;
            byteTable -= 32;
        }
        if (byteTable >= 16) {
            this.isCorner = true;
            byteTable -= 16;
        }
        if (byteTable >= 8) {
            this.walls.rightWall = true;
            byteTable -= 8;
        }
        if (byteTable >= 4) {
            this.walls.leftWall = true;
            byteTable -= 4;
        }
        if (byteTable >= 2) {
            this.walls.bottomWall = true;
            byteTable -= 2;
        }
        if (byteTable == 1) {
            this.walls.topWall = true;
        }
    }
}

export default Cell;
