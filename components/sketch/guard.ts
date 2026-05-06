import { Point, StrokeItem } from "./type";

const isNumber = (v: unknown): v is number =>
  typeof v === "number" && !Number.isNaN(v);

function isPoint(value: unknown): value is Point {
  if (typeof value !== "object" || value === null) return false;

  const p = value as Record<string, unknown>;

  return isNumber(p.x) && isNumber(p.y) && (p.t === undefined || isNumber(p.t));
}

function isStrokeItem(value: unknown): value is StrokeItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    Array.isArray(item.points) &&
    item.points.every(isPoint) &&
    (item.startTime === undefined || isNumber(item.startTime)) &&
    (item.endTime === undefined || isNumber(item.endTime))
  );
}

export function isStrokeItems(value: unknown): value is StrokeItem[] {
  return Array.isArray(value) && value.every(isStrokeItem);
}
