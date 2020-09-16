export interface Node {
  id: number;
  parentId: number | null;
  children?: Node[];
}

export type Pair = [number, number];
