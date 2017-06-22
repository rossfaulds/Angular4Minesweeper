export interface GridItem {
  row: number;
  col: number;
  isRevealed: boolean;
  isFlagged: boolean;
  isBomb: boolean;
  mineNeighbours: number;

}
