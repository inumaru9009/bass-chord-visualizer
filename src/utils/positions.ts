export interface Position {
  id: string;
  label: string;
  fretMin: number;
  fretMax: number;
}

export const POSITIONS: Position[] = [
  { id: 'all',  label: '全体',  fretMin: 0,  fretMax: 21 },
  { id: 'pos1', label: 'Pos 1', fretMin: 0,  fretMax: 4  },
  { id: 'pos2', label: 'Pos 2', fretMin: 5,  fretMax: 9  },
  { id: 'pos3', label: 'Pos 3', fretMin: 7,  fretMax: 11 },
  { id: 'pos4', label: 'Pos 4', fretMin: 12, fretMax: 16 },
  { id: 'pos5', label: 'Pos 5', fretMin: 17, fretMax: 21 },
];
