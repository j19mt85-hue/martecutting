export interface Bin {
  w: number;
  h: number;
}

export interface Item {
  id: string;
  w: number;
  h: number;
  canRotate?: boolean;
}

export interface PlacedItem extends Item {
  x: number;
  y: number;
  rotated: boolean;
}

export interface BinResult {
  bin: Bin;
  items: PlacedItem[];
  utilization: number;
  freeSpaces: Bin[];
}

export interface EngineRequest {
  items: Item[];
  bins: Bin[];
  sawType: 'horizontal' | 'vertical'; // Guillotine cut constraints
  mode: 'speed' | 'eco' | 'smart';
  bladeWidth: number;
}

export interface EngineResponse {
  results: BinResult[];
  unplaced: Item[];
  totalUtilization: number;
  timeMs: number;
}
