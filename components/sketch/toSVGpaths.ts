export type Point = { x: number; y: number; t?: number };
export type Stroke = Point[];

export interface StrokeItem {
  diatric?: boolean;
  startTime?: number;
  endTime?: number;
  points: Point[];
}
/**
 * Converts nested coordinate arrays into an SVG 'd' path string.
 * @param strokes - An array of strokes, where each stroke is an array of Points.
 * @returns A string formatted for the 'd' attribute of an SVG <Path />
 */
export const toSVGpaths = (strokes: Stroke[]): string[] => {
  return strokes.map((stroke: Point[]) => {
    if (stroke.length === 1) {
      const { x, y } = stroke[0];

      // tiny 0.1px line to force rendering
      return `M ${x} ${y} L ${x + 0.1} ${y + 0.1}`;
    }

    let d = `M ${stroke[0].x} ${stroke[0].y} `;

    for (let i = 1; i < stroke.length - 1; i++) {
      const current = stroke[i];
      const next = stroke[i + 1];

      const midX = ((current.x + next.x) / 2).toFixed(2);
      const midY = ((current.y + next.y) / 2).toFixed(2);

      d += `Q ${current.x} ${current.y} ${midX} ${midY} `;
    }

    // 👇 IMPORTANT: Finish at the last actual point
    const last = stroke[stroke.length - 1];
    d += `L ${last.x} ${last.y}`;

    return d.trim();
  });
};
