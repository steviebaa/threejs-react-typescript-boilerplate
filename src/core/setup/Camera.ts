import {PerspectiveCamera} from 'three';

export interface ICameraOptions {
  /** Defaults to false */
  zAxisUp?: boolean;
  /** Defaults to 75 */
  fov?: number;
  /** Defaults to 0.1 */
  nearClipping?: number;
  /** Defaults to 1000 */
  farClipping?: number;
  /** Defaults to 10,10,10 */
  position?: {x?: number; y?: number; z?: number};
}

export class Camera {
  static createPerspectiveCamera(options: ICameraOptions) {
    const ratio = window.innerWidth / window.innerHeight;
    const camera = new PerspectiveCamera(
      options.fov ?? 75,
      ratio,
      options.nearClipping ?? 0.1,
      options.farClipping ?? 1000,
    );

    // Z axis up
    if (options.zAxisUp) camera.up.set(0, 0, 1);

    // Position
    camera.position.set(
      options.position?.x ?? 10,
      options.position?.y ?? 10,
      options.position?.z ?? 10,
    );

    return camera;
  }
}
