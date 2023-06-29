import { Canvas, CanvasRenderingContext2D } from 'canvas';
import Cell from './Cell';

enum Wall {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
}

class Maze {
    private initiated = false;
    private grid: Cell[][] = [];
    private readonly stack: Cell[] = [];
    // private readonly drawInfo: { isCenter: number[]; playersInMaze: number[] } = { isCenter: [], playersInMaze: [] };
    private firstDraw = true;
    private current: Cell | undefined;

    public constructor(private size: number, private rows: number, private columns: number) {}

    public generate() {
        this.initiated = true;

        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < this.columns; c++) {
                const cell = new Cell(r, c, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }

        this.current = this.grid[0][0];
        while (this.runGeneration() != true);

        this.addRooms();
    }

    public insertExistingMaze(maze: DataView) {
        const rows = Number(maze.getInt32(0));
        const columns = Number(maze.getInt32(4));
        const imageSize = Number(maze.getInt32(8));

        if (Number.isNaN(rows) || Number.isNaN(columns) || Number.isNaN(imageSize)) return;

        console.log('here!');

        this.rows = rows;
        this.columns = columns;
        this.size = imageSize;

        console.log(this.rows);
        console.log(this.columns);

        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < this.columns; c++) {
                const cell = new Cell(r, c, this.size);
                cell.fromCharacter(Number(maze.getUint8(12 + (r + c))));
                row.push(cell);
            }
            this.grid.push(row);
        }

        this.initiated = true;
    }

    public saveMazeData() {
        if (!this.initiated) return new DataView(new ArrayBuffer(0));

        const mazeData = new DataView(new ArrayBuffer(12 + this.rows * this.columns));
        mazeData.setInt32(0, this.rows);
        mazeData.setInt32(4, this.columns);
        mazeData.setInt32(8, this.size);

        for (let r = 0; r < this.rows; r++)
            for (let c = 0; c < this.columns; c++) {
                const cell = this.grid[r][c];
                mazeData.setUint8(12 + (r + c), cell.toCharacter());
            }
        return mazeData;
    }

    public getNonCornerPiece(): { row: number; column: number } {
        const getRow = Math.floor(Math.random() * this.rows) + 1;
        const getCol = Math.floor(Math.random() * this.columns) + 1;
        const cellCol = this.grid[getCol];
        let cell;
        if (cellCol) {
            cell = cellCol[getRow];
        }

        if (cell && cell.isCorner) return this.getNonCornerPiece();
        return { row: getRow, column: getCol };
    }

    public addRooms() {
        const rows = this.rows;
        const columns = this.columns;
        const roomAmnt =
            rows + columns < 40
                ? 0
                : rows + columns < 80
                ? Math.floor(Math.random() * 2) + 1
                : rows + columns < 120
                ? Math.floor(Math.random() * 4) + 2
                : Math.floor(Math.random() * 6) + 3;
        for (let i = 0; i < roomAmnt; i++) {
            const rocol = this.getNonCornerPiece();
            const getRow = rocol.row;
            const getCol = rocol.column;
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    const colCell = this.grid[getCol + j];
                    if (colCell) {
                        const cell = colCell[getRow + k];
                        if (cell && !cell.isCorner) {
                            if (getCol + 1 == getCol + j && getRow + k == getRow + 1) {
                                cell.isRoomCenter = true;
                                const d = Math.random();
                                if (d < 0.5) {
                                    cell.lootTable[0] = false;
                                    cell.lootTable[1] = false;
                                } else if (d < 0.6) {
                                    cell.lootTable[0] = true;
                                    cell.lootTable[1] = false;
                                } else if (d < 0.8) {
                                    cell.lootTable[0] = false;
                                    cell.lootTable[1] = true;
                                } else {
                                    cell.lootTable[0] = true;
                                    cell.lootTable[1] = true;
                                }
                            }

                            cell.walls.leftWall = false;
                            cell.walls.rightWall = false;
                            cell.walls.bottomWall = false;
                            cell.walls.topWall = false;
                        }
                        if (cell && cell.isCorner) {
                            if (!cell.istopCorner) {
                                cell.walls.topWall = false;
                            }
                            if (!cell.isRightCorner) {
                                cell.walls.rightWall = false;
                            }
                            if (!cell.isBottomCorner) {
                                cell.walls.bottomWall = false;
                            }
                            if (!cell.isLeftCorner) {
                                cell.walls.leftWall = false;
                            }
                        }
                    }
                }
            }
        }
    }

    public draw(canvas: Canvas) {
        if (this.initiated) {
            canvas.width = this.size;
            canvas.height = this.size;
            const context = canvas.getContext('2d');
            const original = context.fillStyle;
            context.fillStyle = 'black';
            context.fillRect(0, 0, this.size, this.size);
            context.fillStyle = original;
            for (let r = 0; r < this.rows; r++)
                for (let c = 0; c < this.columns; c++) {
                    const cell = this.grid[r][c];
                    this.show(cell, this.size, this.rows, this.columns, context);
                }
        } else {
            console.warn('maze draw run before initiation, action canceled to prevent fatal error');
        }
    }

    public show(cell: Cell, size: number, rows: number, columns: number, canvas: CanvasRenderingContext2D) {
        const x = (cell.colNum * size) / columns;
        const y = (cell.rowNumb * size) / rows;

        canvas.strokeStyle = 'white';
        canvas.fillStyle = 'black';
        canvas.lineWidth = 2;

        if (cell.walls.topWall) this.drawWall(x, y, size, columns, rows, Wall.TOP, canvas);
        if (cell.walls.bottomWall) this.drawWall(x, y, size, columns, rows, Wall.BOTTOM, canvas);
        if (cell.walls.leftWall) this.drawWall(x, y, size, columns, rows, Wall.LEFT, canvas);
        if (cell.walls.rightWall) this.drawWall(x, y, size, columns, rows, Wall.RIGHT, canvas);

        if (cell.isRoomCenter) {
            if (cell.lootTable[0] == false && cell.lootTable[1] == false) this.highlight(cell, this.columns, 'red', canvas);
            if (cell.lootTable[0] == true && cell.lootTable[1] == false) this.highlight(cell, this.columns, 'green', canvas);
            if (cell.lootTable[0] == false && cell.lootTable[1] == true) this.highlight(cell, this.columns, 'orange', canvas);
            if (cell.lootTable[0] == true && cell.lootTable[1] == true) this.highlight(cell, this.columns, 'purple', canvas);
        }
    }

    public removeWall(cell1: Cell, cell2: Cell) {
        const x = cell1.colNum - cell2.colNum;

        if (x == 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (x == -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }

        const y = cell1.rowNumb - cell2.rowNumb;

        if (y == 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (y == -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
    }

    public highlight(cell: Cell, columns: number, color: string, canvas: CanvasRenderingContext2D, addScaling = 0, isMainCharacter = false) {
        const x = (cell.colNum * this.size) / columns + (1 + addScaling / 2);
        const y = (cell.rowNumb * this.size) / columns + (1 + addScaling / 2);
        if (isMainCharacter) {
            console.log('running Main Character');
            canvas.beginPath();
            canvas.arc(
                x + (this.size / columns - (3 + addScaling)) / 2,
                y + (this.size / columns - (3 + addScaling)) / 2,
                this.size / columns - (3 + addScaling) + 10,
                0,
                2 * Math.PI,
                false
            );
            canvas.fillStyle = '#ffffff60';
            canvas.fill();
        }
        canvas.fillStyle = color;
        canvas.fillRect(x, y, this.size / columns - (3 + addScaling), this.size / columns - (3 + addScaling));
    }

    public drawWall(x: number, y: number, size: number, columns: number, rows: number, wall: Wall, canvas: CanvasRenderingContext2D) {
        switch (wall) {
            case Wall.TOP:
                canvas.beginPath();
                canvas.moveTo(x, y);
                canvas.lineTo(x + size / columns, y);
                canvas.stroke();
                break;
            case Wall.BOTTOM:
                canvas.beginPath();
                canvas.moveTo(x, y + size / rows);
                canvas.lineTo(x + size / columns, y + size / rows);
                canvas.stroke();
                break;
            case Wall.LEFT:
                canvas.beginPath();
                canvas.moveTo(x, y);
                canvas.lineTo(x, y + size / rows);
                canvas.stroke();
                break;
            case Wall.RIGHT:
                canvas.beginPath();
                canvas.moveTo(x + size / columns, y);
                canvas.lineTo(x + size / columns, y + size / rows);
                canvas.stroke();
                break;
        }
    }

    public checkNeighbours(cell: Cell) {
        const grid = this.grid;
        const row = cell.rowNumb;
        const col = cell.colNum;
        const neighbours = [];

        const top = row !== 0 ? grid[row - 1][col] : undefined;
        const right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        const bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        const left = col !== 0 ? grid[row][col - 1] : undefined;
        const isCornerPiece = col === 0 || row === 0 || col === grid.length - 1 || row === grid.length - 1 ? grid[row][col] : undefined;

        const isLeftCornerPiece = col === 0 ? grid[row][col] : undefined;
        const isRightCornerPiece = col === grid.length - 1 ? grid[row][col] : undefined;
        const isTopCornerPiece = row === 0 ? grid[row][col] : undefined;
        const isBottomCornerPiece = row === grid.length - 1 ? grid[row][col] : undefined;

        if (top && !top.visited) neighbours.push(top);
        if (right && !right.visited) neighbours.push(right);
        if (bottom && !bottom.visited) neighbours.push(bottom);
        if (left && !left.visited) neighbours.push(left);

        if (isLeftCornerPiece) isLeftCornerPiece.isLeftCorner = true;
        if (isRightCornerPiece) isRightCornerPiece.isRightCorner = true;
        if (isBottomCornerPiece) isBottomCornerPiece.isBottomCorner = true;
        if (isTopCornerPiece) isTopCornerPiece.istopCorner = true;

        if (isCornerPiece) isCornerPiece.isCorner = true;
        // console.log(neighbours)

        if (neighbours.length !== 0) {
            const random = Math.floor(Math.random() * neighbours.length);
            //  console.log(random)
            return neighbours[random];
        } else {
            return undefined;
        }
    }

    public runGeneration() {
        if (!this.current) return;

        this.current.visited = true;
        const next = this.checkNeighbours(this.current);

        if (next) {
            next.visited = true;
            this.stack.push(this.current);
            this.removeWall(this.current, next);
            this.current = next;
        } else if (this.stack.length > 0) {
            const cell = this.stack.pop();
            this.current = cell;
        }

        if (this.stack.length == 0 && !this.firstDraw) {
            return true;
        }
        if (this.firstDraw) this.firstDraw = false;
        return false;
    }
}

export default Maze;
