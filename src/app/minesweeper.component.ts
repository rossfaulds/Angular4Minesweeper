import { Component } from '@angular/core';
import { GridItem } from './grid-item';

@Component({
  selector: 'Minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css'],
})


export class MinesweeperComponent {

  private gridSize = 10;
  private numMines = 10;

  private itemQueue: GridItem[] = [];
  private processed: GridItem[] = [];
  private minePositions: number[] = [];

  grid: GridItem[] = [];

  constructor() {
    for (let i = 0; i < this.gridSize; i++) {
      // this.grid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        this.grid[(i * this.gridSize) + j] = { row: i, col: j, isRevealed: false, mineNeighbours: 0 , isBomb: false, isFlagged: false};
      }
    }
    this.generateMines();
  }

  reveal(item: GridItem, event) {
    event.stopPropagation();
    item.isRevealed = true;
    if (item.isBomb) {
      console.log ('boom');
    }
    this.itemQueue.push(item);
    this.processQueue();
  }

  flag( item: GridItem, event) {
    event.stopPropagation();
    item.isFlagged = !item.isFlagged;
    return false;
  }

  outputGridType(item) {

      if (item.isRevealed && item.isBomb) {
        return '<i class="fa fa-bomb" aria-hidden="true"></i>';
      }


      if (item.isRevealed && !item.isBomb && item.mineNeighbours > 0 ) {
        return item.mineNeighbours;
      }

      if (!item.isRevealed && item.isFlagged) {
        return '<i class="fa fa-flag" aria-hidden="true"></i>';
      }

      if (!item.isRevealed || (item.isRevealed && !item.isBomb && item.mineNeighbours === 0 )) {
        return '<i class="fa fa-fw" aria-hidden="true"></i>';
      }

  }

  generateMines() {
    let minesPlaced = 0;

    while (minesPlaced < this.numMines) {
       const minePos = Math.floor(Math.random() * 99);
      if (!this.minePositions.some(x => x === minePos)) {
        this.minePositions.push(minePos);
        this.grid[ minePos].isBomb = true;
        minesPlaced++;
        this.updateNeighbours(minePos);
      }
    }
  }

 updateNeighbours(minePos) {

    const row = Math.floor(minePos / this.gridSize);
    const col  = minePos % this.gridSize;
     this.addOneToNeighbour(row - 1, col - 1);
     this.addOneToNeighbour(row - 1, col);
     this.addOneToNeighbour(row - 1, col + 1);

     this.addOneToNeighbour(row, col - 1);
     this.addOneToNeighbour(row, col + 1);

     this.addOneToNeighbour(row + 1, col - 1);
     this.addOneToNeighbour(row + 1, col);
     this.addOneToNeighbour(row + 1, col + 1);
 }

addOneToNeighbour( row, col) {
    if (row < 0 || row > 9) {
        return;
    }

    if (col < 0 || col > 9 ) {
      return;
    }
    this.grid[ row * this.gridSize + col].mineNeighbours += 1;
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
     this.pushNeighbour(row - 1, col - 1);
     this.pushNeighbour(row - 1, col);
     this.pushNeighbour(row - 1, col + 1);

     this.pushNeighbour(row, col - 1);
     this.pushNeighbour(row, col + 1);

     this.pushNeighbour(row + 1, col - 1);
     this.pushNeighbour(row + 1, col);
     this.pushNeighbour(row + 1, col + 1);

 }

 pushNeighbour(row, col) {
    if (row < 0 || row > 9) {
        return;
    }

    if (col < 0 || col > 9 ) {
      return;
    }

    const item = this.grid[ row * this.gridSize + col];

    if (!this.itemQueue.some( x => x === item) &&
        !this.processed.some ( y => y === item) ) {
         this.itemQueue.push(item);
    }
 }
}
