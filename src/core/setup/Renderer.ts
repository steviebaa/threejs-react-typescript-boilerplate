import {PCFSoftShadowMap, WebGLRenderer} from 'three';

export interface IRendererOptions {
  containerId: string;
  /** Defaults to true */
  antiAlias?: boolean;
}

export class Renderer {
  static createWebGlRenderer(options: IRendererOptions) {
    const renderer = new WebGLRenderer({
      antialias: options.antiAlias ?? true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const container = document.getElementById(options.containerId);
    if (!container)
      throw new Error(
        `Could not find the dom element with id: ${options.containerId}`,
      );

    container.appendChild(renderer.domElement);

    return renderer;
  }
}
