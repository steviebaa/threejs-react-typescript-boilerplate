import {GridHelper, LineBasicMaterial, MeshBasicMaterial, Vector3} from 'three';
import {World} from '@core/scene/World';
import {Wave} from '@classes/Wave';
import {createLinearPoints} from '@utils/points';
import {Fence} from '@classes/Fence';

export class Waves {
  static load(world: World) {
    Waves.addWaves(world);
    Waves.addFence(world);

    const gridHelper = new GridHelper(10, 10);
    gridHelper.position.set(0, -1, 0);
    world.scene.add(gridHelper);
  }

  static addWaves(world: World) {
    const waveLength = 10;

    // Create points along line
    const entryWavePoints = createLinearPoints(-waveLength, 0, 0.1);
    const exitWavePoints = createLinearPoints(0, waveLength, 0.1);

    // Create wave material
    const material = new LineBasicMaterial({color: 0x448aff});

    // Create entry wave
    const entryWave = new Wave({material, positions: entryWavePoints});

    // Create exit wave
    const exitWave = new Wave({material, positions: exitWavePoints});

    // Add waves to scene
    world.scene.add(entryWave.mesh, exitWave.mesh);

    world.animation.add((elapsed: number) => {
      // Angles
      const waveAngle = -elapsed * 2;
      const rotationAngle = waveAngle / 2;

      // Helper
      const getPtY = (pt: Vector3) => Math.sin(waveAngle + Math.PI * pt.x);

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

  static addFence(world: World) {
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
