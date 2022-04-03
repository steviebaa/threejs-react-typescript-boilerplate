import {Vector3} from 'three';

export function createLinearPoints(start: number, stop: number, inc: number) {
  const points = [];

  for (let i = start; i <= stop; i += inc) {
    points.push(new Vector3(i, 0, 0));
  }

  return points;
}
