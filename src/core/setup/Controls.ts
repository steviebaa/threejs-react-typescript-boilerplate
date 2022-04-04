import {Camera, WebGLRenderer} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export interface IControlsOptions {
  /** Defaults to true */
  damping?: boolean;
  /** Defaults to 0.2 */
  dampingFactor?: number;
}

export class Controls {
  static createOrbitControls(
    camera: Camera,
    renderer: WebGLRenderer,
    options?: IControlsOptions,
  ) {
    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // An animation loop is required when either damping or auto-rotation are enabled
    controls.enableDamping = options?.damping ?? true;
    controls.dampingFactor = options?.dampingFactor ?? 0.2;
    controls.screenSpacePanning = false;

    return controls;
  }
}
