export type SawType = 'horizontal' | 'vertical';
export type OptMode = 'eco' | 'speed' | 'smart';
export type Grain = 'none' | 'horizontal' | 'vertical';

export interface EdgeBanding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface Module {
  id: string;
  name: string;
  color: string;
}

export interface Part {
  id: string;
  name: string;
  w: number;
  h: number;
  qty: number;
  grain: Grain;
  edges: EdgeBanding;
  moduleId?: string;
}

export interface Defect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Sheet {
  id: string;
  w: number;
  h: number;
  cost: number;
  qty: number;
  trim: number;
  defects: Defect[];
}

export interface Remnant {
  id: string;
  w: number;
  h: number;
  label: string;
  material: string;
}

export interface Material {
  id: string;
  name: string;
  thickness: number;
}

export interface Edgeband {
  id: string;
  name: string;
  thickness: number;
}

