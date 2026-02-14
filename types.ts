export enum AppScreen {
  LOCK = 'LOCK',
  TIMELINE = 'TIMELINE',
  POLAROID_WALL = 'POLAROID_WALL',
  LOVE_LETTER = 'LOVE_LETTER'
}

export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  rotation: number; // degrees for CSS rotate
  type: 'left' | 'right'; // layout alignment
  location?: string;
}

export interface PolaroidPhoto {
  id: string;
  src: string;
  caption: string;
  date: string;
  rotation: number;
  top: number; // percentage
  left: number; // percentage
  zIndex: number;
}