export type ElementType = 
  | 'button'
  | 'input'
  | 'text'
  | 'image'
  | 'timer'
  | 'progress'
  | 'qr'
  | 'social'
  | 'slider'
  | 'toggle';

export interface Element {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  backgroundColor: string;
  rotation: number;
  opacity: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '900';
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor: string;
  borderWidth: number;
  zIndex: number;
}

export interface HistoryState {
  elements: Element[];
  selectedId: string | null;
}

export interface Template {
  name: string;
  elements: Element[];
}