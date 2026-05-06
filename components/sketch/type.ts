import { StyleProp, ViewStyle } from "react-native";

export type Point = { x: number; y: number; t?: number };
export type Stroke = Point[];

export interface StrokeItem {
  startTime?: number;
  endTime?: number;
  points: Point[];
}

export interface SketchRef {
  clearCanvas: () => void;
  getStrokeItems: () => StrokeItem[];
  getStrokes: () => Stroke[];
  undo: () => void;
}

export interface SketchProps {
  strokeColor?: string;
  strokeWidth?: number;
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
  onStrokeStart?: () => void;
  onStrokeEnd?: (items: StrokeItem[]) => void;
}
