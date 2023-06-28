import { Canvas, CanvasRenderingContext2D } from 'canvas';
import Cell from './Cell';

class Maze {
    private initiated = false;
    private grid: Cell[][] = [];
    private readonly stack: Cell[] = [];
    private mazeInfo: string[][][] = [];
    private readonly drawInfo: { isCenter: number[]; playersInMaze: number[] } = { isCenter: [], playersInMaze: [] };
    private firstDraw = true;
    private current: Cell | undefined;

    public constructor(private readonly size: number, private readonly rows: number, private readonly columns: number) {}

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
        let totalNumber = 0;
        this.mazeInfo = [];
        for (let r = 0; r < this.rows; r++) {
            this.mazeInfo[r] = [];
            for (let c = 0; c < this.columns; c++) {
                const cell = this.grid[r][c];
                this.mazeInfo[r][c] = [];
                //00 is no wall
                //10 is wall
                //11 is corner wall
                if (r == 0 && c == 0) {
                    cell.walls.topWall = false;
                }
                if (r == this.rows - 1 && c == this.columns - 1) {
                    cell.walls.bottomWall = false;
                }

                cell.walls.topWall ? (cell.istopCorner ? this.mazeInfo[r][c].push('11') : this.mazeInfo[r][c].push('10')) : this.mazeInfo[r][c].push('00');
                cell.walls.bottomWall
                    ? cell.isBottomCorner
                        ? this.mazeInfo[r][c].push('11')
                        : this.mazeInfo[r][c].push('10')
                    : this.mazeInfo[r][c].push('00');
                cell.walls.leftWall ? (cell.isLeftCorner ? this.mazeInfo[r][c].push('11') : this.mazeInfo[r][c].push('10')) : this.mazeInfo[r][c].push('00');
                cell.walls.rightWall ? (cell.isRightCorner ? this.mazeInfo[r][c].push('11') : this.mazeInfo[r][c].push('10')) : this.mazeInfo[r][c].push('00');
                cell.isRoomCenter ? this.mazeInfo[r][c].push('10') : this.mazeInfo[r][c].push('00');
                cell.isRoomCenter ? this.drawInfo.isCenter.push(totalNumber) : null;

                totalNumber++;
            }
        }
        this.grid = [];
    }

    public insertExistingMaze(maze: Maze) {
        Object.assign(this, maze);
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
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.columns; c++) {
                    this.show(
                        {
                            colNum: c,
                            rowNumb: r,
                            parentSize: 0,
                            isCorner: false,
                            isLeftCorner: false,
                            isRightCorner: false,
                            isBottomCorner: false,
                            istopCorner: false,
                            lootTable: [],
                            isRoomCenter: false,
                            visited: false,
                            walls: {
                                topWall: false,
                                bottomWall: false,
                                leftWall: false,
                                rightWall: false,
                            },
                        },
                        this.size,
                        this.rows,
                        this.columns,
                        context
                    );
                }
                //    totalNumber++;
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

        const matchArray = this.mazeInfo[cell.rowNumb][cell.colNum].join('').match(/.{1,2}/g);

        if (matchArray) {
            if (matchArray[0] == '10' || matchArray[0] == '11') this.drawTopWall(x, y, size, columns, canvas);
            if (matchArray[3] == '10' || matchArray[3] == '11') this.drawRightWall(x, y, size, columns, rows, canvas);
            if (matchArray[2] == '10' || matchArray[2] == '11') this.drawLeftWall(x, y, size, rows, canvas);
            if (matchArray[1] == '10' || matchArray[1] == '11') this.drawBottomWall(x, y, size, columns, rows, canvas);

            if (matchArray[4] == '10') {
                this.highlight(cell, this.columns, 'red', canvas);
            }
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
        //addScaling == undefined ? addScaling = 0 : null;
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

    public drawTopWall(x: number, y: number, size: number, columns: number, canvas: CanvasRenderingContext2D) {
        canvas.beginPath();
        canvas.moveTo(x, y);
        canvas.lineTo(x + size / columns, y);
        canvas.stroke();
    }

    public drawRightWall(x: number, y: number, size: number, columns: number, rows: number, canvas: CanvasRenderingContext2D) {
        canvas.beginPath();
        canvas.moveTo(x + size / columns, y);
        canvas.lineTo(x + size / columns, y + size / rows);
        canvas.stroke();
    }

    public drawBottomWall(x: number, y: number, size: number, columns: number, rows: number, canvas: CanvasRenderingContext2D) {
        canvas.beginPath();
        canvas.moveTo(x, y + size / rows);
        canvas.lineTo(x + size / columns, y + size / rows);
        canvas.stroke();
    }

    public drawLeftWall(x: number, y: number, size: number, rows: number, canvas: CanvasRenderingContext2D) {
        canvas.beginPath();
        canvas.moveTo(x, y);
        canvas.lineTo(x, y + size / rows);
        canvas.stroke();
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

        //cols < >
        // rows are ^ v

        const isLeftCornerPiece = col === 0 ? grid[row][col] : undefined;
        const isRightCornerPiece = col === grid.length - 1 ? grid[row][col] : undefined;
        const isTopCornerPiece = row === 0 ? grid[row][col] : undefined;
        const isBottomCornerPiece = row === grid.length - 1 ? grid[row][col] : undefined;
        //left <
        //right >
        // if(!top) top.isCorner = true;
        // if(!right) right.isCorner = true;
        // if(!bottom) bottom.isCorner = true;
        // if(!left) left.isCorner = true;

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
            // for(let gridArr of this.grid){
            //     for(let cells of gridArr){
            //         cells.parentGrid = []
            //     }
            // }
            return true;
        }
        if (this.firstDraw) this.firstDraw = false;
        return false;
    }
}

export default Maze;
