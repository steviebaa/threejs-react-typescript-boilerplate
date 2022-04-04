import {AxesHelper, Color, Scene} from 'three';

export interface IThreeScene {
  /** Defaults to 0x202020 */
  backgroundColor?: string;
  /** Defaults to false */
  axesHelper?: boolean;
  /** Defaults to 10 */
  axesHelperSize?: number;
}

export class ThreeScene {
  static create = (options?: IThreeScene) => {
    const scene = new Scene();

    // Set background color
    scene.background = new Color(options?.backgroundColor ?? 0x202020);

    // Add axes helper
    if (options?.axesHelper) {
      scene.add(new AxesHelper(options.axesHelperSize ?? 10));
    }

    return scene;
  };
}
