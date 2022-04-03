import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  PCFSoftShadowMap,
  AxesHelper,
  Clock,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

interface IWorld {
  renderer: {
    containerId: string;
    /** Defaults to true */
    antiAlias?: boolean;
  };

  scene?: {
    /** Defaults to 0x202020 */
    backgroundColor?: string;
    /** Defaults to false */
    axesHelper?: boolean;
    /** Defaults to 10 */
    axesHelperSize?: number;
  };

  camera?: {
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
  };

  animate?: {
    /** Defaults to 30fps */
    fps?: number;
  };

  controls?: {
    /** Defaults to true */
    damping?: boolean;
    /** Defaults to 0.2 */
    dampingFactor?: number;
  };
}

export class World {
  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public controls: OrbitControls;
  public readonly clock = new Clock();

  private _interval = 30 / 1000;
  private _delta = 0;

  private _animations: ((time: number) => void)[] = [];

  constructor(config: IWorld) {
    this._init(config);
  }

  private _init = (options: IWorld) => {
    this._createCamera(options);
    this._createRenderer(options);
    this._createScene(options);
    this._createControls(options);

    window.addEventListener('resize', this._onWindowResize);

    if (options.animate) {
      this._interval = options.animate.fps / 1000 ?? this._interval;
    }
    this._animate();
  };

  private _createControls = (options: IWorld) => {
    const {camera, renderer} = this;

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // An animation loop is required when either damping or auto-rotation are enabled
    controls.enableDamping = options.controls?.damping ?? true;
    controls.dampingFactor = options.controls?.dampingFactor ?? 0.2;
    controls.screenSpacePanning = false;

    this.controls = controls;
  };

  private _createCamera = (options: IWorld) => {
    const ratio = window.innerWidth / window.innerHeight;
    const camera = new PerspectiveCamera(
      options.camera?.fov ?? 75,
      ratio,
      options.camera?.nearClipping ?? 0.1,
      options.camera?.farClipping ?? 1000,
    );

    // Z axis up
    if (options.camera?.zAxisUp) camera.up.set(0, 0, 1);

    // Position
    camera.position.set(
      options.camera?.position?.x ?? 10,
      options.camera?.position?.y ?? 10,
      options.camera?.position?.z ?? 10,
    );

    this.camera = camera;
  };

  private _createRenderer = (options: IWorld) => {
    const renderer = new WebGLRenderer({
      antialias: options.renderer.antiAlias ?? true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    const container = document.getElementById(options.renderer.containerId);
    if (!container) return;

    container.appendChild(renderer.domElement);

    this.renderer = renderer;
  };

  private _createScene = (options: IWorld) => {
    const scene = new Scene();
    scene.background = new Color(options.scene?.backgroundColor ?? 0x202020);
    this.scene = scene;

    if (options.scene?.axesHelper) {
      scene.add(new AxesHelper(options.scene.axesHelperSize ?? 10));
    }
  };

  private _animate = () => {
    this.controls && this.controls.update();

    requestAnimationFrame(this._animate);

    this._delta += this.clock.getDelta();

    if (this._delta > this._interval) {
      this._animations.forEach(animation => animation(this.clock.elapsedTime));
      this.renderer.render(this.scene, this.camera);
      this._delta = this._delta % this._interval;
    }
  };

  private _onWindowResize = () => {
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
