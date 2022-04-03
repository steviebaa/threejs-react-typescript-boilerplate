import {BufferGeometry, CatmullRomCurve3, Line, Material, Vector3} from 'three';

interface IWave {
  positions: Vector3[];
  material: Material;
}

export class Wave {
  public curve: CatmullRomCurve3;
  public points: Vector3[];
  public geometry: BufferGeometry;
  public mesh: Line;

  constructor({positions, material}: IWave) {
    this.curve = new CatmullRomCurve3(positions);

    this.points = this.curve.getPoints(positions.length);

    this.geometry = new BufferGeometry();

    this.mesh = new Line(this.geometry, material);

    return this;
  }
}
