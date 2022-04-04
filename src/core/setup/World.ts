import {PerspectiveCamera, WebGLRenderer, Clock, Scene} from 'three';
import {OrbitControls as ThreeOrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Camera, ICameraOptions} from '@core/setup/Camera';
import {Controls, IControlsOptions} from '@core/setup/Controls';
import {IRendererOptions, Renderer} from '@core/setup/Renderer';
import {IThreeScene, ThreeScene} from '@core/setup/ThreeScene';

export interface IWorld {
  renderer: IRendererOptions;
  camera?: ICameraOptions;
  controls?: IControlsOptions;
  scene?: IThreeScene;

  animate?: {
    /** Defaults to 30fps */
    fps?: number;
  };
}

export class World {
  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public controls: ThreeOrbitControls;
  public readonly clock = new Clock();

  private _interval = 30 / 1000;
  private _delta = 0;

  private _animations: ((time: number) => void)[] = [];

  constructor(config: IWorld) {
    this.init(config);
  }

  private init = (options: IWorld) => {
    this.camera = Camera.createPerspectiveCamera(options.camera ?? {});
    this.renderer = Renderer.createWebGlRenderer(options.renderer);
    this.scene = ThreeScene.create(options.scene);
    this.controls = Controls.createOrbitControls(
      this.camera,
      this.renderer,
      options.controls ?? {},
    );

    // Add resize handler
    window.addEventListener('resize', this.handleWindowResize);

    // Add animation loop
    if (options.animate) {
      this._interval = options.animate.fps / 1000 ?? this._interval;
    }
    this.animate();
  };

  private animate = () => {
    // Update controls
    this.controls && this.controls.update();

    // Loop the animation
    requestAnimationFrame(this.animate);

    // Render the scene when the interval has elapsed
    this._delta += this.clock.getDelta();
    if (this._delta > this._interval) {
      this._animations.forEach(animation => animation(this.clock.elapsedTime));
      this.renderer.render(this.scene, this.camera);
      this._delta = this._delta % this._interval;
    }
  };

  private handleWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  public animation = {
    add: (fn: (elapsed: number) => void) => {
      this._animations.push(fn);
    },
  };
}
