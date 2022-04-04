import {GridHelper, LineBasicMaterial, MeshBasicMaterial, Vector3} from 'three';
import {World} from '@core/setup/World';
import {Wave} from '@classes/Wave';
import {Fence} from '@classes/Fence';
import {createLinearPoints} from '@utils/points';

export class Waves {
  constructor(private world: World) {
    this.load();
  }

  private load = () => {
    const {world} = this;
    this.addWaves();
    this.addFence();

    const gridHelper = new GridHelper(10, 10);
    gridHelper.position.set(0, -1, 0);
    world.scene.add(gridHelper);
  };

  private addWaves() {
    const {world} = this;

    const waveLength = 10;

    // Create points along line
    const entryWavePoints = createLinearPoints(-waveLength, 0, 0.03);
    const exitWavePoints = createLinearPoints(0, waveLength, 0.03);

    // Create wave material
    const material = new LineBasicMaterial({color: 0x448aff});

    // Create entry wave
    const entryWave = new Wave({material, positions: entryWavePoints});

    // Create exit wave
    const exitWave = new Wave({material, positions: exitWavePoints});

    // Add waves to scene
    world.scene.add(entryWave.mesh, exitWave.mesh);

    const animationProps = {
      speed: 1,
      period: 1,
      amplitude: 1,
    };

    const folder = world.gui.addFolder('Multipliers');
    folder.add(animationProps, 'speed', 0, 4);
    folder.add(animationProps, 'period', 0, 4);
    folder.add(animationProps, 'amplitude', 0, 4);

    world.animation.add((elapsed: number) => {
      // Angles
      const waveAngle = -elapsed * 2 * animationProps.speed;
      const rotationAngle = waveAngle / 2;

      // Helper
      const getPtY = (pt: Vector3) =>
        Math.sin(waveAngle + (Math.PI / animationProps.period) * pt.x) *
        animationProps.amplitude;

      /** Wave one adjustments */
      // Positions
      entryWavePoints.forEach(pt => (pt.y = getPtY(pt)));
      entryWave.geometry.setFromPoints(entryWavePoints);
      entryWave.mesh.rotation.set(rotationAngle, 0, 0);

      /** Wave two adjustments */
      // Amplitude collapse
      const amplitudeMultiplier = Math.abs(Math.cos(rotationAngle));
      exitWavePoints.forEach(pt => (pt.y = getPtY(pt) * amplitudeMultiplier));
      exitWave.geometry.setFromPoints(exitWavePoints);
    });
  }

  private addFence() {
    const {world} = this;

    const fence = new Fence({
      position: new Vector3(0, 0, -1),
      material: new MeshBasicMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.7,
      }),
    });
    world.scene.add(fence.group);
  }
}
