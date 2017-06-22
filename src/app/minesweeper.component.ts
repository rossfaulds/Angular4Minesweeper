import { Component, Input } from '@angular/core';
import { GridItem } from './grid-item';

@Component({
  selector: 'Minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})


export class MinesweeperComponent {

  @Input() gridsize = 10;
  @Input() nummines = 10;
  grid: GridItem[] = [];

  private itemQueue: GridItem[] = [];
  private processed: GridItem[] = [];
  private minePositions: number[] = [];

  ngOnInit() {
    this.initialiseMinefield();
  }

  initialiseMinefield() {

    for (let i = 0; i < this.gridsize; i++) {
      // this.grid[i] = [];
      for (let j = 0; j < this.gridsize; j++) {
        this.grid[(i * this.gridsize) + j] = { row: i, col: j, isRevealed: false, mineNeighbours: 0, isBomb: false, isFlagged: false };
      }
    }
    this.generateMines();

  }

  reveal(item: GridItem, event) {
    event.stopPropagation();
    item.isRevealed = true;
    if (item.isBomb) {
      console.log('boom');
    }
    this.itemQueue.push(item);
    this.processQueue();
  }

  flag(item: GridItem, event) {
    event.stopPropagation();
    item.isFlagged = !item.isFlagged;
    return false;
  }

  outputGridType(item) {

    if (item.isRevealed && item.isBomb) {
      return '<i class="fa fa-bomb" aria-hidden="true"></i>';
    }

    if (item.isRevealed && !item.isBomb && item.mineNeighbours > 0) {
      return item.mineNeighbours;
    }

    if (!item.isRevealed && item.isFlagged) {
      return '<i class="fa fa-flag" aria-hidden="true"></i>';
    }

    if (!item.isRevealed || (item.isRevealed && !item.isBomb && item.mineNeighbours === 0)) {
      return '<i class="fa fa-fw" aria-hidden="true"></i>';
    }
  }

  generateMines() {
    let minesPlaced = 0;

    while (minesPlaced < this.nummines) {
      const minePos = Math.floor(Math.random() * (this.gridsize * this.gridsize) - 1 );
      if (!this.minePositions.some(x => x === minePos)) {
        this.minePositions.push(minePos);
        this.grid[minePos].isBomb = true;
        minesPlaced++;
        this.updateNeighbours(minePos);
      }
    }
  }

  updateNeighbours(minePos) {

    const row = Math.floor(minePos / this.gridsize);
    const col = minePos % this.gridsize;
    this.addOneToNeighbour(row - 1, col - 1);
    this.addOneToNeighbour(row - 1, col);
    this.addOneToNeighbour(row - 1, col + 1);

    this.addOneToNeighbour(row, col - 1);
    this.addOneToNeighbour(row, col + 1);

    this.addOneToNeighbour(row + 1, col - 1);
    this.addOneToNeighbour(row + 1, col);
    this.addOneToNeighbour(row + 1, col + 1);
  }

  withinBounds(row, col) {
    if (row < 0 || row >= this.gridsize) {
      return false;
    }
    if (col < 0 || col >= this.gridsize) {
      return false;
    }
    return true;
  }

  addOneToNeighbour(row, col) {
    if (!this.withinBounds(row, col)) {
      return;
    }

    this.grid[row * this.gridsize + col].mineNeighbours += 1;
  }

  processQueue() {
    this.processed = [];
    while (this.itemQueue.length > 0) {
      const currentItem = this.itemQueue.pop();
      this.processed.push(currentItem);
      if (currentItem.mineNeighbours === 0) {
        currentItem.isRevealed = true;
        this.checkNeighbours(currentItem.row, currentItem.col);
      }
      if (currentItem.mineNeighbours > 0 && !currentItem.isBomb) {
        currentItem.isRevealed = true;
      }
    }
  }

  checkNeighbours(row, col) {
    this.pushNeighbourToCheck(row - 1, col - 1);
    this.pushNeighbourToCheck(row - 1, col);
    this.pushNeighbourToCheck(row - 1, col + 1);

    this.pushNeighbourToCheck(row, col - 1);
    this.pushNeighbourToCheck(row, col + 1);

    this.pushNeighbourToCheck(row + 1, col - 1);
    this.pushNeighbourToCheck(row + 1, col);
    this.pushNeighbourToCheck(row + 1, col + 1);
  }

  pushNeighbourToCheck(row, col) {
    if (!this.withinBounds(row, col)) {
      return;
    }

    const item = this.grid[ (row * this.gridsize) + col];

    if (!this.itemQueue.some(x => x === item) &&
      !this.processed.some(y => y === item)) {
      this.itemQueue.push(item);
    }
  }
}
