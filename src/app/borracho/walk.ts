export interface Position {
  index: number;
  coordinate: number[];
  randomNumber: number;
}
export interface Walk {
  isMoreThanTwoBlocks: boolean;
  index: number;
  positions: Position[];
  point: number[]
}

export interface WalkRow {
  walk: Walk,
  hiddenDetail: boolean,
}
